
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  error?: string;
  children: React.ReactNode;
}

export function LoadingState({
  isLoading,
  loadingText = "Loading...",
  error,
  children
}: LoadingStateProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-destructive mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Error Loading Data</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">{loadingText}</p>
      </div>
    );
  }

  return <>{children}</>;
}
