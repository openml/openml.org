import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";
import { WorkspaceContentWrapper } from "@/components/workspace/workspace-content-wrapper";

/**
 * Shared layout for all (explore) pages — datasets, tasks, flows, runs,
 * collections, benchmarks, measures.
 *
 * Provides the persistent three-panel workspace:
 *   LEFT NAV (global sidebar, from [locale]/layout) | MAIN CONTENT | CONTEXT PANEL
 *
 * The WorkspaceProvider keeps state across page navigations within the
 * route group (recent-entity history, active entity context).
 * Detail pages push their sections/quickLinks via <WorkspaceSetter />.
 * Listing pages don't set anything — the panel gracefully hides or shows
 * only the recent-entity trail.
 *
 * The panel uses fixed positioning so the page header remains full-width.
 * WorkspaceContentWrapper adds dynamic right margin to prevent content
 * from sliding under the panel.
 */
export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <WorkspaceContentWrapper>{children}</WorkspaceContentWrapper>
      <WorkspacePanel />
    </WorkspaceProvider>
  );
}
