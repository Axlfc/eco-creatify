import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="#settings">Settings</a>
                </Button>
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
              href="#settings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Settings
            </a>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="#profile" className="cursor-pointer">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#settings" className="cursor-pointer">Settings</a>
              </DropdownMenuItem>
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
