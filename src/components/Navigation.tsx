import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Globe, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          const usernameValue = session.user.user_metadata?.username as string || null;
          setUsername(usernameValue);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to verify your login status. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUsername(null);
      navigate("/auth");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
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

  const navigateToProfile = () => {
    if (!username) {
      toast({
        variant: "destructive",
        title: "Profile Not Available",
        description: "Unable to access profile. Please sign in again."
      });
      navigate("/auth");
      return;
    }
    
    navigate(`/users/${username}`);
  };

  // Get current route for active highlighting
  const currentPath = location.pathname;
  const isHomePage = currentPath === "/";
  const isDashboardPage = currentPath === "/dashboard";
  const isForumPage = currentPath === "/forum";
  const isProfilePage = currentPath.startsWith("/users/");

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isHomePage && "bg-accent text-accent-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/dashboard">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isDashboardPage && "bg-accent text-accent-foreground"
              )}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Only show Forum link when not on forum page */}
        {!isForumPage && (
          <NavigationMenuItem>
            <Link to="/forum">
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle()
                )}
              >
                <Globe className="mr-1 h-4 w-4" />
                Forum
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
        {isAuthenticated ? (
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isProfilePage && "bg-accent text-accent-foreground",
                "cursor-pointer"
              )}
              onClick={navigateToProfile}
            >
              <User className="mr-1 h-4 w-4" />
              {username || "Profile"}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
