import React from "react";
import Navigation from "@/components/Navigation";
import ProposalsList from "@/components/proposals/ProposalsList";

/**
 * LEGACY - Página de propuestas (rutas).
 *
 * TODO: Preparar integración con lógica Web3 (Ethers.js, wallet, fallback mock).
 * TODO: Marcar como deprecated cuando se migre a ProposalsPage scaffolded.
 */

const Proposals: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl py-10 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Community Proposals</h1>
          <p className="text-muted-foreground max-w-2xl">
            A structured system for community decision-making through carefully phased deliberation. 
            All proposals go through presentation, discussion, and weighted voting stages.
          </p>
        </header>
        
        <ProposalsList />
      </main>
    </div>
  );
};

export default Proposals;
