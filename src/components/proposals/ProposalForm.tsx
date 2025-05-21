
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Check, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Environment",
  "Education",
  "Technology",
  "Governance",
  "Community",
  "Infrastructure",
  "Culture",
  "Health",
  "Safety"
];

const ProposalForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  // Character count update
  useEffect(() => {
    setCharacterCount(description.length);
  }, [description]);

  const validateForm = () => {
    const errors: {
      title?: string;
      description?: string;
      category?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    } else if (title.length < 10) {
      errors.title = "Title must be at least 10 characters";
      isValid = false;
    }

    if (!description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (description.length < 500) {
      errors.description = "Description must be at least 500 characters";
      isValid = false;
    } else if (description.length > 1000) {
      errors.description = "Description must be no more than 1000 characters";
      isValid = false;
    }

    if (!category) {
      errors.category = "Category is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here we would submit to Supabase
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Proposal submitted",
        description: "Your proposal has entered the presentation phase",
      });
      
      navigate("/proposals");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Error",
        description: "Failed to submit your proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterCountColor = () => {
    if (characterCount < 500) return "text-red-500";
    if (characterCount > 900) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Create a New Proposal</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, specific title for your proposal"
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="description">Proposal Description (500-1000 characters)</Label>
                <span className={`text-sm ${getCharacterCountColor()}`}>
                  {characterCount}/1000
                </span>
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your proposal in detail, including its purpose, benefits, and implementation considerations"
                className={`min-h-32 ${formErrors.description ? "border-red-500" : ""}`}
              />
              {formErrors.description ? (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.description}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  <Info className="h-4 w-4 mr-1" />
                  Be concise but provide enough detail for others to understand and evaluate your proposal
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={formErrors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.category}
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/40 p-4 rounded-md border border-border/50">
            <h4 className="font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Proposal Process
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>After submission, your proposal enters a 24-hour presentation phase</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>This is followed by a 72-hour structured discussion phase</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Finally, a 48-hour weighted voting phase determines the outcome</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate("/proposals")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProposalForm;
