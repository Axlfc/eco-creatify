
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
    
    if (req.method === 'POST') {
      const { userId } = await req.json();
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Check if user exists
      const { data: userExists, error: userError } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (userError || !userExists) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      // Check if any moderators exist
      const { count, error: countError } = await supabaseClient
        .from('moderator_roles')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error checking existing moderators:', countError);
        return new Response(
          JSON.stringify({ error: 'Failed to check existing moderators' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Only allow adding the first admin if no moderators exist
      if (count && count > 0) {
        return new Response(
          JSON.stringify({ error: 'Initial moderator already assigned. Use the admin panel to manage moderators.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }
      
      // Add the user as an admin
      const { data, error } = await supabaseClient
        .from('moderator_roles')
        .insert({
          user_id: userId,
          role: 'admin',
          assigned_by: userId,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error assigning moderator role:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to assign moderator role' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: 'User has been assigned as an admin moderator', 
          data 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
