
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertTriangle,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";

// Mock data - would be fetched from Supabase in a real implementation
const mockProposalData = {
  "1": {
    id: "1",
    title: "Implement Community Garden in Central District",
    description: "This proposal suggests creating a community garden in the central district to promote sustainability, community engagement, and local food production. The garden would be maintained collectively by community members. The space would include individual plots for families, shared herb gardens, composting facilities, and a small gathering area for workshops and community events. Initial funding would come from community grants, with ongoing maintenance supported by a small fee structure and volunteer labor. This project addresses environmental sustainability while building stronger community bonds.",
    category: "Environment",
    author: "GreenInitiative",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    phase: "presentation",
    phaseEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 19).toISOString(),
    argumentsFor: [],
    argumentsAgainst: [],
    votes: {
      for: 0,
      against: 0,
      abstain: 0
    }
  },
  "2": {
    id: "2",
    title: "Create Youth Technology Mentorship Program",
    description: "This proposal aims to establish a mentorship program connecting tech professionals with underserved youth interested in technology careers. The program would include weekly sessions, project-based learning, and career guidance. We would partner with local schools and tech companies to identify participants and mentors, respectively. The program would run for 12 weeks per cohort, with two cohorts per year. Success metrics would include participant satisfaction, project completion rates, and long-term educational and career outcomes for participants.",
    category: "Education",
    author: "TechForAll",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    phase: "discussion",
    phaseEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    argumentsFor: [
      {
        id: "arg1",
        author: "EducationAdvocate",
        content: "This program addresses the critical need for diversity in tech by providing early exposure and mentorship to underrepresented youth. Similar programs have shown substantial success in other communities.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        votes: 12
      },
      {
        id: "arg2",
        author: "TechIndustryInsider",
        content: "As someone working in the tech industry, I can confirm there's significant interest from professionals in volunteering their time for initiatives like this. Many companies also offer volunteer hours that could support this program.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        votes: 8
      }
    ],
    argumentsAgainst: [
      {
        id: "arg3",
        author: "BudgetWatcher",
        content: "While the intentions are good, the proposal doesn't adequately address the costs of equipment and facilities. These programs typically require significant infrastructure that isn't accounted for in the current budget.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        votes: 5
      }
    ],
    votes: {
      for: 0,
      against: 0,
      abstain: 0
    }
  },
  "3": {
    id: "3",
    title: "Restructure Community Forum Moderation Guidelines",
    description: "This proposal suggests revisions to our community forum moderation guidelines to ensure fair and consistent enforcement while protecting free expression. The changes would clarify rules and appeals processes. Specifically, we would implement a three-tier violation system with clear consequences, establish a rotating panel of community moderators, create a transparent appeals process, and publish quarterly moderation statistics. These changes aim to balance effective content moderation with community trust and transparency.",
    category: "Governance",
    author: "OpenDialogue",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    phase: "voting",
    phaseEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    argumentsFor: [
      {
        id: "arg4",
        author: "ForumRegular",
        content: "The current guidelines are too vague, leading to inconsistent moderation. Having clearer tiers of violations and consequences would help everyone understand what's expected.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        votes: 18
      },
      {
        id: "arg5",
        author: "TransparencyAdvocate",
        content: "Publishing moderation statistics quarterly is an excellent accountability mechanism that will build trust in the moderation process.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        votes: 14
      }
    ],
    argumentsAgainst: [
      {
        id: "arg6",
        author: "CurrentModerator",
        content: "While I support improving guidelines, the rotating panel approach may lead to inconsistency as different moderators will have different standards despite the guidelines.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2.5).toISOString(),
        votes: 9
      },
      {
        id: "arg7",
        author: "SimplicitySeeking",
        content: "This proposal adds unnecessary bureaucracy to moderation. The appeals process in particular seems cumbersome and could bog down moderators in procedural matters.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(),
        votes: 7
      }
    ],
    votes: {
      for: 35,
      against: 15,
      abstain: 6
    }
  },
  "4": {
    id: "4",
    title: "Establish Annual Community Recognition Awards",
    description: "This proposal suggests creating an annual awards program to recognize outstanding contributions to our community. Categories would include innovation, inclusivity, mentorship, and community service. The selection process would involve community nominations followed by committee review. Winners would receive public recognition, a digital badge, and a small grant to further their community work. This program aims to celebrate positive contributions, inspire others, and reinforce our community values.",
    category: "Community",
    author: "RecognitionMatters",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    phase: "completed",
    phaseEndsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    argumentsFor: [
      {
        id: "arg8",
        author: "CommunityBuilder",
        content: "Recognition is a powerful motivator for continued contributions. This program would acknowledge those who go above and beyond while encouraging others to engage more deeply with our community.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        votes: 22
      },
      {
        id: "arg9",
        author: "NonprofitLeader",
        content: "The small grants component is particularly valuable as it provides tangible support for continued community work, not just symbolic recognition.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        votes: 19
      }
    ],
    argumentsAgainst: [
      {
        id: "arg10",
        author: "EqualityFocused",
        content: "Award programs can sometimes reinforce existing visibility biases. Those who are already well-known may receive more nominations regardless of the actual impact of their contributions.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7.5).toISOString(),
        votes: 11
      },
      {
        id: "arg11",
        author: "ResourceConscious",
        content: "The time and resources required to administer this program could be better spent on direct community improvements. The nomination process, committee reviews, and award ceremony all require significant organization.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        votes: 7
      }
    ],
    votes: {
      for: 56,
      against: 23,
      abstain: 8
    },
    result: "approved"
  }
};

