
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
  const updateUsername = async (username: string) => {
    console.log('useAuth: Updating username to:', username);
    
    try {
      // Update in database
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", authState.user?.id);
        
      if (error) throw error;
      
      // Update in local state
      setAuthState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, username } : null,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('useAuth: Error updating username:', error);
      throw error;
    }
  };

  // Force logout when username flow is bypassed
  const forceLogout = async (reason?: string) => {
    console.log('useAuth: Force logout triggered:', reason);
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      
      toast({
        title: "Sesión cerrada",
        description: reason || "Debes completar tu perfil para continuar",
        variant: "destructive",
      });
      
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error('useAuth: Force logout error:', error);
    }
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
            .maybeSingle();

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

        // CRITICAL: Force username selection if authenticated but no username
        if (!username) {
          console.log('useAuth: User authenticated but no username, forcing username flow');
          // This will be handled by the UsernameGuard component
          
          // Automatically navigate to setup-username page
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/setup-username') {
            navigate('/setup-username', { replace: true });
          }
        }

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
  }, [navigate]);

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
    forceLogout,
  };
};
