
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Shield, 
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

type ModerationItem = {
  id: string;
  item_id: string;
  item_type: string;
  title: string | null;
  content: string;
  reporter_id: string;
  reported_at: string;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  violation_categories: string[];
  severity_level: string | null;
  created_at: string;
  profiles?: {
    username: string | null;
  } | null;
};

type CommunityGuideline = {
  id: string;
  category: string;
  title: string;
  description: string;
  severity_level: string;
  examples: string[];
};

export const ModeratorQueue = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [actionTaken, setActionTaken] = useState<string>("none");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isModeratorUser, setIsModeratorUser] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user is a moderator
  useEffect(() => {
    const checkModeratorStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from('moderator_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
          console.error("Error checking moderator status:", error);
          return;
        }

        setIsModeratorUser(!!data);
      } catch (error) {
        console.error("Failed to check moderator status:", error);
      }
    };

    checkModeratorStatus();
  }, []);

  // Fetch moderation queue items
  const { data: queueItems, isLoading } = useQuery({
    queryKey: ['moderation-queue', selectedTab],
    queryFn: async () => {
      if (!isModeratorUser) return [];

      const { data, error } = await supabase
        .from('moderation_queue')
        .select('*, profiles!moderation_queue_reporter_id_fkey(username)')
        .eq('status', selectedTab)
        .order('reported_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to ensure it matches the ModerationItem type
      return (data as any[]).map(item => ({
        ...item,
        // Ensure profiles is properly typed
        profiles: item.profiles && !('error' in item.profiles) 
          ? item.profiles 
          : { username: null }
      })) as ModerationItem[];
    },
    enabled: isModeratorUser,
  });

  // Fetch community guidelines
  const { data: guidelines } = useQuery({
    queryKey: ['community-guidelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_guidelines')
        .select('*')
        .order('severity_level', { ascending: false });
      
      if (error) throw error;
      return data as CommunityGuideline[];
    },
  });

  // Process moderation decision mutation
  const moderationDecision = useMutation({
    mutationFn: async ({ 
      itemId, 
      decision, 
      notes, 
      action 
    }: { 
      itemId: string, 
      decision: 'approve' | 'reject', 
      notes: string,
      action: string
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("You must be logged in to moderate content");
      
      // Start a transaction
      const { error: updateError } = await supabase
        .from('moderation_queue')
        .update({ 
          status: decision, 
          reviewed_by: session.user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes
        })
        .eq('id', itemId);
      
      if (updateError) throw updateError;
      
      // Log the decision
      const { error: logError } = await supabase
        .from('moderation_decisions')
        .insert({ 
          queue_item_id: itemId,
          moderator_id: session.user.id,
          decision: decision,
          rationale: notes,
          action_taken: action
        });
      
      if (logError) throw logError;
      
      return { id: itemId, decision };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
      toast({
        title: "Moderation decision recorded",
        description: "The content has been moderated successfully.",
      });
      setModeratorNotes("");
      setActionTaken("none");
    },
    onError: (error: any) => {
      console.error("Error processing moderation decision:", error);
      toast({
        title: "Error processing decision",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const toggleItemExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getGuidelineByCategory = (category: string) => {
    return guidelines?.find(g => g.category === category);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (!isModeratorUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Moderation Queue</CardTitle>
          <CardDescription className="text-center">
            You do not have permission to access the moderation queue.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Moderation Queue
              </div>
            </CardTitle>
            <CardDescription>
              Review reported content and make moderation decisions based on community guidelines.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {queueItems?.filter(item => item.status === 'pending').length > 0 && (
                <Badge className="absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2 bg-primary">
                  {queueItems?.filter(item => item.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading moderation queue...</div>
            ) : queueItems?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No {selectedTab} items in the moderation queue.
              </div>
            ) : (
              queueItems?.map(item => (
                <Card key={item.id} className="border-border/40">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {item.title || `${item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1)} Content`}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-1 items-center">
                          {renderStatusBadge(item.status)}
                          <Badge variant="secondary">
                            {item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Reported {new Date(item.reported_at).toLocaleDateString()} by {item.profiles?.username || 'Anonymous'}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => toggleItemExpanded(item.id)}
                      >
                        {expandedItems[item.id] ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <Collapsible open={expandedItems[item.id]} onOpenChange={() => toggleItemExpanded(item.id)}>
                    <CollapsibleTrigger className="w-full text-left px-6 py-2 text-sm text-muted-foreground hover:bg-accent/50 focus:outline-none">
                      {expandedItems[item.id] ? "Hide details" : "Show details"}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Reported Content:</h4>
                            <div className="bg-accent/30 p-3 rounded-md text-sm">
                              {item.content}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Reported for:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.violation_categories.map((category, index) => {
                                const guideline = getGuidelineByCategory(category);
                                return (
                                  <Badge key={index} variant="outline" className="bg-accent/30">
                                    {guideline?.title || category}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          
                          {item.review_notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Reporter Notes:</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.review_notes}
                              </p>
                            </div>
                          )}
                          
                          {item.violation_categories.map(category => {
                            const guideline = getGuidelineByCategory(category);
                            if (!guideline) return null;
                            
                            return (
                              <div key={guideline.id} className="rounded-md border p-3">
                                <h4 className="text-sm font-medium flex items-center">
                                  {guideline.title}
                                  <Badge className="ml-2" variant={
                                    guideline.severity_level === 'critical' ? 'destructive' :
                                    guideline.severity_level === 'high' ? 'outline' :
                                    'secondary'
                                  }>
                                    {guideline.severity_level}
                                  </Badge>
                                </h4>
                                <p className="text-sm mt-1">{guideline.description}</p>
                                {guideline.examples.length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="text-xs font-medium">Examples:</h5>
                                    <ul className="text-xs mt-1 ml-4 list-disc">
                                      {guideline.examples.map((example, i) => (
                                        <li key={i} className="text-muted-foreground">{example}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          
                          {item.status === 'pending' && (
                            <div className="space-y-3 mt-4">
                              <Separator />
                              <div className="pt-2">
                                <Label htmlFor="moderator-notes">Moderator Notes</Label>
                                <Textarea 
                                  id="moderator-notes"
                                  placeholder="Enter your assessment of this content..."
                                  value={moderatorNotes}
                                  onChange={(e) => setModeratorNotes(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="action-taken">Action Taken</Label>
                                <Select value={actionTaken} onValueChange={setActionTaken}>
                                  <SelectTrigger id="action-taken" className="mt-1">
                                    <SelectValue placeholder="Select action taken" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">No action needed</SelectItem>
                                    <SelectItem value="edit">Edit content</SelectItem>
                                    <SelectItem value="remove">Remove content</SelectItem>
                                    <SelectItem value="warn">Warn user</SelectItem>
                                    <SelectItem value="suspend">Suspend user</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          
                          {item.status !== 'pending' && item.review_notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Moderator Notes:</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.review_notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      {item.status === 'pending' && (
                        <CardFooter className="flex justify-end space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            onClick={() => moderationDecision.mutate({
                              itemId: item.id,
                              decision: 'approve',
                              notes: moderatorNotes,
                              action: actionTaken
                            })}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => moderationDecision.mutate({
                              itemId: item.id,
                              decision: 'reject',
                              notes: moderatorNotes,
                              action: actionTaken
                            })}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </CardFooter>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
