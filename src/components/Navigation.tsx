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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("Session debug:", {
          session: !!session,
          user: session?.user,
          metadata: session?.user?.user_metadata,
          error
        });

        if (error) {
          console.error("Session retrieval error:", error);
          throw error;
        }

        setIsAuthenticated(!!session);
        
        if (session?.user) {
          const usernameValue = session.user.user_metadata?.username as string || null;
          
          console.log("Username from metadata:", usernameValue);
          
          if (!usernameValue) {
            console.warn("No username found in user metadata");
          }
          
          setUsername(usernameValue);
        } else {
          console.warn("No active session found");
        }
      } catch (error) {
        console.error("Authentication check comprehensive error:", error);
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

  const navigateToProfile = async () => {
    try {
      // Recheck authentication right before navigation
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Pre-navigation session check:", {
        session: !!session,
        user: session?.user,
        username: session?.user?.user_metadata?.username
      });

      if (!session || !session.user) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Please sign in again."
        });
        navigate("/auth");
        return;
      }

      const usernameValue = session.user.user_metadata?.username as string;

      if (!usernameValue) {
        toast({
          variant: "destructive",
          title: "Profile Not Available",
          description: "Username not found. Please update your profile or contact support."
        });
        navigate("/auth");
        return;
      }
      
      navigate(`/users/${usernameValue}`);
    } catch (error) {
      console.error("Profile navigation error:", error);
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description: "Unable to navigate to profile. Please try again."
      });
      navigate("/auth");
    }
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
                location.pathname.startsWith("/users/") && "bg-accent text-accent-foreground",
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
