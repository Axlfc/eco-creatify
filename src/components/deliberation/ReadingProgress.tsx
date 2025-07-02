import React from "react";
import { Progress } from "@/components/ui/progress";

interface ReadingProgressProps {
  readPerspectives: Set<string>;
  totalPerspectives: number;
  readingProgress: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  readPerspectives,
  totalPerspectives,
  readingProgress
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span>Reading progress</span>
        <span className="text-muted-foreground">
          {readPerspectives.size} of {totalPerspectives} perspectives read
        </span>
      </div>
      <Progress 
        value={readingProgress} 
        className="h-2" 
        color={readingProgress === 100 ? "bg-green-500" : undefined} 
      />
    </div>
  );
};

export default ReadingProgress;