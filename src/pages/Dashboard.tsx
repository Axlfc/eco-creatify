import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingTiers } from "@/components/PricingTiers";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { CommunityFeed } from "@/components/CommunityFeed";
import { CampaignList } from "@/components/CampaignList";
import { ProfileCard } from "@/components/ProfileCard";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  const hash = window.location.hash;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle authentication errors
  if (!isAuthenticated || error) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8">
        {hash === "#products" ? (
          <PricingTiers />
        ) : (
          <div className="space-y-6 px-4">
            <Card className="border-0 bg-secondary/5">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl">
                  Welcome{user?.username ? `, ${user.username}` : ''} 
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage your campaigns and customize your products.
                </p>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-8 space-y-6">
                <CampaignList />
                <Card className="border-0 bg-secondary/5">
                  <CardHeader>
                    <CardTitle>Community Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CommunityFeed />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Right Side */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-4">
                  <ProfileCard />
                  <div className="mt-6">
                    <SubscriptionManager />
                  </div>
                  <div className="mt-6">
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
