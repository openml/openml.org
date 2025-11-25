"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { usePathname } from "next/navigation";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isHomePage ? "ml-0" : "lg:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
