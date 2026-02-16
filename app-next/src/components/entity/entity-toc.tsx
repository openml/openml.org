/**
 * 🎯 Generic Entity Table of Contents Component
 *
 * Reusable TOC sidebar that works with any entity type.
 * Configured through EntityConfig sections.
 *
 * USAGE:
 * <EntityToc config={entityConfigs.dataset} visibleSections={['description', 'features']} />
 * <EntityToc config={entityConfigs.task} visibleSections={['description', 'dataset']} />
 */

import Link from "next/link";
import { ArrowLeft, Grid3x3 } from "lucide-react";
import { EntityConfig } from "@/config/entities";

interface EntityTocProps {
  config: EntityConfig;
  /**
   * Which sections are actually visible on the page.
   * Only visible sections will be shown in the TOC.
   * Pass the section IDs that have content.
   */
  visibleSections?: string[];
  /**
   * Optional section counts (e.g., { features: 10 } shows "Features (10)")
   */
  sectionCounts?: Record<string, number>;
  /**
   * Show navigation links (Back to Search, All [Entity])
   * @default true
   */
  showNavigation?: boolean;
}

export function EntityToc({
  config,
  visibleSections,
  sectionCounts = {},
  showNavigation = true,
}: EntityTocProps) {
  // Get the CSS classes for the entity's color theme
  const colorClasses = getColorClasses(config.color);

  // Filter sections to only show visible ones
  const sections = visibleSections
    ? config.sections.filter((s) => visibleSections.includes(s.id))
    : config.sections;

  return (
    <div className="sticky top-32 space-y-4">
      {/* Table of Contents */}
      <div className={`rounded-sm border-l-2 p-4 ${colorClasses.container}`}>
        <h3 className={`mb-3 text-sm font-semibold ${colorClasses.title}`}>
          On This Page
        </h3>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const count = sectionCounts[section.id];
            const label = count ? `${section.label} (${count})` : section.label;

            // Special rotation for features icon (barChart3 rotated 90°)
            const iconClass =
              section.id === "features" ? "h-4 w-4 rotate-90" : "h-4 w-4";

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${colorClasses.link}`}
              >
                <Icon className={iconClass} />
                {label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Navigation Links */}
      {showNavigation && (
        <div className="bg-background/40 rounded-sm border-l-2 p-4">
          <h3 className="text-foreground mb-3 text-sm font-semibold">
            Navigation
          </h3>
          <nav className="space-y-1">
            <Link
              href={config.listPath}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
            <Link
              href={config.listPath}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
            >
              <Grid3x3 className="h-4 w-4" />
              All {config.plural}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

/**
 * Get Tailwind classes based on entity color
 * Maps hex colors to appropriate Tailwind utility classes
 */
function getColorClasses(color: string): {
  container: string;
  title: string;
  link: string;
} {
  // Map entity colors to Tailwind classes
  switch (color) {
    case "#66BB6A": // Green (datasets)
      return {
        container: "border-green-500/40 bg-green-50/70 dark:bg-green-950/20",
        title: "text-green-700 dark:text-green-400",
        link: "text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30",
      };
    case "#FFA726": // Orange (tasks)
      return {
        container: "border-orange-500/40 bg-orange-50/70 dark:bg-orange-950/20",
        title: "text-orange-700 dark:text-orange-400",
        link: "text-orange-700 hover:bg-orange-100 dark:text-orange-400 dark:hover:bg-orange-900/30",
      };
    case "#42A5F5": // Blue (flows)
      return {
        container: "border-blue-500/40 bg-blue-50/70 dark:bg-blue-950/20",
        title: "text-blue-700 dark:text-blue-400",
        link: "text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30",
      };
    case "#EF5350": // Red (runs)
      return {
        container: "border-red-500/40 bg-red-50/70 dark:bg-red-950/20",
        title: "text-red-700 dark:text-red-400",
        link: "text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30",
      };
    case "#AB47BC": // Purple (collections/benchmarks)
      return {
        container: "border-purple-500/40 bg-purple-50/70 dark:bg-purple-950/20",
        title: "text-purple-700 dark:text-purple-400",
        link: "text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30",
      };
    default: // Gray (fallback)
      return {
        container: "border-gray-500/40 bg-gray-50/70 dark:bg-gray-950/20",
        title: "text-gray-700 dark:text-gray-400",
        link: "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900/30",
      };
  }
}
