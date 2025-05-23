
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
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          return;
        }

        // Try to get username from profiles table
        let username: string | undefined;
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profile) {
            username = profile.username;
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
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

        // IMPORTANTE: Solo redirigir a setup-username si:
        // 1. El usuario está autenticado
        // 2. No tiene username
        // 3. No está ya en las rutas permitidas sin username
        const currentPath = window.location.pathname;
        const allowedPathsWithoutUsername = ['/auth', '/setup-username', '/'];
        
        if (!username && !allowedPathsWithoutUsername.includes(currentPath)) {
          console.log('User authenticated but no username, redirecting to setup');
          navigate('/setup-username', { replace: true });
        }

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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          // Refresh auth state when user signs in
          checkAuthAndFetchUser();
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          // Clear any pending redirects and go to auth
          navigate('/auth', { replace: true });
        }
      }
    );

    checkAuthAndFetchUser();

    return () => subscription.unsubscribe();
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
