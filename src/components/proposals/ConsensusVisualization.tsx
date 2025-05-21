
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  GitMerge,
  Handshake,
  Info,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Vote,
} from "lucide-react";

// Mock data - in a real implementation, this would be fetched from Supabase
const mockProposalsData = [
  {
    id: "2",
    title: "Create Youth Technology Mentorship Program",
    phase: "discussion",
    totalArguments: 3,
    agreementScore: 68,
    keyPoints: [
      { point: "Need for diversity in tech", agreementLevel: 85 },
      { point: "Professional volunteer interest", agreementLevel: 78 },
      { point: "Budget concerns", agreementLevel: 45 },
      { point: "Impact on participants", agreementLevel: 90 },
    ],
    opposingViews: [
      { 
        for: "Similar programs have shown substantial success in other communities",
        against: "The costs of equipment and facilities aren't adequately addressed",
        compromisePotential: 75,
        compromiseSuggestion: "Secure corporate sponsorship for equipment needs while maintaining the mentorship structure"
      },
      { 
        for: "There's significant interest from tech professionals to volunteer",
        against: "The proposal requires significant infrastructure",
        compromisePotential: 60,
        compromiseSuggestion: "Start with a pilot program using existing public facilities before scaling"
      }
    ]
  },
  {
    id: "3",
    title: "Restructure Community Forum Moderation Guidelines",
    phase: "voting",
    totalArguments: 4,
    agreementScore: 52,
    keyPoints: [
      { point: "Clear violation tiers", agreementLevel: 80 },
      { point: "Rotating moderators", agreementLevel: 35 },
      { point: "Transparency reports", agreementLevel: 75 },
      { point: "Appeals process", agreementLevel: 40 },
    ],
    opposingViews: [
      { 
        for: "Current guidelines are too vague, leading to inconsistent moderation",
        against: "Rotating panel may lead to inconsistency in standards",
        compromisePotential: 65,
        compromiseSuggestion: "Implement clear guidelines with a mixed panel of permanent and rotating moderators"
      },
      { 
        for: "Publishing statistics is an excellent accountability mechanism",
        against: "The proposal adds unnecessary bureaucracy to moderation",
        compromisePotential: 50,
        compromiseSuggestion: "Simplify the reporting structure while maintaining key transparency metrics"
      }
    ]
  },
  {
    id: "1",
    title: "Implement Community Garden in Central District",
    phase: "presentation",
    totalArguments: 0,
    agreementScore: 95,
    keyPoints: [
      { point: "Environmental impact", agreementLevel: 95 },
      { point: "Community building", agreementLevel: 90 },
      { point: "Food security", agreementLevel: 85 },
      { point: "Educational opportunities", agreementLevel: 88 },
    ],
    opposingViews: []
  }
];

// Colors for consensus visualization
const consensusColors = {
  high: "#0EA5E9", // Bright blue for high consensus
  medium: "#A3E635", // Lime green for medium consensus
  low: "#F97316", // Orange for low consensus
  veryLow: "#EA384C", // Red for very low consensus/conflict
};

const getConsensusColor = (level: number) => {
  if (level >= 80) return consensusColors.high;
  if (level >= 60) return consensusColors.medium;
  if (level >= 40) return consensusColors.low;
  return consensusColors.veryLow;
};

interface CompromiseItemProps {
  forPoint: string;
  againstPoint: string;
  potential: number;
  suggestion: string;
}

const CompromiseItem: React.FC<CompromiseItemProps> = ({ 
  forPoint, 
  againstPoint, 
  potential, 
  suggestion 
}) => (
  <Card className="mb-4 border-2" style={{ borderColor: getConsensusColor(potential) }}>
    <CardContent className="p-5">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">Supporting View</span>
          </div>
          <p className="text-sm">{forPoint}</p>
        </div>
        <div className="flex-1 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="font-medium text-red-700 dark:text-red-300">Opposing View</span>
          </div>
          <p className="text-sm">{againstPoint}</p>
        </div>
      </div>
      
      <div className="border-t pt-3 mt-3">
        <div className="flex items-center gap-2 mb-2">
          <Handshake className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Potential Compromise</span>
          <Badge 
            variant="outline" 
            className="ml-auto"
            style={{ 
              backgroundColor: `${getConsensusColor(potential)}20`, 
              color: getConsensusColor(potential),
              borderColor: getConsensusColor(potential)
            }}
          >
            {potential}% Compatible
          </Badge>
        </div>
        <p className="text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">{suggestion}</p>
      </div>
    </CardContent>
  </Card>
);

