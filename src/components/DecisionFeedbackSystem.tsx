import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { 
  CheckCircle, 
  AlertCircle, 
  BarChart, 
  BookOpen, 
  Clock, 
  Users
} from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

type FeedbackMetric = {
  id: string;
  name: string;
  description: string;
};

type FeedbackCategory = "Process" | "Outcome" | "Representation" | "Implementation";

interface DecisionFeedbackProps {
  decisionId: string;
  decisionTitle: string;
  decisionDate: string;
  decisionSummary: string;
  onClose: () => void;
}

const feedbackMetrics: Record<FeedbackCategory, FeedbackMetric[]> = {
  Process: [
    { id: "process_fairness", name: "Fairness", description: "Was the deliberation process fair to all perspectives?" },
    { id: "process_transparency", name: "Transparency", description: "Was the process transparent and clear to all participants?" },
    { id: "process_participation", name: "Participation", description: "Did the process allow for broad participation?" }
  ],
  Outcome: [
    { id: "outcome_effectiveness", name: "Effectiveness", description: "Has the decision been effective in addressing the issue?" },
    { id: "outcome_satisfaction", name: "Satisfaction", description: "Are you satisfied with the outcome?" },
    { id: "outcome_sustainability", name: "Sustainability", description: "Is the outcome sustainable in the long term?" }
  ],
  Representation: [
    { id: "representation_diversity", name: "Diversity", description: "Were diverse perspectives represented in the decision-making?" },
    { id: "representation_inclusivity", name: "Inclusivity", description: "Were all stakeholder groups included in the process?" },
    { id: "representation_balance", name: "Balance", description: "Was there a balance of power among different groups?" }
  ],
  Implementation: [
    { id: "implementation_timeliness", name: "Timeliness", description: "Was the decision implemented in a timely manner?" },
    { id: "implementation_fidelity", name: "Fidelity", description: "Was the decision implemented as intended?" },
    { id: "implementation_adaptability", name: "Adaptability", description: "Has the implementation been adaptable to changing circumstances?" }
  ]
};

const demographicGroups = [
  "Age: 18-30",
  "Age: 31-45",
  "Age: 46-60",
  "Age: 60+",
  "Urban residents",
  "Rural residents",
  "Directly affected",
  "Indirectly affected",
  "Technical experts",
  "General public"
];

