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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error('Failed to get session');
        }

        if (!session?.access_token) {
          console.log('No active session found');
          setSubscriptionStatus("Free");
          return;
        }

        console.log('Found active session, checking subscription');
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Subscription check failed:', error);
          throw error;
        }

        console.log('Subscription check response:', data);
        setSubscriptionStatus(data.subscribed ? "Active" : "Free");
      } catch (error: any) {
        console.error("Error checking subscription:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to check subscription status",
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