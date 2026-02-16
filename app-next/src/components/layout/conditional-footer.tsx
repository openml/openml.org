"use client";

import { usePathname } from "@/config/routing";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (!isHomePage) {
    return null;
  }

  return <Footer />;
}
