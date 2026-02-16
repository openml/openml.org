"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export function FloatingDocsButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const banner = document.getElementById("docs-banner");
    if (!banner) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating button when banner scrolls out of view
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href="https://docs.openml.org/"
      target="_blank"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-label="Visit full documentation at docs.openml.org"
    >
      <BookOpen className="h-4 w-4" />
      Full Docs
    </Link>
  );
}
