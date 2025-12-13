"use client";

import * as React from "react";
import {
  ChevronRight,
  X,
  User as UserIcon,
  Settings,
  Users,
  FileText,
  LogOut,
  Bell,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface UserActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

interface UserActivitySidebarProps {
  className?: string;
}

/**
 * User Activity Sidebar - Kaggle-inspired collapsible sidebar
 * Shows user profile quick links and recent notifications
 * Triggered by avatar button in header
 */
export function UserActivitySidebar({ className }: UserActivitySidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
    initials: string;
  } | null>(null);

  // Load user from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const firstName = userData.firstName || "";
        const lastName = userData.lastName || "";
        const initials =
          `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "OP";

        setUser({
          name:
            `${firstName} ${lastName}`.trim() || userData.username || "User",
          email: userData.email || "",
          avatar: userData.image || "",
          initials: initials,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const [notifications] = React.useState<UserActivityItem[]>([
    {
      id: 1,
      title: "New Badge Received",
      description:
        "Congratulations, you've received Kaggle Community Member badge",
      time: "2d",
      isNew: true,
    },
  ]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    window.location.href = "/";
  };

  const menuItems = [
    {
      label: "Your Work",
      href: "/dashboard",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Your Profile",
      href: "/profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      label: "Your Groups",
      href: "/groups",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Avatar component - shows favicon for non-logged users, initials/image for logged users
  const AvatarButton = () => {
    if (!user) {
      // Not logged in - show OpenML mini logo in round avatar
      return (
        <Button
          variant="ghost"
          size="icon"
          className="relative size-10 cursor-pointer rounded-full p-0 hover:bg-transparent"
          asChild
        >
          <Link href="/auth/account">
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-300 bg-slate-700 transition-colors hover:bg-slate-500 dark:border-slate-600 dark:bg-slate-200 dark:hover:bg-slate-300">
              <Image
                src="/openML_logo_mini-sidebar.png"
                alt="OpenML"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
          </Link>
        </Button>
      );
    }

    // Logged in - show avatar with image or initials
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative size-10 cursor-pointer rounded-full p-0 hover:bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 transition-colors dark:border-blue-400">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-slate-700 text-sm font-bold text-white transition-colors hover:bg-slate-500 hover:text-slate-300 dark:bg-slate-200 dark:text-slate-700 dark:hover:bg-slate-300 dark:hover:text-slate-700">
              {user.initials}
            </div>
          )}
        </div>
      </Button>
    );
  };

  return (
    <>
      {/* Avatar Button */}
      <AvatarButton />

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Kaggle Style */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-800",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-4 border-b p-6">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500 dark:border-blue-400">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-slate-700 text-xl font-bold text-white dark:bg-slate-200 dark:text-slate-700">
                  {user?.initials}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </h2>
              {user?.email && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {user.email}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="border-b px-4 py-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </Link>
            ))}

            <Separator className="my-2" />

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </nav>

          {/* Notifications Section */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Your notifications
                </h3>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-1 px-4 pb-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-4 rounded-lg p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {notification.title}
                        </p>
                        {notification.isNew && (
                          <Badge
                            variant="default"
                            className="shrink-0 bg-blue-500 text-xs"
                          >
                            {notification.time}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
