
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Loader2 } from "lucide-react";

interface TranslatableTextProps {
  text: string;
  sourceLanguage?: string;
  className?: string;
}

export const TranslatableText: React.FC<TranslatableTextProps> = ({
  text,
  sourceLanguage = "en",
  className,
}) => {
  const { translateText, currentLanguage, isTranslating } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (currentLanguage === sourceLanguage) {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      const result = await translateText(text, currentLanguage, sourceLanguage);
      setTranslatedText(result);
      setIsLoading(false);
    };

    translate();
  }, [text, currentLanguage, sourceLanguage, translateText]);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-muted-foreground">Translating...</span>
      </div>
    );
  }

  return <div className={className}>{translatedText}</div>;
};
