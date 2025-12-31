"use client";

import { usePathname } from "@/config/routing";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 overflow-x-hidden transition-all duration-300",
        !isHomePage && "lg:ml-64",
        !isHomePage && isCollapsed && "lg:ml-12",
      )}
    >
      {children}
    </main>
  );
}
