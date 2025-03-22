"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import NotificationDropdown from "@/components/ui/notification-dropdown";
import { Home, BookOpen, BookText, ListChecks, MessageSquare, Trophy, User, LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Navigation items for the sidebar
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Question Bank", href: "/question-bank", icon: BookOpen },
  { name: "Mock Exams", href: "/mock-exam", icon: BookText },
  { name: "Quick Practice", href: "/quick-practice", icon: ListChecks },
  { name: "Doubts Forum", href: "/doubts", icon: MessageSquare },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle sidebar expansion state
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect handled by auth state change listener
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Check if a navigation item is active
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile hamburger menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="text-foreground" aria-label="Toggle menu">
          <Menu />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={toggleMobileSidebar}></div>}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-50 bg-background border-r border-border transition-all duration-300 ${expanded ? "w-64" : "w-20"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className={`text-primary font-bold ${expanded ? "text-xl" : "text-sm"}`}>
            {expanded ? "ShudhuMCQ" : "SM"}
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex" aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}>
            {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="lg:hidden" aria-label="Close sidebar">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation items */}
        <div className="py-6 px-3 flex flex-col h-[calc(100%-12rem)]">
          <nav className="space-y-1 flex-grow">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                  <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
                  {expanded && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile and actions */}
        <div className="h-36 border-t border-border px-3 py-4">
          {user && (
            <div className="flex items-center mb-4">
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">{user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}</div>
              {expanded && (
                <div className="ml-3 truncate">
                  <p className="text-sm font-medium text-foreground truncate">{user.displayName || user.email || "User"}</p>
                  {user.displayName && user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <ThemeToggle />
              <NotificationDropdown />
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
