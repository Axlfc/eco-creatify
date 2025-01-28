import { supabase } from "@/integrations/supabase/client";

export const createCheckoutSession = async (priceId: string) => {
  try {
    console.log('Creating checkout session for price:', priceId);
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (!data.url) {
      console.error('No checkout URL returned');
      throw new Error('No checkout URL returned');
    }

    console.log('Redirecting to checkout URL:', data.url);
    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};