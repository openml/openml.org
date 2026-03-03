"use client";

import { useWorkspace } from "@/contexts/workspace-context";
import { cn } from "@/lib/utils";

/**
 * Wraps page content with dynamic right margin that matches the
 * fixed-position workspace panel width. This ensures the header
 * stays full-width while content doesn't slide under the panel.
 */
export function WorkspaceContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { entity, sections, recentEntities, isPanelCollapsed } = useWorkspace();

  const hasPanelContent =
    entity !== null || sections.length > 0 || recentEntities.length > 0;

  return (
    <div
      className={cn(
        "min-w-0 transition-[margin] duration-300",
        hasPanelContent && !isPanelCollapsed && "xl:mr-72",
        hasPanelContent && isPanelCollapsed && "xl:mr-12",
      )}
    >
      {children}
    </div>
  );
}
