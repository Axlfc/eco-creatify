import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { redirectAfterAuth, storeIntendedDestination } = useAuthRedirect();

  // Store the intended destination when the component mounts
  useEffect(() => {
    storeIntendedDestination();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Handle signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "¡Cuenta creada!",
            description: "Revisa tu email para confirmar tu cuenta.",
          });
          
          // After signup, user will need to set username
          console.log('AuthForm: User signed up, will need username setup');
        }
      } else {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "¡Bienvenido de vuelta!",
            description: "Has iniciado sesión correctamente.",
          });

          console.log('AuthForm: User logged in, checking username status...');
          // The useAuth hook and UsernameGuard will handle username checking
          // No manual redirection here to avoid conflicts
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || "Ha ocurrido un error durante la autenticación");
      
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error.message || "Verifica tus credenciales e intenta de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        <p className="text-muted-foreground mt-2">
          {isSignUp ? "Sign up to get started" : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm"
          disabled={isLoading}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </div>
  );
};
