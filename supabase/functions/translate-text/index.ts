
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { text, targetLanguage, sourceLanguage } = await req.json();
    
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Text and target language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, we'll use a simple mock translation service
    // In a production app, you would integrate with a real translation API like Google Translate
    const mockTranslate = (text: string, sourceLanguage: string, targetLanguage: string) => {
      // This is just a simulation for demo purposes
      const translations: Record<string, Record<string, string>> = {
        "Hello, how are you?": {
          "es": "Hola, ¿cómo estás?",
          "fr": "Bonjour, comment ça va?",
          "de": "Hallo, wie geht es dir?",
          "zh": "你好，你好吗？",
          "ar": "مرحبا، كيف حالك؟",
        },
        "What is your opinion on this issue?": {
          "es": "¿Cuál es tu opinión sobre este tema?",
          "fr": "Quelle est votre opinion sur cette question?",
          "de": "Was ist deine Meinung zu diesem Thema?",
          "zh": "你对这个问题有什么看法？",
          "ar": "ما رأيك في هذه المسألة؟",
        }
      };

      // Check if we have a predefined translation
      if (translations[text]?.[targetLanguage]) {
        return translations[text][targetLanguage];
      }

      // Simple mock for demonstration: append language code to show translation happened
      return `[${targetLanguage}] ${text}`;
    };

    const translatedText = mockTranslate(text, sourceLanguage || 'en', targetLanguage);

    return new Response(
      JSON.stringify({ translatedText, sourceLanguage: sourceLanguage || 'en', targetLanguage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
