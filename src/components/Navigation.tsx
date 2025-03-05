
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Globe, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUsername(session?.user?.user_metadata?.username as string || null);
    };
    checkAuth();
  }, [location.pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUsername(null);
    navigate("/auth");
  };

  const navigateToProfile = () => {
    if (username) {
      navigate(`/users/${username}`);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/dashboard">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/forum">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Globe className="mr-1 h-4 w-4" />
              Forum
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {isAuthenticated ? (
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              onClick={navigateToProfile}
            >
              <User className="mr-1 h-4 w-4" />
              Profile
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
