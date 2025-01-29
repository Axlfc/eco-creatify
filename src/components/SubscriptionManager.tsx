import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SubscriptionManager = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState("Free");
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch(
          "https://uybowfotcmvzvperopht.supabase.co/functions/v1/check-subscription",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch subscription status");

        const data = await response.json();
        setSubscriptionStatus(data.subscribed ? "Active" : "Free");
      } catch (error) {
        console.error("Error checking subscription:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check subscription status",
        });
      }
    };

    checkSubscription();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-muted-foreground">
                {subscriptionStatus === "Free" 
                  ? "Free - Community Access Only"
                  : "Premium - Full Access"}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.hash = "#products"}>
              {subscriptionStatus === "Free" ? "Upgrade Plan" : "Manage Plan"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};