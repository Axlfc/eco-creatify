
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
        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setSubscriptionStatus("Free");
          return;
        }

        if (!session) {
          console.log("No active session found");
          setSubscriptionStatus("Free");
          return;
        }

        console.log("Found active session, ensuring customer exists");

        // Create/retrieve Stripe customer
        const { data: customerData, error: customerError } = await supabase.functions.invoke(
          "create-stripe-customer",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (customerError) {
          console.error("Customer creation/retrieval failed:", customerError);
          setSubscriptionStatus("Free");
          return;
        }

        console.log("Customer response:", customerData);
        console.log("Checking subscription status");

        // Check subscription status
        const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke(
          "check-subscription",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
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
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkSubscription();
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
