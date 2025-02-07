
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
        // Get fresh session with access token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          console.log("No valid session found:", sessionError?.message);
          setSubscriptionStatus("Free");
          return;
        }

        // Try to refresh the session first to ensure we have a fresh token
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Session refresh failed:", refreshError);
          setSubscriptionStatus("Free");
          return;
        }

        // Get the refreshed session
        const { data: { session: refreshedSession } } = await supabase.auth.getSession();
        if (!refreshedSession?.access_token) {
          console.error("No valid session after refresh");
          setSubscriptionStatus("Free");
          return;
        }

        console.log("Using refreshed session token for customer check");

        // Create/retrieve Stripe customer with fresh auth header
        const { data: customerData, error: customerError } = await supabase.functions.invoke(
          "create-stripe-customer",
          {
            headers: {
              Authorization: `Bearer ${refreshedSession.access_token}`,
            },
          }
        );

        if (customerError) {
          console.error("Customer creation/retrieval failed:", customerError);
          setSubscriptionStatus("Free");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to retrieve customer data",
          });
          return;
        }

        console.log("Customer response:", customerData);

        // Check subscription status with fresh auth header
        const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke(
          "check-subscription",
          {
            headers: {
              Authorization: `Bearer ${refreshedSession.access_token}`,
            },
          }
        );

        if (subscriptionError) {
          console.error("Subscription check failed:", subscriptionError);
          setSubscriptionStatus("Free");
          return;
        }

        console.log("Subscription check response:", subscriptionData);
        setSubscriptionStatus(subscriptionData?.subscribed ? "Active" : "Free");
      } catch (error) {
        console.error("Error checking subscription:", error);
        setSubscriptionStatus("Free");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check subscription status",
        });
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkSubscription();
      } else if (event === 'SIGNED_OUT') {
        setSubscriptionStatus("Free");
      }
    });

    // Initial check
    checkSubscription();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
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
