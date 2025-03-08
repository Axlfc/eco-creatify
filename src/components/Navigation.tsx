import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings, UserPlus, BookOpen, MessageSquare, Vote, Award, LayoutDashboard, GitMerge } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSelector } from "@/components/LanguageSelector";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigateToProfile = () => {
    if (user?.username) {
      navigate(`/users/${user.username}`);
    }
  };

  const links = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/forum",
      label: "Forum",
    },
    {
      href: "/proposals",
      label: "Proposals",
      icon: Vote,
    },
    {
      href: "/proposals/consensus",
      label: "Consensus",
      icon: GitMerge,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-lg font-medium">PeaceMedia</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium ${
                isActiveRoute(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <LanguageSelector />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={navigateToProfile}>
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="h-9"
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate to different sections of the app.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 text-base ${
                      isActiveRoute(link.href)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    } transition-colors`}
                  >
                    {link.icon && <link.icon className="h-5 w-5" />}
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 text-base ${
                      isActiveRoute("/dashboard")
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    } transition-colors`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
