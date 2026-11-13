import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/contexts/workspace-context";

/**
 * Shared layout for all (explore) pages.
 *
 * WorkspaceProvider keeps recent-entity history and active entity context
 * across navigations. Each detail page renders its own WorkspaceInlinePanel
 * (sticky, inside a flex layout after the entity header).
 */
export default function ExploreLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
