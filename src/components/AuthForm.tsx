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
  const { toast } = useToast();
  const { redirectAfterAuth, storeIntendedDestination } = useAuthRedirect();

  // Store the intended destination when the component mounts
  useEffect(() => {
    storeIntendedDestination();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Check if the error is due to unconfirmed email
          if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email Not Verified",
              description: "Please check your email and verify your account before signing in.",
              variant: "destructive",
            });
            // Optionally, we can offer to resend the confirmation email
            const { error: resendError } = await supabase.auth.resend({
              type: 'signup',
              email,
            });
            if (!resendError) {
              toast({
                title: "Verification Email Sent",
                description: "We've resent the verification email. Please check your inbox.",
              });
            }
          } else {
            throw error;
          }
        } else if (data.user) {
          // Check if user has username in profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', data.user.id)
            .single();

          // If no username, the auth hook will handle redirection to setup-username
          // Otherwise use the normal redirect logic
          if (profile?.username) {
            redirectAfterAuth();
          }
          // If no username, the useAuth hook will automatically redirect to /setup-username
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
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
