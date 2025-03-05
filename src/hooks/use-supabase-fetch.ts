
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseFetchOptions<T> {
  query: () => Promise<{ data: T | null; error: Error | null }>;
  dependencies?: any[];
  autoFetch?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  fallbackData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useSupabaseFetch<T>({
  query,
  dependencies = [],
  autoFetch = true,
  maxRetries = 3,
  retryDelay = 2000,
  fallbackData,
  onSuccess,
  onError
}: UseFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const { toast } = useToast();

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);

      const { data: responseData, error: responseError } = await query();

      if (responseError) {
        throw responseError;
      }

      if (responseData) {
        setData(responseData);
        setRetryCount(0);
        if (onSuccess) {
          onSuccess(responseData);
        }
      } else if (fallbackData) {
        setData(fallbackData);
      }
    } catch (err) {
      const errorObj = err as Error;
      console.error('Fetch error:', errorObj);
      setError(errorObj);

      // Handle retry logic
      if (retryCount < maxRetries) {
        const nextRetry = retryCount + 1;
        setRetryCount(nextRetry);
        
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: `Retrying data fetch (${nextRetry}/${maxRetries})...`,
        });
        
        setTimeout(() => fetchData(true), retryDelay);
      } else if (onError) {
        onError(errorObj);
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [query, retryCount, maxRetries, retryDelay, fallbackData, onSuccess, onError, toast]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    hasRetried: retryCount > 0,
    retryCount
  };
}

export default useSupabaseFetch;
