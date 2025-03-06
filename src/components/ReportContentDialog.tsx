
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type ReportContentDialogProps = {
  itemId: string;
  itemType: string;
  title: string;
  content: string;
  trigger?: React.ReactNode;
  onReportComplete?: () => void;
};

export const ReportContentDialog = ({ 
  itemId, 
  itemType, 
  title, 
  content, 
  trigger, 
  onReportComplete 
}: ReportContentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch community guidelines for reporting categories
  const { data: guidelines } = useQuery({
    queryKey: ['community-guidelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_guidelines')
        .select('*')
        .order('severity_level', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmitReport = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one reason for your report.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get user ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("You must be logged in to report content");
      }

      // Submit report to moderation queue
      const { error } = await supabase
        .from('moderation_queue')
        .insert({
          item_id: itemId,
          item_type: itemType,
          title: title,
          content: content,
          reporter_id: session.user.id,
          violation_categories: selectedCategories,
          review_notes: additionalInfo,
        });

      if (error) throw error;

      toast({
        title: "Report submitted",
        description: "Thank you for helping to maintain our community standards.",
      });

      setOpen(false);
      setAdditionalInfo("");
      setSelectedCategories([]);
      
      if (onReportComplete) {
        onReportComplete();
      }
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error submitting report",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Help us maintain a respectful community by reporting content that violates our guidelines.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label className="font-medium">Reason for reporting</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select all that apply:
            </p>
            
            <div className="space-y-2">
              {guidelines?.map(guideline => (
                <div key={guideline.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={guideline.category} 
                    checked={selectedCategories.includes(guideline.category)}
                    onCheckedChange={() => toggleCategory(guideline.category)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor={guideline.category}
                      className="font-medium cursor-pointer"
                    >
                      {guideline.title}
                      {guideline.severity_level === 'critical' && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                          Critical
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional information (optional)</Label>
            <Textarea 
              id="additional-info"
              placeholder="Please provide any additional context that will help moderators understand your report..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReport}
            disabled={isSubmitting || selectedCategories.length === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
