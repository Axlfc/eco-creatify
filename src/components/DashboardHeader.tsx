
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu, MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          const fetchedUsername = session.user.user_metadata.username as string || null;
          setUsername(fetchedUsername);
          console.log("User data retrieved successfully:", fetchedUsername);
        } else {
          console.log("No active session found");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          const nextRetry = retryCount + 1;
          setRetryCount(nextRetry);
          
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: `Retrying to fetch user data (${nextRetry}/${MAX_RETRIES})...`,
          });
          
          // Retry after a delay
          setTimeout(() => fetchUserData(), 2000);
        } else {
          toast({
            variant: "destructive",
            title: "Failed to retrieve user data",
            description: "Please reload the page or sign in again",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast, retryCount]);

  // Skip customer creation during auth check to avoid errors
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: "Please try again later",
        });
        return;
      }
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later",
      });
    }
  };

  const navigateToProfile = () => {
    if (!username) {
      toast({
        variant: "destructive",
        title: "Profile Error",
        description: "Username not available. Please sign in again."
      });
      navigate("/auth");
      return;
    }
    navigate(`/users/${username}`);
  };

  const navigateToForum = () => {
    navigate("/forum");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Dashboard Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="#products">Products & Plans</a>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="#orders">Orders</a>
                </Button>
                <Button variant="ghost" className="justify-start" onClick={navigateToForum}>
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Forum
                  </div>
                </Button>
                {username && (
                  <Button variant="ghost" className="justify-start" onClick={navigateToProfile}>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {username || "Profile"}
                    </div>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            <a
              href="#products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Products & Plans
            </a>
            <a
              href="#orders"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Orders
            </a>
            <a
              href="/forum"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center"
              onClick={(e) => {
                e.preventDefault();
                navigateToForum();
              }}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              Forum
            </a>
            {username && (
              <a
                href={`/users/${username}`}
                className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToProfile();
                }}
              >
                <Users className="mr-1 h-4 w-4" />
                {username || "Profile"}
              </a>
            )}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {username && (
                <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  {username || "Profile"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <a href="#products" className="cursor-pointer">Manage Subscription</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
