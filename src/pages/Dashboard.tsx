import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PricingTiers } from "@/components/PricingTiers";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { CommunityFeed } from "@/components/CommunityFeed";
import { CampaignList } from "@/components/CampaignList";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  const hash = window.location.hash;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {hash === "#products" ? (
          <PricingTiers />
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Your Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage your campaigns and customize your products.
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-8 space-y-8">
                <CampaignList />
                <Card>
                  <CardHeader>
                    <CardTitle>Community Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CommunityFeed />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Right Side */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-4">
                  <SubscriptionManager />
                  <div className="mt-8">
                    <ProductCustomizer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;