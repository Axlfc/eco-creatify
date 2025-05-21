// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Governance
 * @notice Contrato principal de gobernanza para propuestas y votaciones descentralizadas.
 * @dev Usa AccessControl de OpenZeppelin para gestión de roles y permisos.
 */
contract Governance is AccessControl, Pausable, ReentrancyGuard {
    /// @notice Rol para creadores de propuestas
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    /// @notice Rol para votantes
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    /// @notice Rol para auditores (solo lectura)
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    /// @notice Rol de administración/gobernanza
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");

    /**
     * @notice Estados posibles de una propuesta
     */
    enum ProposalState { Pending, Active, Closed, Executed, Rejected, Cancelled }

    /**
     * @notice Estructura de una propuesta
     */
    struct Proposal {
        uint256 id;
        address creator;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 quorum;
        bool openVoting;
        ProposalState state;
        uint256 votesFor;
        uint256 votesAgainst;
        // mapping(address => bool) hasVoted; // No se puede mapear en structs públicos, usar mapping externo
    }

    /// @notice Contador de propuestas
    uint256 public proposalCount;
    /// @notice Mapeo de id a propuesta
    mapping(uint256 => Proposal) public proposals;
    /// @notice Mapeo de propuesta a votantes
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // ===================== EVENTOS =====================

    /**
     * @notice Se emite al crear una propuesta
     */
    event ProposalCreated(uint256 indexed id, address indexed creator, string description);
    /**
     * @notice Se emite al votar una propuesta
     */
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    /**
     * @notice Se emite al cerrar una propuesta
     */
    event ProposalClosed(uint256 indexed proposalId, bool approved);
    /**
     * @notice Se emite al ejecutar una propuesta
     */
    event ProposalExecuted(uint256 indexed proposalId);
    /**
     * @notice Se emite al rechazar una propuesta
     */
    event ProposalRejected(uint256 indexed proposalId);
    /**
     * @notice Se emite al cancelar una propuesta
     */
    event ProposalCancelled(uint256 indexed proposalId);
    /**
     * @notice Se emite al asignar un rol
     */
    event RoleAssigned(address indexed user, bytes32 indexed role);

    // ===================== CONSTRUCTOR =====================

    /**
     * @notice Inicializa los roles y asigna el rol de gobernanza al deployer
     */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GOVERNANCE_ROLE, msg.sender);
    }

    // ===================== FUNCIONES PRINCIPALES =====================

    /**
     * @notice Pausa el contrato en caso de emergencia
     * @dev Solo GOVERNANCE_ROLE
     */
    function pause() external onlyRole(GOVERNANCE_ROLE) {
        _pause();
    }

    /**
     * @notice Despausa el contrato
     * @dev Solo GOVERNANCE_ROLE
     */
    function unpause() external onlyRole(GOVERNANCE_ROLE) {
        _unpause();
    }

    /**
     * @notice Crea una nueva propuesta
     * @param description Descripción de la propuesta
     * @param duration Duración en segundos
     * @param quorum Quorum mínimo requerido
     * @param openVoting Si la votación es abierta
     * @dev Solo usuarios con rol CREATOR_ROLE
     */
    function createProposal(string memory description, uint256 duration, uint256 quorum, bool openVoting) external onlyRole(CREATOR_ROLE) whenNotPaused {
        require(bytes(description).length > 0, "Descripcion requerida");
        require(duration > 0, "Duracion debe ser mayor a 0");
        require(quorum > 0, "Quorum debe ser mayor a 0");
        proposalCount++;
        uint256 id = proposalCount;
        Proposal storage p = proposals[id];
        p.id = id;
        p.creator = msg.sender;
        p.description = description;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + duration;
        p.quorum = quorum;
        p.openVoting = openVoting;
        p.state = ProposalState.Active;
        emit ProposalCreated(id, msg.sender, description);
    }

    /**
     * @notice Vota una propuesta
     * @param proposalId ID de la propuesta
     * @param support true = a favor, false = en contra
     * @dev Solo usuarios con rol VOTER_ROLE
     */
    function vote(uint256 proposalId, bool support) external onlyRole(VOTER_ROLE) whenNotPaused nonReentrant {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Active, "Propuesta no activa");
        require(block.timestamp >= p.startTime, "Votacion no iniciada");
        require(block.timestamp <= p.endTime, "Votacion finalizada");
        require(!hasVoted[proposalId][msg.sender], "Ya has votado");
        hasVoted[proposalId][msg.sender] = true;
        if (support) {
            p.votesFor++;
        } else {
            p.votesAgainst++;
        }
        emit Voted(proposalId, msg.sender, support);
    }

    /**
     * @notice Cierra la votación de una propuesta
     * @param proposalId ID de la propuesta
     * @dev Solo GOVERNANCE_ROLE
     */
    function closeProposal(uint256 proposalId) external onlyRole(GOVERNANCE_ROLE) whenNotPaused {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Active, "Propuesta no activa");
        require(isRevealPhase[proposalId], "Debe estar en fase reveal");
        require(block.timestamp > p.endTime || (p.votesFor + p.votesAgainst) >= p.quorum, "No se puede cerrar: tiempo o quorum insuficiente");
        p.state = ProposalState.Closed;
        bool approved = p.votesFor > p.votesAgainst && (p.votesFor + p.votesAgainst) >= p.quorum;
        emit ProposalClosed(proposalId, approved);
        if (!approved) {
            p.state = ProposalState.Rejected;
            emit ProposalRejected(proposalId);
        }
    }

    /**
     * @notice Ejecuta una propuesta aprobada
     * @param proposalId ID de la propuesta
     * @dev Solo GOVERNANCE_ROLE
     */
    function executeProposal(uint256 proposalId) external onlyRole(GOVERNANCE_ROLE) whenNotPaused nonReentrant {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Closed, "Propuesta no cerrada");
        require(p.votesFor > p.votesAgainst, "Propuesta no aprobada");
        require((p.votesFor + p.votesAgainst) >= p.quorum, "Quorum no alcanzado");
        p.state = ProposalState.Executed;
        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancela una propuesta activa
     * @param proposalId ID de la propuesta
     * @dev Solo GOVERNANCE_ROLE o el creador de la propuesta
     */
    function cancelProposal(uint256 proposalId) external whenNotPaused {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Active, "Solo propuestas activas pueden cancelarse");
        require(hasRole(GOVERNANCE_ROLE, msg.sender) || p.creator == msg.sender, "Solo governance o creador puede cancelar");
        p.state = ProposalState.Cancelled;
        emit ProposalCancelled(proposalId);
    }

    /**
     * @notice Asigna un rol a un usuario
     * @param user Dirección del usuario
     * @param role Rol a asignar
     * @dev Solo GOVERNANCE_ROLE
     */
    function assignRole(address user, bytes32 role) external onlyRole(GOVERNANCE_ROLE) whenNotPaused {
        grantRole(role, user);
        emit RoleAssigned(user, role);
    }

    // ===================== FUNCIONES DE CONSULTA =====================

    /**
     * @notice Consulta una propuesta por ID
     * @param proposalId ID de la propuesta
     * @return Proposal struct
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposals[proposalId].id != 0, "Propuesta inexistente");
        return proposals[proposalId];
    }

    /**
     * @notice Lista todas las propuestas
     * @dev Devuelve un array de propuestas
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        Proposal[] memory all = new Proposal[](proposalCount);
        for (uint256 i = 0; i < proposalCount; i++) {
            all[i] = proposals[i+1];
        }
        return all;
    }

    // ===================== FUNCIONES AUXILIARES =====================
    // Puedes añadir funciones para cancelar/rechazar propuestas, cambiar parámetros, etc.

    // ===================== COMMIT-REVEAL VOTING =====================

    /// @notice Fase de revelado de votos por propuesta
    mapping(uint256 => bool) public isRevealPhase;
    /// @notice Hash de commit de cada usuario por propuesta
    mapping(uint256 => mapping(address => bytes32)) public voteCommits;
    /// @notice Marca si el usuario ya reveló su voto en una propuesta
    mapping(uint256 => mapping(address => bool)) public hasRevealed;

    /**
     * @notice Envía el hash del voto (commit) para una propuesta
     * @param proposalId ID de la propuesta
     * @param commitHash Hash keccak256(abi.encodePacked(support, salt))
     * @dev Solo usuarios con rol VOTER_ROLE. Solo durante fase de votación (no reveal).
     */
    function commitVote(uint256 proposalId, bytes32 commitHash) external onlyRole(VOTER_ROLE) whenNotPaused {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Active, "Propuesta no activa");
        require(!isRevealPhase[proposalId], "Fase de commit finalizada");
        require(voteCommits[proposalId][msg.sender] == 0, "Ya has enviado commit");
        voteCommits[proposalId][msg.sender] = commitHash;
    }

    /**
     * @notice Revela el voto real para una propuesta
     * @param proposalId ID de la propuesta
     * @param support true = a favor, false = en contra
     * @param salt Valor secreto usado en el commit
     * @dev Solo durante la fase de reveal. Solo si envió commit antes. No permite doble revelado.
     */
    function revealVote(uint256 proposalId, bool support, string memory salt) external onlyRole(VOTER_ROLE) whenNotPaused nonReentrant {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Active, "Propuesta no activa");
        require(isRevealPhase[proposalId], "No es fase de reveal");
        require(voteCommits[proposalId][msg.sender] != 0, "No hay commit");
        require(!hasRevealed[proposalId][msg.sender], "Ya has revelado");
        require(!hasVoted[proposalId][msg.sender], "Ya has votado");
        bytes32 expected = keccak256(abi.encodePacked(support, salt));
        require(voteCommits[proposalId][msg.sender] == expected, "Commit no coincide");
        hasVoted[proposalId][msg.sender] = true;
        hasRevealed[proposalId][msg.sender] = true;
        if (support) {
            p.votesFor++;
        } else {
            p.votesAgainst++;
        }
        emit Voted(proposalId, msg.sender, support);
    }

    /**
     * @notice Inicia la fase de reveal para una propuesta
     * @param proposalId ID de la propuesta
     * @dev Solo GOVERNANCE_ROLE. Solo si la propuesta está activa y no está ya en reveal.
     */
    function startRevealPhase(uint256 proposalId) external onlyRole(GOVERNANCE_ROLE) whenNotPaused {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Propuesta inexistente");
        require(p.state == ProposalState.Active, "Propuesta no activa");
        require(!isRevealPhase[proposalId], "Ya en fase reveal");
        isRevealPhase[proposalId] = true;
    }
}
