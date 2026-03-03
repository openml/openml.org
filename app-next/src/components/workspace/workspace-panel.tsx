"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Clock,
  BarChart3,
  Settings2,
  Tags,
  FileText,
  LineChart,
  Download,
  GitCompareArrows,
  ExternalLink,
  Database,
  Layers,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS, entityColors } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspace, type EntityType } from "@/contexts/workspace-context";

// ─── Icon lookup (string → component) ───────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  Settings2,
  Tags,
  FileText,
  LineChart,
  Download,
  GitCompareArrows,
  ExternalLink,
  Database,
  Layers,
};

function IconByName({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

// ─── Entity color helper ────────────────────────────────────────────────
const ENTITY_COLOR_MAP: Record<EntityType, string> = {
  run: entityColors.run,
  dataset: entityColors.data,
  task: entityColors.task,
  flow: entityColors.flow,
  collection: entityColors.collections,
  benchmark: entityColors.benchmarks,
  measure: entityColors.measures,
};

const ENTITY_ICON_MAP: Record<EntityType, keyof typeof ENTITY_ICONS> = {
  run: "run",
  dataset: "dataset",
  task: "task",
  flow: "flow",
  collection: "collection",
  benchmark: "benchmark",
  measure: "measure",
};

// ═══════════════════════════════════════════════════════════════════════
// Main Panel
// ═══════════════════════════════════════════════════════════════════════
export function WorkspacePanel() {
  const {
    entity,
    sections,
    quickLinks,
    actions,
    recentEntities,
    isPanelCollapsed: isCollapsed,
    setIsPanelCollapsed: setIsCollapsed,
  } = useWorkspace();

  const [mobileOpen, setMobileOpen] = useState(false);

  const hasContent =
    entity !== null || sections.length > 0 || recentEntities.length > 0;

  // ── Mobile button ─────────────────────────────────────────────────
  const mobileButton = hasContent ? (
    <div className="fixed right-6 bottom-6 z-50 xl:hidden">
      <Button
        onClick={() => setMobileOpen(!mobileOpen)}
        size="lg"
        className="shadow-lg"
        style={{
          backgroundColor: entity
            ? ENTITY_COLOR_MAP[entity.type]
            : entityColors.run,
        }}
      >
        {mobileOpen ? (
          <X className="mr-2 h-5 w-5" />
        ) : (
          <Menu className="mr-2 h-5 w-5" />
        )}
        {mobileOpen ? "Close" : "Context"}
      </Button>
    </div>
  ) : null;

  // ── Mobile panel ──────────────────────────────────────────────────
  const mobilePanel = mobileOpen ? (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 xl:hidden"
        onClick={() => setMobileOpen(false)}
      />
      <div className="bg-background fixed top-0 right-0 bottom-0 z-50 w-80 shadow-2xl xl:hidden">
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Workspace</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <PanelContent />
        </div>
      </div>
    </>
  ) : null;

  // ── Desktop panel ─────────────────────────────────────────────────
  const desktopPanel = !hasContent ? null : (
    <aside
      className={`fixed top-28 right-0 bottom-0 z-30 hidden border-l transition-all duration-300 xl:block ${
        isCollapsed ? "w-12" : "w-72"
      } bg-background`}
    >
      {isCollapsed ? (
        <div className="p-2">
          <Button
            onClick={() => setIsCollapsed(false)}
            variant="outline"
            size="icon"
            className="bg-background hover:bg-accent shadow-md"
            title="Expand panel"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="h-full w-72 space-y-4 overflow-y-auto p-4 pb-8">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsCollapsed(true)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              title="Collapse panel"
            >
              <ChevronRight className="mr-1 h-4 w-4" />
              Hide
            </Button>
          </div>
          <PanelContent />
        </div>
      )}
    </aside>
  );

  return (
    <>
      {mobileButton}
      {mobilePanel}
      {desktopPanel}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Panel Content (shared between mobile + desktop)
// ═══════════════════════════════════════════════════════════════════════
function PanelContent() {
  const { entity, sections, quickLinks, actions, recentEntities } =
    useWorkspace();

  return (
    <div className="space-y-4">
      {/* ── On This Page ─────────────────────────────────────────── */}
      {sections.length > 0 && (
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <h3
            className="mb-3 text-sm font-semibold"
            style={{
              color: entity ? ENTITY_COLOR_MAP[entity.type] : entityColors.run,
            }}
          >
            On This Page
          </h3>
          <nav className="space-y-0.5">
            {sections.map((section) => {
              const isPageLink = section.href && !section.href.startsWith("#");
              const Comp = isPageLink ? Link : "a";
              return (
                <Comp
                  key={section.id}
                  href={section.href || `#${section.id}`}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <IconByName name={section.iconName} className="h-4 w-4" />
                    {section.label}
                  </span>
                  {section.count != null && section.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {section.count.toLocaleString()}
                    </Badge>
                  )}
                </Comp>
              );
            })}
          </nav>
          {/* Reset button — shown when entity has a resetHref */}
          {entity?.resetHref && (
            <div className="mt-3 border-t pt-3">
              <Link
                href={entity.resetHref}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
              >
                <X className="h-4 w-4" />
                Reset
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────────────── */}
      {entity && (
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: ENTITY_COLOR_MAP[entity.type] }}
          >
            Navigation
          </h3>
          <nav className="space-y-0.5">
            <Link
              href={`/${entity.type}s`}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
            <Link
              href={`/${entity.type}s`}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <FontAwesomeIcon
                icon={ENTITY_ICONS[ENTITY_ICON_MAP[entity.type]]}
                className="h-4 w-4"
                style={{ color: ENTITY_COLOR_MAP[entity.type] }}
              />
              All {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}s
            </Link>
          </nav>
        </div>
      )}

      {/* ── Recent Entities ──────────────────────────────────────── */}
      {recentEntities.length > 1 && (
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <h3 className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
            <Clock className="h-3 w-3" />
            Recent
          </h3>
          <nav className="space-y-0.5">
            {recentEntities.slice(0, 8).map((ent) => {
              const isCurrent =
                entity &&
                ent.type === entity.type &&
                String(ent.id) === String(entity.id);
              return (
                <Link
                  key={`${ent.type}:${ent.id}`}
                  href={ent.url}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isCurrent
                      ? "bg-accent font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-700 dark:hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={ENTITY_ICONS[ENTITY_ICON_MAP[ent.type]]}
                    className="h-3 w-3 shrink-0"
                    style={{ color: ENTITY_COLOR_MAP[ent.type] }}
                  />
                  <span className="truncate">{ent.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
