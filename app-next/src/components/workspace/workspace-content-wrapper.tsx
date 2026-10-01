"use client";

import { usePathname } from "next/navigation";
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
  const { entity, isPanelCollapsed } = useWorkspace();
  const pathname = usePathname();

  // Mirror the same visibility logic as WorkspacePanel so margin is removed
  // immediately when pathname changes (before async clearWorkspace fires).
  const normalizedPath = (pathname ?? "").replace(/^\/[a-z]{2}(\/|$)/, "/");
  const entityBasePath = entity?.url.split("?")[0] ?? null;
  const hasPanelContent =
    entity !== null &&
    entityBasePath !== null &&
    normalizedPath.startsWith(entityBasePath);

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
