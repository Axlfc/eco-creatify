
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

  // Update username in global state
  const updateUsername = (username: string) => {
    console.log('useAuth: Updating username to:', username);
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, username } : null,
    }));
  };

  useEffect(() => {
    let mounted = true;

    const checkAuthAndFetchUser = async () => {
      try {
        console.log('useAuth: Checking auth state...');
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          console.log('useAuth: No active session');
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
          return;
        }

        console.log('useAuth: Active session found for user:', session.user.id);

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
            console.log('useAuth: Username found:', username);
          } else {
            console.log('useAuth: No username found in profile');
          }
        } catch (error) {
          console.error("useAuth: Error fetching profile:", error);
        }

        // Create user object
        const user: User = {
          id: session.user.id,
          email: session.user.email || undefined,
          username: username
        };

        if (mounted) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }

        console.log('useAuth: Auth state updated:', { 
          authenticated: true, 
          hasUsername: !!username 
        });

      } catch (error) {
        console.error('useAuth: Error during auth check:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : "Authentication failed"
          });
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          // Don't call checkAuthAndFetchUser here to avoid loops
          // Just update the basic auth state and let the main effect handle the rest
          console.log('useAuth: User signed in, will fetch profile...');
          checkAuthAndFetchUser();
        } else if (event === 'SIGNED_OUT') {
          console.log('useAuth: User signed out');
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        }
      }
    );

    // Initial auth check
    checkAuthAndFetchUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('useAuth: Signing out...');
      await supabase.auth.signOut();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      
      navigate("/auth", { replace: true });
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente."
      });
    } catch (error) {
      console.error('useAuth: Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "Ha ocurrido un error. Intenta de nuevo."
      });
    }
  };

  return {
    ...authState,
    signOut,
    updateUsername,
  };
};
