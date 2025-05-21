
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProposalDetail from "@/components/proposals/ProposalDetail";
import DeliberationStages, { DeliberationStage } from "@/components/proposals/DeliberationStages";
import StageParticipation from "@/components/proposals/StageParticipation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, LightbulbIcon, Scale, Pencil, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ProposalView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("proposal");
  
  // Mock data for demonstration purposes
  const [deliberationStages, setDeliberationStages] = useState<DeliberationStage[]>([
    {
      id: "problem-identification",
      name: "Problem Identification",
      description: "Define the issue and its scope clearly",
      icon: BrainCircuit,
      duration: 7,
      requirements: [
        { type: "participation", value: 15, description: "Min 15 participants", current: 8 },
        { type: "diversity", value: 3, description: "Min 3 different perspectives", current: 2 },
        { type: "time", value: 7, description: "7 days duration", current: 3 }
      ],
      isActive: true,
      isCompleted: false,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      progress: 42
    },
    {
      id: "brainstorming",
      name: "Brainstorming Solutions",
      description: "Generate creative solutions to address the problem",
      icon: LightbulbIcon,
      duration: 10,
      requirements: [
        { type: "participation", value: 20, description: "Min 20 participants" },
        { type: "diversity", value: 5, description: "Min 5 different perspectives" },
        { type: "time", value: 10, description: "10 days duration" }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0
    },
    {
      id: "evaluation",
      name: "Evaluation of Proposals",
      description: "Assess solutions based on feasibility, impact, and resources",
      icon: Scale,
      duration: 7,
      requirements: [
        { type: "participation", value: 25, description: "Min 25 participants" },
        { type: "diversity", value: 7, description: "Min 7 different perspectives" },
        { type: "time", value: 7, description: "7 days duration" }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0
    },
    {
      id: "refinement",
      name: "Collaborative Refinement",
      description: "Improve the most promising solutions through collective input",
      icon: Pencil,
      duration: 5,
      requirements: [
        { type: "participation", value: 15, description: "Min 15 participants" },
        { type: "diversity", value: 5, description: "Min 5 different perspectives" },
        { type: "time", value: 5, description: "5 days duration" }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0
    },
    {
      id: "decision",
      name: "Final Decision",
      description: "Select the best solution through weighted consensus",
      icon: CheckCircle,
      duration: 3,
      requirements: [
        { type: "participation", value: 30, description: "Min 30 participants" },
        { type: "diversity", value: 8, description: "Min 8 different perspectives" },
        { type: "time", value: 3, description: "3 days duration" }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0
    }
  ]);

  const currentStage = deliberationStages.find(stage => stage.isActive) || deliberationStages[0];
  
  const handleParticipation = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update current stage progress and counts (just for demo)
    setDeliberationStages(prev => {
      return prev.map(stage => {
        if (stage.id === currentStage.id) {
          // Update participation count
          const participationReq = stage.requirements.find(r => r.type === "participation");
          if (participationReq && participationReq.current !== undefined) {
            participationReq.current += 1;
          }
          
          // Update progress based on time elapsed and participation
          const timeProgress = Math.min(
            Math.floor(((Date.now() - (stage.startDate?.getTime() || 0)) / 
                        ((stage.endDate?.getTime() || 0) - (stage.startDate?.getTime() || 0))) * 100),
            100
          );
          
          const participationProgress = participationReq ? 
            Math.min(Math.floor((participationReq.current / participationReq.value) * 100), 100) : 0;
          
          // Average the progress metrics
          const newProgress = Math.floor((timeProgress + participationProgress) / 2);
          
          return {
            ...stage,
            progress: newProgress,
            requirements: [...stage.requirements]
          };
        }
        return stage;
      });
    });
    
    // In a real implementation, this would save the user's contribution to the database
    console.log("Saved contribution:", data);
  };

  // Progress the stages automatically based on requirements being met
  useEffect(() => {
    const checkStageCompletion = () => {
      const currentIndex = deliberationStages.findIndex(stage => stage.isActive);
      if (currentIndex === -1) return;
      
      const current = deliberationStages[currentIndex];
      
      // Check if all requirements are met
      const allRequirementsMet = current.requirements.every(req => {
        if (req.current === undefined) return false;
        return req.current >= req.value;
      });
      
      // Also check if timeline is complete
      const timelineComplete = current.endDate ? current.endDate.getTime() <= Date.now() : false;
      
      if (allRequirementsMet || timelineComplete) {
        // Move to next stage
        if (currentIndex < deliberationStages.length - 1) {
          const newStages = [...deliberationStages];
          newStages[currentIndex] = {
            ...newStages[currentIndex],
            isActive: false,
            isCompleted: true,
            progress: 100
          };
          
          const nextStage = newStages[currentIndex + 1];
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + nextStage.duration);
          
          newStages[currentIndex + 1] = {
            ...nextStage,
            isActive: true,
            startDate,
            endDate,
            progress: 0,
            requirements: nextStage.requirements.map(req => {
              if (req.type === "participation" || req.type === "diversity") {
                return { ...req, current: 0 };
              }
              if (req.type === "time") {
                return { ...req, current: 0 };
              }
              return req;
            })
          };
          
          setDeliberationStages(newStages);
          
          toast({
            title: "Stage Complete",
            description: `Moving to next stage: ${nextStage.name}`
          });
        }
      }
    };
    
    // In real app, this would be triggered by backend events, not a timer
    const interval = setInterval(checkStageCompletion, 5000);
    return () => clearInterval(interval);
  }, [deliberationStages, toast]);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl py-10 px-4">
        <Tabs defaultValue="proposal" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="proposal">Proposal Details</TabsTrigger>
            <TabsTrigger value="deliberation">Deliberation Process</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposal">
            <ProposalDetail />
          </TabsContent>
          
          <TabsContent value="deliberation">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tiered Deliberation Process</CardTitle>
                <CardDescription>
                  This proposal is moving through a structured decision-making process with specific requirements for each stage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeliberationStages 
                  proposalId={id || ""} 
                  stages={deliberationStages} 
                  currentStageId={currentStage.id} 
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StageParticipation
                proposalId={id || ""}
                currentStage={currentStage}
                onParticipate={handleParticipation}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>About This Stage</CardTitle>
                  <CardDescription>What happens in the {currentStage.name} stage?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {currentStage.id === "problem-identification" && (
                      <div>
                        <p>In this initial stage, the community works together to thoroughly understand and define the problem:</p>
                        <ul>
                          <li>Identify the specific issues that need to be addressed</li>
                          <li>Gather relevant data and background information</li>
                          <li>Define the scope and boundaries of the problem</li>
                          <li>Ensure diverse perspectives are represented in problem framing</li>
                        </ul>
                        <p>The goal is to create a shared understanding of what needs to be solved before moving on to solutions.</p>
                      </div>
                    )}
                    
                    {currentStage.id === "brainstorming" && (
                      <div>
                        <p>During the brainstorming stage, participants generate as many potential solutions as possible:</p>
                        <ul>
                          <li>Focus on quantity of ideas rather than quality initially</li>
                          <li>Build on others' suggestions constructively</li>
                          <li>Consider unconventional or innovative approaches</li>
                          <li>Document all ideas regardless of immediate feasibility</li>
                        </ul>
                        <p>The community aims to explore a wide range of possible solutions before narrowing down options.</p>
                      </div>
                    )}
                    
                    {currentStage.id === "evaluation" && (
                      <div>
                        <p>In the evaluation stage, the community assesses each proposed solution:</p>
                        <ul>
                          <li>Analyze feasibility, resources required, and potential impact</li>
                          <li>Consider benefits and drawbacks of each proposal</li>
                          <li>Evaluate alignment with community values and goals</li>
                          <li>Identify potential unintended consequences</li>
                        </ul>
                        <p>The objective is to thoughtfully assess all options before moving to refinement.</p>
                      </div>
                    )}
                    
                    {currentStage.id === "refinement" && (
                      <div>
                        <p>During refinement, the most promising solutions are improved through collaborative effort:</p>
                        <ul>
                          <li>Address weaknesses identified in the evaluation stage</li>
                          <li>Combine complementary elements from different proposals</li>
                          <li>Develop implementation details and timelines</li>
                          <li>Seek feedback from those most affected by the decision</li>
                        </ul>
                        <p>The focus is on strengthening solutions to prepare for the final decision stage.</p>
                      </div>
                    )}
                    
                    {currentStage.id === "decision" && (
                      <div>
                        <p>In the final decision stage, the community selects the best solution:</p>
                        <ul>
                          <li>Review refined proposals with all relevant information</li>
                          <li>Engage in final deliberation focused on consensus-building</li>
                          <li>Use weighted voting that considers expertise and impact</li>
                          <li>Document decision rationale for transparency</li>
                        </ul>
                        <p>The goal is to arrive at a high-quality decision with broad community support.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProposalView;
