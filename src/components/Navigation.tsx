
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (!session && location.pathname === '/dashboard') {
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate('/');
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have an active session before attempting to sign out
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just clean up the local state
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/');
        return;
      }

      // Attempt to sign out with the current session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If we get a session_not_found error, clean up local state
        if (error.message.includes('session_not_found')) {
          setIsAuthenticated(false);
          navigate('/');
          return;
        }
        
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: "Please try again later",
        });
        return;
      }

      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            eco-creatify
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="#products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            {isLoading ? (
              <Button disabled>Loading...</Button>
            ) : isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Button onClick={handleSignOut} variant="outline" disabled={isLoading}>
                  {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#products"
              className="block hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="#features"
              className="block hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            {isLoading ? (
              <Button disabled className="w-full">Loading...</Button>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <Button onClick={() => {
                setIsOpen(false);
                navigate("/auth");
              }} className="w-full">
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
