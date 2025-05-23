
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

  // Permite actualizar el username en el estado global
  const updateUsername = (username: string) => {
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, username } : null,
    }));
  };

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          // No active session
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false,
            error: "No active session"
          }));
          return;
        }

        // Try to get username from metadata
        let username = session.user.user_metadata?.username as string | undefined;

        // If not in metadata, try to get from profiles table
        if (!username) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', session.user.id)
              .single();

            if (!profileError && profile) {
              username = profile.username;
            } else {
              console.warn("Could not retrieve username from profiles:", profileError);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }

        // Extract user information
        const user: User = {
          id: session.user.id,
          email: session.user.email || undefined,
          username: username
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Authentication failed"
        });
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to retrieve user data. Please sign in again."
        });
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
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again."
      });
    }
  };

  return {
    ...authState,
    signOut,
    updateUsername,
  };
};
