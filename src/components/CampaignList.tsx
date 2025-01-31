import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  edit_window_expires_at: string;
  products: CampaignProduct[];
}

interface CampaignProduct {
  id: string;
  title: string;
  price: number;
  material: string;
  color: string;
  size: number;
}

export const CampaignList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('campaign-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        (payload) => {
          console.log('Campaign change detected:', payload);
          // Invalidate and refetch campaigns when any change occurs
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      console.log('Fetching campaigns...');
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          products:campaign_products(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        toast({
          variant: "destructive",
          title: "Error fetching campaigns",
          description: "Please try again later",
        });
        return [];
      }

      console.log('Campaigns fetched:', data);
      return data as Campaign[];
    },
  });

  const handleCreateCampaign = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create a campaign",
      });
      return;
    }

    const newCampaign = {
      title: "New Campaign",
      description: "Campaign description",
      user_id: session.session.user.id,
      edit_window_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
    };

    console.log('Creating new campaign:', newCampaign);
    const { error } = await supabase.from("campaigns").insert(newCampaign);

    if (error) {
      console.error("Error creating campaign:", error);
      toast({
        variant: "destructive",
        title: "Error creating campaign",
        description: "Please try again later",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    console.log('Deleting campaign:', campaignId);
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId);

    if (error) {
      console.error("Error deleting campaign:", error);
      toast({
        variant: "destructive",
        title: "Error deleting campaign",
        description: "Please try again later",
      });
    }
  };

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCreateCampaign}
                className="bg-primary hover:bg-primary/90 w-10 h-10 p-0"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="left"
              className="animate-slide-up-fade"
            >
              <p>Create New Campaign</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="bg-secondary/5 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{campaign.title}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Products: {campaign.products?.length || 0}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="w-full"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
