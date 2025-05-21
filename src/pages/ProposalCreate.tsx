
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProposalForm from "@/components/proposals/ProposalForm";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";

const ProposalCreate: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl py-10 px-4">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate("/proposals")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Proposals
        </Button>
        
        <h1 className="text-3xl font-medium mb-8">Create a New Proposal</h1>
        
        <ProposalForm />
      </main>
    </div>
  );
};

export default ProposalCreate;
