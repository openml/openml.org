"use client";

import { useSidebar } from "@/contexts/sidebar-context";

export function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const { homeMenuOpen, setHomeMenuOpen } = useSidebar();

  const handleClick = () => {
    if (homeMenuOpen) {
      setHomeMenuOpen(false);
    }
  };

  return (
    <div onClick={handleClick} className="homepage-bg min-h-screen">
      {children}
    </div>
  );
}
