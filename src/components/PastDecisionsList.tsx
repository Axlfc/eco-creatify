
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, BarChart4 } from "lucide-react";
import DecisionFeedbackSystem from "./DecisionFeedbackSystem";

interface Decision {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  status: "implemented" | "in-progress" | "planned";
  feedbackCount: number;
}

const sampleDecisions: Decision[] = [
  {
    id: "dec-1",
    title: "Community Garden Allocation",
    date: "2023-10-15",
    summary: "Decision to allocate 30% of the community garden space to educational programs for local schools, with the remaining 70% distributed to community members through a lottery system.",
    category: "Resource Allocation",
    status: "implemented",
    feedbackCount: 42
  },
  {
    id: "dec-2",
    title: "Traffic Calming Measures",
    date: "2023-11-03",
    summary: "Implementation of speed bumps and crosswalks on Oak Street in response to concerns about pedestrian safety, with a phased approach starting with the school zone.",
    category: "Infrastructure",
    status: "in-progress",
    feedbackCount: 38
  },
  {
    id: "dec-3",
    title: "Community Center Programming",
    date: "2023-09-22",
    summary: "Decision to expand evening and weekend programs at the community center, focusing on youth activities and senior wellness, funded through a reallocation of the recreation budget.",
    category: "Public Services",
    status: "implemented",
    feedbackCount: 27
  },
  {
    id: "dec-4",
    title: "Waste Management Schedule",
    date: "2023-12-01",
    summary: "Revised waste collection schedule with increased recycling pickups and new composting program, based on resident survey results and environmental impact assessment.",
    category: "Environmental",
    status: "planned",
    feedbackCount: 15
  }
];

const getStatusColor = (status: Decision["status"]) => {
  switch (status) {
    case "implemented":
      return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
    case "in-progress":
      return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20";
    case "planned":
      return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20";
  }
};

const getStatusIcon = (status: Decision["status"]) => {
  switch (status) {
    case "implemented":
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case "in-progress":
      return <Clock className="h-4 w-4 mr-1" />;
    case "planned":
      return <FileText className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

const PastDecisionsList: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const handleViewFeedback = (decision: Decision) => {
    setSelectedDecision(decision);
  };

  const handleCloseModal = () => {
    setSelectedDecision(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Past Decisions</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <BarChart4 className="h-4 w-4" />
          <span>All Metrics</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleDecisions.map((decision) => (
          <Card key={decision.id} className="border-border/30 hover:border-border/70 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{decision.title}</CardTitle>
                  <CardDescription>{formatDate(decision.date)}</CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={`flex items-center whitespace-nowrap ${getStatusColor(decision.status)}`}
                >
                  {getStatusIcon(decision.status)}
                  {decision.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{decision.summary}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{decision.category}</Badge>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-primary/5">
                    {decision.feedbackCount} feedback submissions
                  </Badge>
                  <Button 
                    size="sm"
                    onClick={() => handleViewFeedback(decision)}
                  >
                    View Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedDecision && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <DecisionFeedbackSystem
              decisionId={selectedDecision.id}
              decisionTitle={selectedDecision.title}
              decisionDate={selectedDecision.date}
              decisionSummary={selectedDecision.summary}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PastDecisionsList;
