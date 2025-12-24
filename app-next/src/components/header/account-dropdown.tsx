"use client";

import * as React from "react";
import { User, LogOut, FileText, Bell } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

/**
 * Account Dropdown - kggl-inspired design
 * Shows user info with Profile, API Key, notifications, and Sign Out
 */
export function AccountDropdown() {
  const t = useTranslations("sidebar");
  const { data: session, status } = useSession();
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
    initials: string;
  } | null>(null);

  // Load user from NextAuth session or localStorage fallback
  React.useEffect(() => {
    console.log("🔍 [AccountDropdown] Session status:", status);
    console.log("🔍 [AccountDropdown] Session data:", session);

    if (session?.user) {
      // Use NextAuth session
      const firstName = (session.user as any).firstName || "";
      const lastName = (session.user as any).lastName || "";
      console.log(
        "👤 [AccountDropdown] firstName:",
        firstName,
        "lastName:",
        lastName,
      );

      const name =
        session.user.name || `${firstName} ${lastName}`.trim() || "User";
      const initials =
        `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() ||
        name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() ||
        "U";

      console.log("✅ [AccountDropdown] Setting user with initials:", initials);
      setUser({
        name,
        email: session.user.email || "",
        avatar: session.user.image || "",
        initials,
      });
    } else {
      // Fallback to localStorage for legacy login
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          const initials =
            `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";

          // Treat "0000" or invalid images as no image
          const hasValidImage =
            userData.image &&
            userData.image !== "0000" &&
            (userData.image.startsWith("http") ||
              userData.image.startsWith("/"));

          setUser({
            name:
              `${firstName} ${lastName}`.trim() || userData.username || "User",
            email: userData.email || "",
            avatar: hasValidImage ? userData.image : "",
            initials: initials,
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [session]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  const [notifications] = React.useState([
    {
      id: 1,
      title: "New Badge Received",
      description:
        "Congratulations, you're a member of openML Community Member badge",
      time: "2d",
      isNew: true,
    },
  ]);

  // If not logged in, show sign-in button
  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/account">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-10 cursor-pointer rounded-full hover:bg-slate-100"
        >
          <Avatar className="size-10 border-2 border-slate-200">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="gradient-bg text-sm font-semibold text-white">
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {/* User Header */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border-2 border-slate-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="gradient-bg text-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-base font-semibold">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild className="cursor-pointer py-3">
          <Link href="/auth/profile" className="flex items-center gap-3">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer py-3">
          <Link href="/auth/api-key" className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">API Key</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer py-3 text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="text-sm font-medium">Log out</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Notifications Section */}
        <div className="p-2">
          <div className="mb-2 flex items-center justify-between px-2">
            <h4 className="text-sm font-semibold">Your notifications</h4>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              •••
            </Button>
          </div>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="hover:bg-accent rounded-md p-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">
                        {notification.title}
                      </p>
                      {notification.isNew && (
                        <Badge className="h-5 bg-blue-500 text-xs">
                          {notification.time}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs leading-snug">
                      {notification.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
