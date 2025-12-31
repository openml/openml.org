"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
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

// User Activity Sidebar - kggl-inspired collapsible sidebar
export function UserActivitySidebar({ className }: UserActivitySidebarProps) {
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
    initials: string;
  } | null>(null);

  // Determine background color based on theme
  const bgColor = resolvedTheme === "dark" ? "#0f172a" : "#ffffff"; // slate-900 or white

  // Close sidebar when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Close on escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  // Load user from NextAuth session or localStorage fallback
  React.useEffect(() => {
    // console.log("🔍 [UserActivitySidebar] Session status:", status);
    // console.log("🔍 [UserActivitySidebar] Session:", session);

    if (status === "authenticated" && session?.user) {
      const firstName = (session.user as any).firstName || "";
      const lastName = (session.user as any).lastName || "";
      // console.log(
      //   "👤 [UserActivitySidebar] firstName:",
      //   firstName,
      //   "lastName:",
      //   lastName,
      // );

      const name =
        session.user.name ||
        `${firstName} ${lastName}`.trim() ||
        (session.user as any).username ||
        session.user.email?.split("@")[0] ||
        "User";
      const email = session.user.email || "";

      // Check localStorage for updated avatar (in case of upload)
      let avatar = session.user.image || "";
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.image) {
            avatar = userData.image;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Calculate initials from firstName/lastName first, then fallback to name
      let initials = "OP";
      if (firstName && lastName) {
        initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
      } else if (name && name.length > 0) {
        const nameParts = name.split(" ").filter((n: string) => n.length > 0);
        if (nameParts.length >= 2) {
          initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
          initials = nameParts[0].substring(0, 2).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length === 1) {
          initials = nameParts[0][0].toUpperCase();
        }
      }

      // console.log(
      //   "✅ [UserActivitySidebar] Setting user with initials:",
      //   initials,
      // );
      setUser({
        name,
        email,
        avatar,
        initials,
      });
    } else {
      // Fallback to localStorage for backward compatibility
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          const userName =
            `${firstName} ${lastName}`.trim() || userData.username || "User";

          // Calculate initials safely
          let initials = "OP";
          if (firstName && lastName) {
            initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
          } else if (userName && userName.length > 0) {
            const nameParts = userName
              .split(" ")
              .filter((n: string) => n.length > 0);
            if (nameParts.length >= 2) {
              initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
              initials = nameParts[0].substring(0, 2).toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0].length === 1) {
              initials = nameParts[0][0].toUpperCase();
            }
          }

          setUser({
            name: userName,
            email: userData.email || "",
            avatar: userData.image || "",
            initials: initials,
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [session, status]);

  // Poll localStorage for avatar updates (e.g., after upload)
  React.useEffect(() => {
    const checkForAvatarUpdate = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && user) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.image && userData.image !== user.avatar) {
            // Avatar changed - update state
            setUser({ ...user, avatar: userData.image });
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    };

    // Check every 2 seconds for avatar updates
    const interval = setInterval(checkForAvatarUpdate, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const [notifications] = React.useState<UserActivityItem[]>([
    {
      id: 1,
      title: "New Badge Received",
      description: "Congratulations, you're a member of opemML Community",
      time: "2d",
      isNew: true,
    },
  ]);

  const handleSignOut = () => {
    // Clear localStorage for backward compatibility
    localStorage.removeItem("user");
    localStorage.removeItem("openml_token");
    setUser(null);
    setIsOpen(false);
    // Use NextAuth signOut
    signOut({ callbackUrl: "/auth/signin" });
  };

  const menuItems = [
    {
      label: "Your Work",
      href: "/dashboard",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Your Profile",
      href: "/auth/profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Avatar Button */}
      {!user ? (
        // Not logged in - show 'Sign In' button with Google-inspired design
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="group cursor-pointer gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-600 hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700"
        >
          <Link href="/auth/signin" title="Sign In">
            <UserIcon className="size-5 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            <span>Sign In</span>
          </Link>
        </Button>
      ) : (
        // Logged in - show user image if available, otherwise User icon with gradient background
        <Button
          variant="ghost"
          size="icon"
          className="relative size-10 cursor-pointer rounded-full p-0 hover:bg-transparent"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 transition-opacity hover:opacity-90 dark:border-blue-400">
            {user.avatar &&
            (user.avatar.startsWith("http://") ||
              user.avatar.startsWith("https://")) ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="gradient-bg flex size-full items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user.initials}
                </span>
              </div>
            )}
          </div>
        </Button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 transform border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-[#0f172a]",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none invisible translate-x-full opacity-0",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {/* Close Button - Top Right - Ensure it's clickable and visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-60 size-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-slate-900 dark:text-white" />
          </Button>

          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500 dark:border-blue-400">
              {user?.avatar &&
              (user.avatar.startsWith("http://") ||
                user.avatar.startsWith("https://")) ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="gradient-bg flex size-full items-center justify-center">
                  <span className="text-xl font-semibold text-white">
                    {user?.initials}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 pr-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </h2>
              {user?.email && (
                <p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav
            className="border-b border-slate-200 px-2 py-2 dark:border-slate-700"
            style={{ backgroundColor: bgColor }}
          >
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-6 py-3 text-base text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
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
              className="flex w-full items-center gap-3 rounded-lg px-6 py-3 text-base text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </nav>

          {/* Notifications Section */}
          <div
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
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
              <div className="space-y-1 px-0 pb-4">
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
