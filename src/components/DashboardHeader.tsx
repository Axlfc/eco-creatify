
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

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUsername(session.user.user_metadata.username as string || null);
      }
    };
    
    fetchUserData();
  }, []);

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
    if (username) {
      navigate(`/users/${username}`);
    }
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
                      Profile
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
                Profile
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
                  Profile
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
