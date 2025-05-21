
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { StageRequirement } from "./DeliberationStages";

interface StageRequirementsProps {
  requirements: StageRequirement[];
}

export const StageRequirements: React.FC<StageRequirementsProps> = ({
  requirements
}) => {
  const remainingReqs = requirements.filter(req => {
    if (req.current === undefined) return true;
    return req.current < req.value;
  });
  
  if (remainingReqs.length === 0) return null;
  
  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription>
        This stage requires: {remainingReqs.map(r => r.description).join(", ")}
      </AlertDescription>
    </Alert>
  );
};
