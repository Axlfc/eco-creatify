import { supabase } from "@/integrations/supabase/client";

export const createCheckoutSession = async (priceId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
    });

    if (error) throw error;
    if (!data.url) throw new Error('No checkout URL returned');

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};