
import React from "react";
import Navigation from "@/components/Navigation";
import ConsensusVisualization from "@/components/proposals/ConsensusVisualization";

const ProposalConsensus: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl py-10 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Proposal Consensus Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            Visualize community agreement on active proposals, identify common ground between opposing viewpoints,
            and discover potential compromise solutions.
          </p>
        </header>
        
        <ConsensusVisualization />
      </main>
    </div>
  );
};

export default ProposalConsensus;