interface Argument {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  votes: number;
}

interface ProposalDetailData {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  phase: string;
  phaseEndsAt: string;
  argumentsFor: Argument[];
  argumentsAgainst: Argument[];
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  result?: "approved" | "rejected";
}

const ProposalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [proposal, setProposal] = useState<ProposalDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newArgument, setNewArgument] = useState("");
  const [argumentType, setArgumentType] = useState<"for" | "against">("for");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [userVote, setUserVote] = useState<"for" | "against" | "abstain" | null>(null);
  const [isSubmittingArgument, setIsSubmittingArgument] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  
  // Mock data fetch
  useEffect(() => {
    setLoading(true);
    
    // Simulating API call delay
    setTimeout(() => {
      if (id && mockProposalData[id as keyof typeof mockProposalData]) {
        setProposal(mockProposalData[id as keyof typeof mockProposalData]);
      } else {
        toast({
          title: "Proposal not found",
          description: "The requested proposal could not be found.",
          variant: "destructive",
        });
        navigate("/proposals");
      }
      setLoading(false);
    }, 500);
  }, [id, navigate, toast]);

  // Update time remaining
  useEffect(() => {
    if (!proposal) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(proposal.phaseEndsAt);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Phase ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [proposal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading proposal details...</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Proposal not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleArgumentSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to participate in the discussion",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!newArgument.trim()) {
      toast({
        title: "Empty argument",
        description: "Please write your argument before submitting",
        variant: "destructive",
      });
      return;
    }

    if (proposal.phase !== "discussion") {
      toast({
        title: "Discussion phase only",
        description: "Arguments can only be submitted during the discussion phase",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingArgument(true);

    try {
      // Here we would submit to Supabase
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect the new argument
      const newArgumentObj: Argument = {
        id: `arg-${Date.now()}`,
        author: user?.username || "Anonymous",
        content: newArgument,
        createdAt: new Date().toISOString(),
        votes: 0
      };

      setProposal(prev => {
        if (!prev) return prev;
        
        if (argumentType === "for") {
          return {
            ...prev,
            argumentsFor: [...prev.argumentsFor, newArgumentObj]
          };
        } else {
          return {
            ...prev,
            argumentsAgainst: [...prev.argumentsAgainst, newArgumentObj]
          };
        }
      });
      
      setNewArgument("");
      
      toast({
        title: "Argument submitted",
        description: "Your argument has been added to the discussion",
      });
    } catch (error) {
      console.error("Error submitting argument:", error);
      toast({
        title: "Error",
        description: "Failed to submit your argument. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingArgument(false);
    }
  };

  const handleVote = async (vote: "for" | "against" | "abstain") => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on proposals",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (proposal.phase !== "voting") {
      toast({
        title: "Voting phase only",
        description: "Votes can only be cast during the voting phase",
        variant: "destructive",
      });
      return;
    }

    if (userVote === vote) {
      toast({
        title: "Vote already cast",
        description: "You've already voted this way on this proposal",
      });
      return;
    }

    setIsSubmittingVote(true);

    try {
      // Here we would submit to Supabase
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect the new vote
      setUserVote(vote);
      
      setProposal(prev => {
        if (!prev) return prev;
        
        // If changing vote, adjust previous vote count
        const updatedVotes = { ...prev.votes };
        
        if (userVote) {
          updatedVotes[userVote] -= 1;
        }
        
        updatedVotes[vote] += 1;
        
        return {
          ...prev,
          votes: updatedVotes
        };
      });
      
      toast({
        title: "Vote recorded",
        description: `Your vote has been recorded as "${vote}"`,
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Calculate total votes for progress bar
  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
  const approvalPercentage = totalVotes > 0 
    ? Math.round((proposal.votes.for / totalVotes) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/proposals")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Proposals
      </Button>
      
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{proposal.category}</Badge>
                <Badge 
                  variant="outline" 
                  className={
                    proposal.phase === "presentation" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                    proposal.phase === "discussion" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                    proposal.phase === "voting" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  }
                >
                  {proposal.phase.charAt(0).toUpperCase() + proposal.phase.slice(1)} Phase
                </Badge>
              </div>
              <CardTitle className="text-2xl">{proposal.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2 flex items-center gap-4">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {proposal.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(proposal.createdAt)}
                </span>
              </div>
            </div>
            
            {proposal.phase !== "completed" && (
              <div className="flex flex-col items-end">
                <span className="text-sm flex items-center text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {timeRemaining}
                </span>
              </div>
            )}
            
            {proposal.phase === "completed" && proposal.result && (
              <Badge 
                className={
                  proposal.result === "approved" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }
              >
                {proposal.result === "approved" ? "Approved" : "Rejected"}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none dark:prose-invert mb-6">
            <p>{proposal.description}</p>
          </div>
          
          {(proposal.phase === "voting" || proposal.phase === "completed") && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Approval</span>
                <span>{approvalPercentage}% ({proposal.votes.for} of {totalVotes} votes)</span>
              </div>
              <Progress 
                value={approvalPercentage} 
                className="h-2" 
                indicatorColor={
                  approvalPercentage >= 66 ? "bg-green-500" :
                  approvalPercentage >= 33 ? "bg-amber-500" :
                  "bg-red-500"
                }
              />
            </div>
          )}
          
          {proposal.phase === "presentation" && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md text-sm">
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">Presentation Phase</p>
                  <p className="mt-1 text-blue-600 dark:text-blue-400">
                    This proposal is in the presentation phase. Community members are reviewing it before the discussion begins.
                    The discussion phase will start automatically when the presentation period ends.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {proposal.phase === "discussion" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add Your Argument</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="for" onValueChange={(value) => setArgumentType(value as "for" | "against")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="for" className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Argument For
                </TabsTrigger>
                <TabsTrigger value="against" className="flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Argument Against
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your perspective with evidence or reasoning..."
                  value={newArgument}
                  onChange={(e) => setNewArgument(e.target.value)}
                  rows={4}
                  disabled={!isAuthenticated}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Focus on evidence, reasoning, and community impact
                  </p>
                  <Button 
                    onClick={handleArgumentSubmit}
                    disabled={!isAuthenticated || isSubmittingArgument || !newArgument.trim()}
                  >
                    Submit Argument
                  </Button>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {proposal.phase === "voting" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/40 p-4 rounded-md mb-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Weighted Voting System</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Votes are weighted based on your participation history. Your vote weight is calculated from your account age, 
                    previous constructive participation, and quality of past contributions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleVote("for")}
                disabled={!isAuthenticated || isSubmittingVote}
                variant="outline"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Support ({proposal.votes.for})
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleVote("against")}
                disabled={!isAuthenticated || isSubmittingVote}
                variant="outline"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Oppose ({proposal.votes.against})
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleVote("abstain")}
                disabled={!isAuthenticated || isSubmittingVote}
                variant="outline"
              >
                Abstain ({proposal.votes.abstain})
              </Button>
            </div>
            
            {userVote && (
              <div className="mt-4 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-md text-center text-sm text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4 inline-block mr-1" />
                You have voted: <span className="font-medium">{userVote.charAt(0).toUpperCase() + userVote.slice(1)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {(proposal.phase === "discussion" || proposal.phase === "voting" || proposal.phase === "completed") && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Discussion Arguments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="for">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="for" className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  For ({proposal.argumentsFor.length})
                </TabsTrigger>
                <TabsTrigger value="against" className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4" />
                  Against ({proposal.argumentsAgainst.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="for">
                {proposal.argumentsFor.length > 0 ? (
                  <div className="space-y-4">
                    {proposal.argumentsFor.map(arg => (
                      <Card key={arg.id} className="bg-blue-50/50 dark:bg-blue-950/50 border-blue-100 dark:border-blue-900">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                            <span className="font-medium text-blue-700 dark:text-blue-300">{arg.author}</span>
                            <span>{formatDate(arg.createdAt)}</span>
                          </div>
                          <p className="text-sm">{arg.content}</p>
                          <div className="mt-2 flex justify-end">
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {arg.votes}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">No supporting arguments yet</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="against">
                {proposal.argumentsAgainst.length > 0 ? (
                  <div className="space-y-4">
                    {proposal.argumentsAgainst.map(arg => (
                      <Card key={arg.id} className="bg-red-50/50 dark:bg-red-950/50 border-red-100 dark:border-red-900">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                            <span className="font-medium text-red-700 dark:text-red-300">{arg.author}</span>
                            <span>{formatDate(arg.createdAt)}</span>
                          </div>
                          <p className="text-sm">{arg.content}</p>
                          <div className="mt-2 flex justify-end">
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {arg.votes}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">No opposing arguments yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProposalDetail;
