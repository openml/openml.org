"use client";

import { useSidebar } from "@/contexts/sidebar-context";

export function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const { homeMenuIconOnly, setHomeMenuIconOnly } = useSidebar();

  const handleClick = () => {
    if (!homeMenuIconOnly) {
      setHomeMenuIconOnly(true);
    }
  };

  return (
    <div onClick={handleClick} className="min-h-screen">
      {children}
    </div>
  );
}
