import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export interface User {
  id?: string;
  email?: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          // No active session, redirect to auth
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false,
            error: "No active session"
          }));
          navigate("/auth");
          return;
        }

        // Extract user information
        const user: User = {
          id: session.user.id,
          email: session.user.email || undefined,
          username: session.user.user_metadata?.username || undefined
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error("Authentication error:", error);
        
        // Set error state
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Authentication failed"
        });

        // Show toast notification
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to retrieve user data. Please sign in again."
        });

        // Redirect to auth page
        navigate("/auth");
      }
    };

    checkAuthAndFetchUser();
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      navigate("/auth");
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again."
      });
    }
  };

  return {
    ...authState,
    signOut
  };
};
