
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BrainCircuit, LightbulbIcon, Scale, Pencil, CheckCircle } from "lucide-react";

export interface StageRequirement {
  type: "participation" | "time" | "diversity";
  value: number;
  description: string;
  current?: number;
}

export interface DeliberationStage {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  duration: number; // in days
  requirements: StageRequirement[];
  isActive: boolean;
  isCompleted: boolean;
  startDate?: Date;
  endDate?: Date;
  progress: number; // 0-100
}

interface DeliberationStagesProps {
  proposalId: string;
  stages: DeliberationStage[];
  currentStageId: string;
}

const DeliberationStages: React.FC<DeliberationStagesProps> = ({ 
  proposalId, 
  stages, 
  currentStageId 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div 
              className={`flex-shrink-0 rounded-full w-12 h-12 flex items-center justify-center border-2 ${
                stage.isActive 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : stage.isCompleted 
                    ? "border-green-500 bg-green-100 text-green-700" 
                    : "border-muted bg-muted/30 text-muted-foreground"
              }`}
            >
              <stage.icon className="h-5 w-5" />
            </div>
            
            {index < stages.length - 1 && (
              <div className={`w-10 h-0.5 flex-shrink-0 ${
                stage.isCompleted ? "bg-green-500" : "bg-muted"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage) => (
          <Card 
            key={stage.id} 
            className={`border-l-4 ${
              stage.isActive 
                ? "border-l-primary" 
                : stage.isCompleted 
                  ? "border-l-green-500" 
                  : "border-l-muted"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <stage.icon className="h-5 w-5" />
                  {stage.name}
                </CardTitle>
                <Badge 
                  variant={
                    stage.isActive 
                      ? "default" 
                      : stage.isCompleted 
                        ? "secondary" 
                        : "outline"
                  }
                >
                  {stage.isActive ? "Current" : stage.isCompleted ? "Completed" : "Upcoming"}
                </Badge>
              </div>
              <CardDescription>{stage.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Timeline:
                    </span>
                    <span className="text-muted-foreground">{stage.duration} days</span>
                  </div>
                  
                  {stage.startDate && stage.endDate && (
                    <div className="text-xs text-muted-foreground">
                      {new Date(stage.startDate).toLocaleDateString()} - {new Date(stage.endDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  {stage.isActive && (
                    <>
                      <Progress 
                        value={stage.progress} 
                        className="h-2" 
                      />
                      <div className="text-xs text-right text-muted-foreground">
                        {stage.progress}% complete
                      </div>
                    </>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Requirements:</div>
                  <ul className="space-y-1 text-sm">
                    {stage.requirements.map((req, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="text-muted-foreground">{req.description}</span>
                        {req.current !== undefined && (
                          <span className={req.current >= req.value ? "text-green-600" : "text-amber-600"}>
                            {req.current}/{req.value}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeliberationStages;
