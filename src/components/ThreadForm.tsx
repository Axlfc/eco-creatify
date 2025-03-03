
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InfoIcon } from "lucide-react";

interface SourceCitation {
  title: string;
  url: string;
}

interface ThreadFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  categories: Array<{
    id: string;
    name: string;
    icon?: React.ElementType;
    description?: string;
  }>;
}

const ThreadForm = ({ onCancel, onSubmit, categories }: ThreadFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [enableCoolingPeriod, setEnableCoolingPeriod] = useState(true);
  const [sourceCitations, setSourceCitations] = useState<SourceCitation[]>([{ title: "", url: "" }]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const CONTENT_MIN_LENGTH = 500;
  const characterCount = content.length;
  const isContentValid = characterCount >= CONTENT_MIN_LENGTH;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSourceChange = (index: number, field: keyof SourceCitation, value: string) => {
    const updatedSources = [...sourceCitations];
    updatedSources[index][field] = value;
    setSourceCitations(updatedSources);
  };

  const addSourceCitation = () => {
    setSourceCitations([...sourceCitations, { title: "", url: "" }]);
  };

  const removeSourceCitation = (index: number) => {
    if (sourceCitations.length > 1) {
      const updatedSources = [...sourceCitations];
      updatedSources.splice(index, 1);
      setSourceCitations(updatedSources);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your thread",
        variant: "destructive",
      });
      return;
    }

    if (!isContentValid) {
      toast({
        title: "Content too short",
        description: `Your post must be at least ${CONTENT_MIN_LENGTH} characters long`,
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Missing information",
        description: "Please select a category for your thread",
        variant: "destructive",
      });
      return;
    }

    const hasSources = sourceCitations.some(source => source.title.trim() || source.url.trim());
    if (!hasSources) {
      toast({
        title: "Missing sources",
        description: "Please provide at least one source citation",
        variant: "destructive",
      });
      return;
    }

    // Here we would normally submit the data to the server
    // For now, we'll just show a success message
    toast({
      title: "Thread submitted",
      description: "Your thread has been submitted for review and will be published soon.",
    });
    
    onSubmit();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Thread</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="thread-title">Title</Label>
          <Input
            id="thread-title"
            placeholder="Thread title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="thread-content">Content ({characterCount}/{CONTENT_MIN_LENGTH} characters)</Label>
            <span className={`text-xs ${isContentValid ? 'text-green-600' : 'text-red-500'}`}>
              {isContentValid ? 'Minimum length met' : `Needs ${CONTENT_MIN_LENGTH - characterCount} more characters`}
            </span>
          </div>
          <Textarea
            id="thread-content"
            placeholder="Write your post here... (minimum 500 characters)"
            value={content}
            onChange={handleContentChange}
            rows={8}
            className={`${!isContentValid && content.length > 0 ? 'border-red-300' : ''}`}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thread-category">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger id="thread-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c.id !== "all").map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="cooling-period" className="flex items-center space-x-2 cursor-pointer">
              <span>24-hour cooling period</span>
              <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                Recommended
              </div>
            </Label>
            <Switch
              id="cooling-period"
              checked={enableCoolingPeriod}
              onCheckedChange={setEnableCoolingPeriod}
            />
          </div>
          <p className="text-xs text-muted-foreground pl-1">
            {enableCoolingPeriod ? 
              "Your post will be saved as a draft for 24 hours, giving you time to reflect before publishing." :
              "Your post will be submitted for immediate review and publication."
            }
          </p>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label>Source Citations</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addSourceCitation}
              type="button"
            >
              Add Source
            </Button>
          </div>
          
          {sourceCitations.map((source, index) => (
            <div key={index} className="space-y-2 p-3 border rounded-md bg-background/50">
              <div className="space-y-2">
                <Label htmlFor={`source-title-${index}`}>Source Title</Label>
                <Input
                  id={`source-title-${index}`}
                  placeholder="e.g., New York Times Article"
                  value={source.title}
                  onChange={(e) => handleSourceChange(index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`source-url-${index}`}>Source URL</Label>
                <Input
                  id={`source-url-${index}`}
                  placeholder="https://..."
                  value={source.url}
                  onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                />
              </div>
              {sourceCitations.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeSourceCitation(index)}
                  className="text-muted-foreground hover:text-destructive"
                  type="button"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="outline" onClick={handleSubmit} type="button">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadForm;
