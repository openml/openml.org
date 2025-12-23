"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  id?: string;
  title: string;
  description?: string;
  /** Pass a pre-rendered icon element instead of a component */
  icon?: ReactNode;
  iconColor?: string;
  badge?: string | number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  headerExtra?: React.ReactNode;
}

/**
 * CollapsibleSection Component
 *
 * A reusable collapsible card section for the dataset detail page.
 * Features:
 * - Expand/collapse with smooth animation
 * - Optional icon and badge
 * - Optional header extra content (e.g., filters, actions)
 */
export function CollapsibleSection({
  id,
  title,
  description,
  icon,
  badge,
  defaultOpen = true,
  children,
  className,
  headerExtra,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      <Card>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-left transition-opacity hover:opacity-80">
                  {icon && (
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                      {icon}
                    </div>
                  )}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {title}
                      {badge !== undefined && (
                        <Badge variant="secondary" className="ml-1">
                          {badge}
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <ChevronDown className="text-muted-foreground h-4 w-4" />
                      )}
                    </CardTitle>
                    {description && (
                      <CardDescription>{description}</CardDescription>
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>

              {/* Optional header extra content */}
              {headerExtra && (
                <div className="hidden items-center gap-2 md:flex">
                  {headerExtra}
                </div>
              )}
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent>{children}</CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </section>
  );
}
