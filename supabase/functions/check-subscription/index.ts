import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header is required')
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      throw new Error('Valid Bearer token is required')
    }

    console.log('Processing request with auth header:', authHeader.substring(0, 20) + '...')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get user directly from the session, not from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError) {
      console.error('User retrieval error:', userError)
      throw new Error(`Authentication failed: ${userError.message}`)
    }

    if (!user) {
      console.error('No user found with provided token')
      throw new Error('User not found')
    }

    console.log('Successfully authenticated user:', user.id)

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const subscriptions = await stripe.subscriptions.list({
      customer: user.id,
      status: 'active',
    })

    console.log('Found subscriptions:', subscriptions.data.length)

    return new Response(
      JSON.stringify({
        subscribed: subscriptions.data.length > 0,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in check-subscription:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})