import { useQuery } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";

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

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
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
        <Button onClick={handleCreateCampaign}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Products: {campaign.products?.length || 0}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCampaign(campaign.id)}
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