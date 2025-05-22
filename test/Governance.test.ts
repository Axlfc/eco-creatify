import { ethers } from "hardhat";
import { expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "@nomicfoundation/hardhat-chai-matchers";

chai.use(chaiAsPromised);

// Utilidades para commit-reveal compatibles con ethers v6 y abi.encodePacked
const keccak256Packed = ethers.solidityPackedKeccak256;

describe("Governance", function () {
  let governance: any;
  let owner: any, voter1: any, voter2: any, auditor: any, nonVoter: any;
  const salt1 = "s1";
  const salt2 = "s2";

  beforeEach(async function () {
    [owner, voter1, voter2, auditor, nonVoter] = await ethers.getSigners();
    const Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy();
    // Asignar roles iniciales
    await governance.connect(owner).assignRole(voter1.address, await governance.VOTER_ROLE());
    await governance.connect(owner).assignRole(voter2.address, await governance.VOTER_ROLE());
    await governance.connect(owner).assignRole(auditor.address, await governance.AUDITOR_ROLE());
    await governance.connect(owner).assignRole(owner.address, await governance.CREATOR_ROLE());
    await governance.connect(owner).assignRole(voter1.address, await governance.CREATOR_ROLE());
    await governance.connect(owner).assignRole(voter2.address, await governance.CREATOR_ROLE());
  });

  it("permite crear una propuesta", async function () {
    await expect(
      governance.connect(voter1).createProposal("Propuesta 1", 3600, 1, true)
    ).to.emit(governance, "ProposalCreated");
    const proposal = await governance.getProposal(1);
    expect(proposal.creator).to.equal(voter1.address);
    expect(proposal.description).to.equal("Propuesta 1");
  });

  it("flujo completo de commit-reveal y ejecución", async function () {
    // Crear propuesta
    await governance.connect(voter1).createProposal("Propuesta 2", 3600, 2, true);
    // Commit de ambos votantes (ambos a favor)
    const commit1 = keccak256Packed(["bool","string"],[true, salt1]);
    const commit2 = keccak256Packed(["bool","string"],[true, salt2]);
    await governance.connect(voter1).commitVote(1, commit1);
    await governance.connect(voter2).commitVote(1, commit2);
    // Iniciar fase reveal
    await governance.connect(owner).startRevealPhase(1);
    // Reveal de ambos
    await expect(governance.connect(voter1).revealVote(1, true, salt1)).to.emit(governance, "Voted");
    await expect(governance.connect(voter2).revealVote(1, true, salt2)).to.emit(governance, "Voted");
    // Cerrar propuesta
    await governance.connect(owner).closeProposal(1);
    let proposal = await governance.getProposal(1);
    expect(proposal.votesFor).to.equal(2);
    expect(proposal.votesAgainst).to.equal(0);
    expect(proposal.state).to.equal(2); // Closed (enum: 2)
    // Ejecutar propuesta
    await expect(
      governance.connect(owner).executeProposal(1)
    ).to.emit(governance, "ProposalExecuted");
    proposal = await governance.getProposal(1);
    expect(proposal.state).to.equal(3); // Executed (enum: 3)
  });

  it("no permite commit después de iniciar fase reveal", async function () {
    await governance.connect(voter1).createProposal("Propuesta 2", 3600, 1, true);
    const commit1 = keccak256Packed(["bool","string"],[true, salt1]);
    await governance.connect(voter1).commitVote(1, commit1);
    await governance.connect(owner).startRevealPhase(1);
    const commit2 = keccak256Packed(["bool","string"],[false, salt2]);
    await expect(
      governance.connect(voter2).commitVote(1, commit2)
    ).to.be.revertedWith("Fase de commit finalizada");
  });

  it("no permite reveal sin commit previo", async function () {
    await governance.connect(voter1).createProposal("Propuesta 3", 3600, 1, true);
    await governance.connect(owner).startRevealPhase(1);
    await expect(
      governance.connect(voter1).revealVote(1, true, salt1)
    ).to.be.revertedWith("No hay commit");
  });

  it("no permite reveal dos veces por el mismo usuario", async function () {
    await governance.connect(voter1).createProposal("Propuesta 4", 3600, 1, true);
    const commit1 = keccak256Packed(["bool","string"],[true, salt1]);
    await governance.connect(voter1).commitVote(1, commit1);
    await governance.connect(owner).startRevealPhase(1);
    await governance.connect(voter1).revealVote(1, true, salt1);
    await expect(
      governance.connect(voter1).revealVote(1, true, salt1)
    ).to.be.revertedWith("Ya has revelado");
  });

  it("no permite reveal con salt incorrecto", async function () {
    await governance.connect(voter1).createProposal("Propuesta 5", 3600, 1, true);
    const commit1 = keccak256Packed(["bool","string"],[true, salt1]);
    await governance.connect(voter1).commitVote(1, commit1);
    await governance.connect(owner).startRevealPhase(1);
    await expect(
      governance.connect(voter1).revealVote(1, false, "otroSalt")
    ).to.be.revertedWith("Commit no coincide");
  });

  it("no permite cerrar propuesta si no se han revelado los votos suficientes", async function () {
    await governance.connect(voter1).createProposal("Propuesta 6", 3600, 2, true);
    const commit1 = keccak256Packed(["bool","string"],[true, salt1]);
    const commit2 = keccak256Packed(["bool","string"],[true, salt2]);
    await governance.connect(voter1).commitVote(1, commit1);
    await governance.connect(voter2).commitVote(1, commit2);
    await governance.connect(owner).startRevealPhase(1);
    await governance.connect(voter1).revealVote(1, true, salt1);
    // Solo un voto revelado, quorum=2
    await expect(
      governance.connect(owner).closeProposal(1)
    ).to.be.revertedWith("No se puede cerrar: tiempo o quorum insuficiente");
  });

  it("gestiona roles y cancelación de propuestas", async function () {
    await governance.connect(owner).assignRole(nonVoter.address, await governance.VOTER_ROLE());
    await governance.connect(owner).assignRole(nonVoter.address, await governance.CREATOR_ROLE());
    await governance.connect(nonVoter).createProposal("Propuesta 7", 3600, 1, true);
    await governance.connect(owner).cancelProposal(1);
    const proposal = await governance.getProposal(1);
    expect(proposal.state).to.equal(5); // Cancelled
  });

  it("no permite commit ni reveal si no tienes el rol VOTER_ROLE", async function () {
    await governance.connect(voter1).createProposal("Propuesta 8", 3600, 1, true);
    const commit = keccak256Packed(["bool","string"],[true, salt1]);
    await expect(
      governance.connect(nonVoter).commitVote(1, commit)
    ).to.be.revertedWith(/AccessControl: account/);
    await governance.connect(owner).startRevealPhase(1);
    await expect(
      governance.connect(nonVoter).revealVote(1, true, salt1)
    ).to.be.revertedWith(/AccessControl: account/);
  });

  it("should create a proposal", async () => {
    // TODO: Implement test for createProposal
  });

  it("should allow voting on a proposal", async () => {
    // TODO: Implement test for vote
  });

  it("should close a proposal", async () => {
    // TODO: Implement test for closeProposal
  });

  it("should execute a proposal", async () => {
    // TODO: Implement test for executeProposal
  });

  it("should assign a role to a user", async () => {
    // TODO: Implement test for assignRole
  });

  it("should get a proposal by id", async () => {
    // TODO: Implement test for getProposal
  });

  it("should list all proposals", async () => {
    // TODO: Implement test for getAllProposals
  });
});
