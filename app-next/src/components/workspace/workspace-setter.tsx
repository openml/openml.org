"use client";

import { useEffect } from "react";
import {
  useWorkspace,
  type WorkspaceEntity,
  type WorkspaceSection,
  type WorkspaceQuickLink,
  type WorkspaceAction,
} from "@/contexts/workspace-context";

interface WorkspaceSetterProps {
  entity?: WorkspaceEntity | null;
  sections?: WorkspaceSection[];
  quickLinks?: WorkspaceQuickLink[];
  actions?: WorkspaceAction[];
}

/**
 * Invisible client component that pushes workspace data from a Server
 * Component page into the shared WorkspaceContext.
 *
 * Usage in a Server Component page:
 * ```tsx
 * <WorkspaceSetter
 *   entity={{ type: 'run', id: 123, title: 'Run #123', url: '/runs/123', color: '#e11d48' }}
 *   sections={[{ id: 'metrics', label: 'Metrics', iconName: 'BarChart3', count: 42 }]}
 * />
 * ```
 */
export function WorkspaceSetter({
  entity = null,
  sections = [],
  quickLinks = [],
  actions = [],
}: WorkspaceSetterProps) {
  const { setWorkspace, clearWorkspace } = useWorkspace();

  useEffect(() => {
    setWorkspace({ entity, sections, quickLinks, actions });
    return () => {
      clearWorkspace();
    };
    // Stringify for stable deps — avoids infinite loop from object identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(entity),
    JSON.stringify(sections),
    JSON.stringify(quickLinks),
    JSON.stringify(actions),
  ]);

  return null; // Renders nothing
}
