
import React from "react";
import { 
  BarChart4, 
  CheckCircle2, 
  File, 
  FileText, 
  HelpCircle, 
  Link, 
  XCircle 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type FactCheckStatus = "verified" | "disputed" | "refuted" | "inconclusive";
export type SourceType = "academic" | "government" | "news" | "organization" | "primary";

export interface Source {
  id: string;
  title: string;
  url: string;
  type: SourceType;
  author?: string;
  date?: string;
  publishedBy?: string;
}

export interface FactCheck {
  id: string;
  claim: string;
  status: FactCheckStatus;
  explanation: string;
  sources: Source[];
  consensusLevel: number; // 0-100
  dateChecked: string;
  category: string;
}

interface FactCheckCardProps {
  factCheck: FactCheck;
  onSourceClick?: (source: Source) => void;
}

const getStatusColor = (status: FactCheckStatus): string => {
  switch (status) {
    case "verified": return "bg-green-500";
    case "disputed": return "bg-amber-500";
    case "refuted": return "bg-red-500";
    case "inconclusive": return "bg-gray-500";
  }
};

const getStatusText = (status: FactCheckStatus): string => {
  switch (status) {
    case "verified": return "Verified";
    case "disputed": return "Disputed";
    case "refuted": return "Refuted";
    case "inconclusive": return "Inconclusive";
  }
};

const getStatusIcon = (status: FactCheckStatus) => {
  switch (status) {
    case "verified": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "disputed": return <HelpCircle className="h-5 w-5 text-amber-500" />;
    case "refuted": return <XCircle className="h-5 w-5 text-red-500" />;
    case "inconclusive": return <HelpCircle className="h-5 w-5 text-gray-500" />;
  }
};

const getSourceIcon = (type: SourceType) => {
  switch (type) {
    case "academic": return <FileText className="h-4 w-4" />;
    case "government": return <File className="h-4 w-4" />;
    case "news": return <FileText className="h-4 w-4" />;
    case "organization": return <File className="h-4 w-4" />;
    case "primary": return <FileText className="h-4 w-4 text-primary" />;
  }
};

const getSourceTypeLabel = (type: SourceType): string => {
  switch (type) {
    case "academic": return "Academic";
    case "government": return "Government";
    case "news": return "News";
    case "organization": return "Organization";
    case "primary": return "Primary Source";
  }
};

const FactCheckCard: React.FC<FactCheckCardProps> = ({ 
  factCheck, 
  onSourceClick 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full border border-border/30 hover:border-border/70 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <Badge 
              variant="outline" 
              className="self-start mb-2 flex items-center gap-1 px-2 py-1"
            >
              {getStatusIcon(factCheck.status)}
              <span>{getStatusText(factCheck.status)}</span>
            </Badge>
            <CardTitle className="text-lg">{factCheck.claim}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Fact checked on {formatDate(factCheck.dateChecked)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm mb-4">{factCheck.explanation}</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Expert Consensus Level</span>
              </div>
              <span className="text-sm font-medium">{factCheck.consensusLevel}%</span>
            </div>
            <Progress 
              value={factCheck.consensusLevel} 
              className="h-2"
              color={getStatusColor(factCheck.status)}
            />
          </div>
          
          {factCheck.sources.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Sources:</p>
              <div className="space-y-2">
                {factCheck.sources.map((source) => (
                  <div 
                    key={source.id} 
                    className="flex items-start gap-2 text-sm border border-muted p-2 rounded-md"
                  >
                    <div className="mt-0.5">
                      {getSourceIcon(source.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <span className="font-medium">{source.title}</span>
                        {source.author && <span className="text-xs text-muted-foreground">By {source.author}</span>}
                        {source.publishedBy && <span className="text-xs text-muted-foreground">{source.publishedBy}</span>}
                        <div className="flex items-center mt-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  {getSourceTypeLabel(source.type)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getSourceTypeLabel(source.type)} material</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="mt-0"
                      onClick={() => onSourceClick?.(source)}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-8">
          Discuss this fact check
        </Button>
        {factCheck.category && (
          <Badge variant="outline" className="text-xs">
            {factCheck.category}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default FactCheckCard;
