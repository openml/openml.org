"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ToCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: ToCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const t = useTranslations("home.about.toc");
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -35% 0px" },
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (isCollapsed) {
    return (
      <div className="sticky top-8">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="outline"
          size="icon"
          className="bg-background hover:bg-accent shadow-md"
          title="Expand navigation"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="sticky top-8 max-h-[calc(100vh-12rem)] w-72 space-y-4 overflow-y-auto">
      {/* Collapse Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCollapsed(true)}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          title="Collapse navigation"
        >
          <ChevronRight className="mr-1 h-4 w-4" />
          Hide
        </Button>
      </div>

      {/* Table of Contents */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <h3 className="text-primary mb-3 text-sm font-semibold">
          {t("onThisPage")}
        </h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={cn(
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white",
                item.level === 3 && "pl-6",
                activeId === item.id &&
                  "bg-accent text-accent-foreground font-medium",
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
