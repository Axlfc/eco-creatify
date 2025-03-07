
import React from "react";
import Navigation from "@/components/Navigation";
import ProposalDetail from "@/components/proposals/ProposalDetail";

const ProposalView: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl py-10 px-4">
        <ProposalDetail />
      </main>
    </div>
  );
};

export default ProposalView;