const DecisionFeedbackSystem: React.FC<DecisionFeedbackProps> = ({
  decisionId,
  decisionTitle,
  decisionDate,
  decisionSummary,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"provide" | "view">("provide");
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>("Process");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [suggestedAdjustments, setSuggestedAdjustments] = useState("");
  const [demographicGroup, setDemographicGroup] = useState("");
  const [customGroup, setCustomGroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState<any[]>([]);
  const [participationStats, setParticipationStats] = useState<any[]>([]);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Fetch existing stats on component mount
  useEffect(() => {
    fetchFeedbackStats();
    checkSubmittedFeedback();
  }, [decisionId]);

  const checkSubmittedFeedback = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      // Since we don't have a decision_feedback table yet, we're using a mock check
      // In a real implementation, this would query the database
      console.log("Would check if user", user.id, "has submitted feedback for decision", decisionId);
      
      // Mock implementation - in a real app, this would be a database query
      // For now, we'll just set submittedFeedback to false to allow testing
      setSubmittedFeedback(false);
    } catch (error) {
      console.error("Error checking feedback submission:", error);
    }
  };

  const fetchFeedbackStats = async () => {
    try {
      // This would be implemented with real data in a production environment
      // For now, using sample data for demonstration
      
      // Sample data for metrics
      const metricsData = [
        { name: "Fairness", value: 3.7, category: "Process" },
        { name: "Transparency", value: 4.1, category: "Process" },
        { name: "Participation", value: 3.5, category: "Process" },
        { name: "Effectiveness", value: 3.9, category: "Outcome" },
        { name: "Satisfaction", value: 3.2, category: "Outcome" },
        { name: "Sustainability", value: 3.8, category: "Outcome" },
        { name: "Diversity", value: 2.9, category: "Representation" },
        { name: "Inclusivity", value: 3.3, category: "Representation" },
        { name: "Balance", value: 2.7, category: "Representation" },
        { name: "Timeliness", value: 3.6, category: "Implementation" },
        { name: "Fidelity", value: 4.0, category: "Implementation" },
        { name: "Adaptability", value: 3.4, category: "Implementation" }
      ];
      
      // Sample data for demographic participation
      const participationData = [
        { name: "Age: 18-30", count: 12 },
        { name: "Age: 31-45", count: 24 },
        { name: "Age: 46-60", count: 18 },
        { name: "Age: 60+", count: 7 },
        { name: "Urban residents", count: 32 },
        { name: "Rural residents", count: 14 },
        { name: "Directly affected", count: 28 },
        { name: "Indirectly affected", count: 19 },
        { name: "Technical experts", count: 8 },
        { name: "General public", count: 35 }
      ];
      
      setFeedbackStats(metricsData);
      setParticipationStats(participationData);
    } catch (error) {
      console.error("Error fetching feedback stats:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback statistics.",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = (metricId: string, value: number) => {
    setRatings({
      ...ratings,
      [metricId]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit feedback",
        variant: "destructive",
      });
      return;
    }
    
    // Validate inputs
    const selectedMetrics = feedbackMetrics[selectedCategory];
    const allMetricsRated = selectedMetrics.every(metric => ratings[metric.id] !== undefined);
    
    if (!allMetricsRated) {
      toast({
        title: "Incomplete ratings",
        description: "Please rate all metrics in the selected category",
        variant: "destructive",
      });
      return;
    }
    
    if (!demographicGroup && !customGroup) {
      toast({
        title: "Group identification missing",
        description: "Please select or enter a demographic group you represent",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would save to the database
      console.log("Submitting feedback:", {
        decisionId,
        ratings,
        lessonsLearned,
        suggestedAdjustments,
        demographicGroup: demographicGroup || customGroup,
        userId: user?.id
      });
      
      // Mock successful submission
      setTimeout(() => {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your valuable input!",
        });
        setSubmittedFeedback(true);
        setIsSubmitting(false);
        setActiveTab("view");
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const renderFeedbackForm = () => {
    if (submittedFeedback) {
      return (
        <div className="p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            You've already submitted feedback for this decision.
          </p>
          <Button onClick={() => setActiveTab("view")}>
            View Feedback Statistics
          </Button>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(feedbackMetrics) as FeedbackCategory[]).map((category) => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="flex-grow sm:flex-grow-0"
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="space-y-4 mt-4">
            <h3 className="font-medium">{selectedCategory} Metrics</h3>
            {feedbackMetrics[selectedCategory].map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={metric.id} className="font-medium">
                    {metric.name}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {ratings[metric.id] ? `${ratings[metric.id]}/5` : "Not rated"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        ratings[metric.id] === value ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => handleRatingChange(metric.id, value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="demographic-group">Your Demographic Group</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Help us track representation by identifying which group you represent
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demographicGroups.map((group) => (
                <Button
                  key={group}
                  type="button"
                  variant={demographicGroup === group ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setDemographicGroup(group);
                    setCustomGroup("");
                  }}
                  className="justify-start h-auto py-2"
                >
                  {group}
                </Button>
              ))}
            </div>
            <div className="mt-2">
              <Label htmlFor="custom-group" className="text-sm">Other group (specify)</Label>
              <Input
                id="custom-group"
                value={customGroup}
                onChange={(e) => {
                  setCustomGroup(e.target.value);
                  setDemographicGroup("");
                }}
                placeholder="Enter your demographic group"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="lessons-learned">Lessons Learned</Label>
            <Textarea
              id="lessons-learned"
              placeholder="What lessons can be learned from this decision and its implementation?"
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suggested-adjustments">Suggested Adjustments</Label>
            <Textarea
              id="suggested-adjustments"
              placeholder="What adjustments would you suggest based on the outcomes of this decision?"
              value={suggestedAdjustments}
              onChange={(e) => setSuggestedAdjustments(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    );
  };

  const renderFeedbackStats = () => {
    const filteredStats = feedbackStats.filter(stat => stat.category === selectedCategory);
    
    const chartConfig = {
      positive: {
        label: "Positive",
        theme: {
          light: "#4ade80",
          dark: "#4ade80",
        },
      },
      neutral: {
        label: "Neutral",
        theme: {
          light: "#facc15",
          dark: "#facc15",
        },
      },
      negative: {
        label: "Negative",
        theme: {
          light: "#f87171",
          dark: "#f87171",
        },
      },
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(feedbackMetrics) as FeedbackCategory[]).map((category) => (
            <Button
              key={category}
              type="button"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="flex-grow sm:flex-grow-0"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <ChartContainer className="aspect-video h-72" config={chartConfig}>
          <RechartsBarChart
            data={filteredStats}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="value" name="Rating" fill="#3b82f6">
              {filteredStats.map((entry, index) => {
                let color = "#4ade80"; // green for high ratings
                if (entry.value < 3) {
                  color = "#f87171"; // red for low ratings
                } else if (entry.value < 4) {
                  color = "#facc15"; // yellow for medium ratings
                }
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </RechartsBarChart>
        </ChartContainer>
        
        <div className="mt-8">
          <h3 className="font-medium text-lg mb-4">Representation & Participation</h3>
          <ChartContainer className="aspect-video h-72" config={chartConfig}>
            <RechartsBarChart
              data={participationStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              layout="vertical"
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" name="Participants" fill="#3b82f6" />
            </RechartsBarChart>
          </ChartContainer>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="font-medium text-lg">Lessons Learned & Implementation Notes</h3>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Key Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Broader stakeholder engagement needed in early stages</span>
                </li>
                <li className="flex gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Technical complexity underestimated, requiring additional resources</span>
                </li>
                <li className="flex gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Communication strategy should be more inclusive of diverse audiences</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Implementation Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <Clock className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>Timeline extended by 2 months to accommodate additional consultation</span>
                </li>
                <li className="flex gap-2">
                  <Users className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>Created dedicated outreach for underrepresented communities</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>Budget increased by 15% to address unforeseen technical challenges</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          {!submittedFeedback && (
            <Button type="button" onClick={() => setActiveTab("provide")}>
              Provide Feedback
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{decisionTitle}</CardTitle>
            <CardDescription>
              Decision made on {new Date(decisionDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "provide" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("provide")}
              disabled={activeTab === "provide"}
            >
              Provide Feedback
            </Button>
            <Button 
              variant={activeTab === "view" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("view")}
              disabled={activeTab === "view"}
            >
              View Results
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Decision Summary</h3>
          <p className="text-sm">{decisionSummary}</p>
        </div>
        
        {activeTab === "provide" ? renderFeedbackForm() : renderFeedbackStats()}
      </CardContent>
    </Card>
  );
};

export default DecisionFeedbackSystem;
