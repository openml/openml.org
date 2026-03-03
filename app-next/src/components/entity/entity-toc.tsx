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
import { ArrowLeft, Grid3x3, type LucideIcon } from "lucide-react";
import { EntityConfig } from "@/config/entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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

function isFontAwesomeIcon(
  icon: LucideIcon | IconDefinition,
): icon is IconDefinition {
  return (
    typeof icon === "object" &&
    icon !== null &&
    "prefix" in icon &&
    "iconName" in icon
  );
}

export function EntityToc({
  config,
  visibleSections,
  sectionCounts = {},
  showNavigation = true,
}: EntityTocProps) {
  // Styles based on config.color
  // approximating bg-color-50/70 and border-color-500/40
  const containerStyle = {
    borderColor: `${config.color}66`, // 40% opacity
    backgroundColor: `${config.color}1a`, // ~10% opacity (light background)
  };

  const titleStyle = {
    color: config.color,
  };

  const linkStyle = {
    color: config.color,
    // Note: Hover background color is tricky with inline styles.
    // We'll rely on a generic hover class like hover:bg-black/5 or just opacity.
  };

  // Filter sections to only show visible ones
  const sections = visibleSections
    ? config.sections.filter((s) => visibleSections.includes(s.id))
    : config.sections;

  return (
    <div className="sticky top-32 space-y-4">
      {/* Table of Contents */}
      <div
        className="rounded-sm border-l-2 p-4 transition-colors"
        style={containerStyle}
      >
        <h3 className="mb-3 text-sm font-semibold" style={titleStyle}>
          On This Page
        </h3>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const count = sectionCounts[section.id];
            const label = count ? `${section.label} (${count})` : section.label;

            // Special rotation moved to specific check or removed if using correct icon
            // Assuming the icon is correct. If it needs rotation, we could check section.id === "features"
            // But FontAwesome icons usually don't need manual rotation if picked correctly.

            const iconClass =
              section.id === "features" ? "h-4 w-4 rotate-90" : "h-4 w-4";
            // If it's FontAwesome, className applies too.

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="hover:bg-accent/50 flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                style={linkStyle}
              >
                {isFontAwesomeIcon(Icon) ? (
                  <FontAwesomeIcon icon={Icon} className={iconClass} />
                ) : (
                  <Icon className={iconClass} />
                )}
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
