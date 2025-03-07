
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, Filter } from "lucide-react";
import ProposalCard, { ProposalPhase } from "./ProposalCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Mock data for now, will be replaced with real data from Supabase
const mockProposals = [
  {
    id: "1",
    title: "Implement Community Garden in Central District",
    description: "This proposal suggests creating a community garden in the central district to promote sustainability, community engagement, and local food production. The garden would be maintained collectively by community members.",
    category: "Environment",
    author: "GreenInitiative",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    phase: "presentation" as ProposalPhase,
    argumentsCount: 0,
    votesCount: 0,
    remainingTime: "19 hours remaining",
  },
  {
    id: "2",
    title: "Create Youth Technology Mentorship Program",
    description: "This proposal aims to establish a mentorship program connecting tech professionals with underserved youth interested in technology careers. The program would include weekly sessions, project-based learning, and career guidance.",
    category: "Education",
    author: "TechForAll",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    phase: "discussion" as ProposalPhase,
    argumentsCount: 12,
    votesCount: 0,
    remainingTime: "48 hours remaining",
  },
  {
    id: "3",
    title: "Restructure Community Forum Moderation Guidelines",
    description: "This proposal suggests revisions to our community forum moderation guidelines to ensure fair and consistent enforcement while protecting free expression. The changes would clarify rules and appeals processes.",
    category: "Governance",
    author: "OpenDialogue",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    phase: "voting" as ProposalPhase,
    argumentsCount: 24,
    votesCount: 56,
    remainingTime: "24 hours remaining",
  },
  {
    id: "4",
    title: "Establish Annual Community Recognition Awards",
    description: "This proposal suggests creating an annual awards program to recognize outstanding contributions to our community. Categories would include innovation, inclusivity, mentorship, and community service.",
    category: "Community",
    author: "RecognitionMatters",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    phase: "completed" as ProposalPhase,
    argumentsCount: 18,
    votesCount: 87,
    remainingTime: "",
  }
];

const categories = [
  "All Categories",
  "Environment",
  "Education",
  "Technology",
  "Governance",
  "Community",
  "Infrastructure",
  "Culture",
  "Health",
  "Safety"
];

const ProposalsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPhase, setCurrentPhase] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const handleCreateProposal = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a proposal",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    navigate("/proposals/create");
  };

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "All Categories" || proposal.category === categoryFilter;
    
    const matchesPhase = 
      currentPhase === "all" || proposal.phase === currentPhase;
    
    return matchesSearch && matchesCategory && matchesPhase;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search proposals..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            className="flex-1 sm:flex-initial"
            onClick={handleCreateProposal}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={currentPhase} onValueChange={setCurrentPhase}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="presentation">Presentation</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} {...proposal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No proposals found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProposalsList;
