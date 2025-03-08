
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const availableLanguages: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const { toast } = useToast();

  const translateText = useCallback(
    async (text: string, targetLanguage: string, sourceLanguage?: string) => {
      if (!text || text.trim() === "") return text;
      if (targetLanguage === (sourceLanguage || "en")) return text;

      setIsTranslating(true);
      try {
        const { data, error } = await supabase.functions.invoke("translate-text", {
          body: { text, targetLanguage, sourceLanguage },
        });

        if (error) {
          console.error("Translation error:", error);
          toast({
            title: "Translation Failed",
            description: "Could not translate the text. Please try again.",
            variant: "destructive",
          });
          return text;
        }

        return data.translatedText;
      } catch (err) {
        console.error("Translation error:", err);
        toast({
          title: "Translation Error",
          description: "An error occurred during translation.",
          variant: "destructive",
        });
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [toast]
  );

  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
  }, []);

  return {
    translateText,
    isTranslating,
    currentLanguage,
    changeLanguage,
    availableLanguages,
  };
};