const ConsensusVisualization: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProposal, setSelectedProposal] = useState(mockProposalsData[0]);
  
  const handleSelectProposal = (proposal: typeof mockProposalsData[0]) => {
    setSelectedProposal(proposal);
  };

  const aggregateData = mockProposalsData.map(proposal => ({
    name: proposal.title.length > 20 ? proposal.title.substring(0, 20) + '...' : proposal.title,
    id: proposal.id,
    score: proposal.agreementScore,
    argumentCount: proposal.totalArguments,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Active Proposals Consensus Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 md:h-80">
            <ChartContainer
              config={{
                high: { color: consensusColors.high },
                medium: { color: consensusColors.medium },
                low: { color: consensusColors.low },
                veryLow: { color: consensusColors.veryLow },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={aggregateData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Consensus Score (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                    domain={[0, 100]} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="score" 
                    name="Consensus Score"
                    onClick={(data) => {
                      const proposal = mockProposalsData.find(p => p.id === data.id);
                      if (proposal) handleSelectProposal(proposal);
                    }}
                  >
                    {aggregateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getConsensusColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex items-center justify-center mt-4 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: consensusColors.high }}></div>
              <span className="text-xs">High Consensus (80%+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: consensusColors.medium }}></div>
              <span className="text-xs">Medium Consensus (60-79%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: consensusColors.low }}></div>
              <span className="text-xs">Low Consensus (40-59%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: consensusColors.veryLow }}></div>
              <span className="text-xs">Very Low Consensus (&lt;40%)</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Click on any bar to see detailed analysis
          </div>
        </CardContent>
      </Card>

      {selectedProposal && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>
                      {selectedProposal.phase.charAt(0).toUpperCase() + selectedProposal.phase.slice(1)} Phase
                    </Badge>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        backgroundColor: `${getConsensusColor(selectedProposal.agreementScore)}20`, 
                        color: getConsensusColor(selectedProposal.agreementScore),
                        borderColor: getConsensusColor(selectedProposal.agreementScore)
                      }}
                    >
                      {selectedProposal.agreementScore}% Consensus
                    </Badge>
                  </div>
                  <CardTitle>{selectedProposal.title}</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => navigate(`/proposals/${selectedProposal.id}`)}
                >
                  <span>View Proposal</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visualization">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="visualization" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Consensus Points</span>
                    <span className="sm:hidden">Points</span>
                  </TabsTrigger>
                  <TabsTrigger value="compromises" className="flex items-center gap-1">
                    <Handshake className="h-4 w-4" />
                    <span className="hidden sm:inline">Potential Compromises</span>
                    <span className="sm:hidden">Compromises</span>
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex items-center gap-1">
                    <GitMerge className="h-4 w-4" />
                    <span className="hidden sm:inline">Consensus Trends</span>
                    <span className="sm:hidden">Trends</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="visualization">
                  {selectedProposal.keyPoints.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-blue-500" />
                          Key Discussion Points
                        </h3>
                        <div className="space-y-4">
                          {selectedProposal.keyPoints.map((point, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{point.point}</span>
                                <Badge 
                                  variant="outline" 
                                  style={{ 
                                    backgroundColor: `${getConsensusColor(point.agreementLevel)}20`, 
                                    color: getConsensusColor(point.agreementLevel),
                                    borderColor: getConsensusColor(point.agreementLevel)
                                  }}
                                >
                                  {point.agreementLevel}%
                                </Badge>
                              </div>
                              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${point.agreementLevel}%`, 
                                    backgroundColor: getConsensusColor(point.agreementLevel) 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-80">
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <Vote className="h-5 w-5 text-blue-500" />
                          Consensus Radar
                        </h3>
                        <ChartContainer
                          config={{
                            agreement: { color: consensusColors.high },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart 
                              outerRadius="80%" 
                              data={selectedProposal.keyPoints.map(point => ({
                                subject: point.point,
                                A: point.agreementLevel,
                                fullMark: 100
                              }))}
                            >
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                              <PolarRadiusAxis domain={[0, 100]} />
                              <Radar 
                                name="Consensus Level" 
                                dataKey="A" 
                                stroke={consensusColors.high} 
                                fill={consensusColors.high} 
                                fillOpacity={0.5} 
                              />
                              <ChartTooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Info className="h-12 w-12 text-blue-500 mb-3 opacity-70" />
                      <h3 className="text-lg font-medium">No Discussion Data Available</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        This proposal is in the presentation phase and hasn't entered discussion yet.
                        Check back after the community begins deliberation.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="compromises">
                  {selectedProposal.opposingViews.length > 0 ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Handshake className="h-5 w-5 text-blue-500" />
                          Potential Compromise Solutions
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Based on the community discussion, these potential compromise solutions 
                          might bridge differing perspectives.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {selectedProposal.opposingViews.map((view, index) => (
                          <CompromiseItem 
                            key={index}
                            forPoint={view.for}
                            againstPoint={view.against}
                            potential={view.compromisePotential}
                            suggestion={view.compromiseSuggestion}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mb-3 opacity-70" />
                      <h3 className="text-lg font-medium">No Opposing Views Identified</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        There are currently no significant opposing viewpoints to generate compromise solutions.
                        This may indicate high consensus or that the proposal is still in early phases.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trends">
                  {selectedProposal.phase !== "presentation" ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          Consensus Development Over Time
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This chart shows how consensus has evolved as the community discusses this proposal.
                        </p>
                        
                        <div className="h-72">
                          <ChartContainer
                            config={{
                              consensus: { color: consensusColors.high },
                              participation: { color: "#94A3B8" },
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={[
                                  { day: 'Day 1', consensus: 30, participation: 5 },
                                  { day: 'Day 2', consensus: 45, participation: 12 },
                                  { day: 'Day 3', consensus: 50, participation: 18 },
                                  { day: 'Day 4', consensus: 48, participation: 24 },
                                  { day: 'Day 5', consensus: 65, participation: 35 },
                                  { day: 'Day 6', consensus: selectedProposal.agreementScore, participation: 42 },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" domain={[0, 100]} />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 50]} />
                                <ChartTooltip />
                                <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="consensus"
                                  name="Consensus Score"
                                  stroke={consensusColors.high}
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="participation"
                                  name="Participant Count"
                                  stroke="#94A3B8"
                                  strokeDasharray="5 5"
                                />
                                <Legend />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-3 opacity-70" />
                      <h3 className="text-lg font-medium">High Initial Agreement</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        This proposal shows strong initial consensus. Trend data will become 
                        available once the discussion phase begins and community members start sharing perspectives.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConsensusVisualization;
