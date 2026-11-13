import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FileText, Settings2, List, History, BarChart3 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS } from "@/constants/entityIcons";
import { getFlow, fetchFlowRunCount, fetchFlowVersions } from "@/lib/api/flow";
import { FlowHeader } from "@/components/flow/flow-header";
import { FlowDescriptionSection } from "@/components/flow/flow-description-section";
import { FlowParametersSection } from "@/components/flow/flow-parameters-section";
import { FlowComponentsSection } from "@/components/flow/flow-components-section";
import { FlowDependenciesSection } from "@/components/flow/flow-dependencies-section";
import { FlowAnalysisSection } from "@/components/flow/flow-analysis-section";
import { FlowVersionsSection } from "@/components/flow/flow-versions-section";
import { FlowRunsList } from "@/components/flow/flow-runs-list";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { WorkspaceSetter } from "@/components/workspace/workspace-setter";
import { WorkspaceInlinePanel } from "@/components/workspace/workspace-inline-panel";
import { entityColors } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const flowId = parseInt(id, 10);

  if (isNaN(flowId)) {
    return {
      title: "Flow Not Found | OpenML",
    };
  }

  try {
    const flow = await getFlow(flowId);
    if (!flow) {
      return {
        title: "Flow Not Found | OpenML",
      };
    }

    return {
      title: `${flow.name} (Flow ${flow.flow_id}) | OpenML`,
      description: flow.description
        ? flow.description.replace(/<[^>]*>/g, "").substring(0, 160)
        : `Details for OpenML Flow ${flow.name}.`,
    };
  } catch (error) {
    return {
      title: "Error | OpenML",
    };
  }
}

export default async function FlowDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const flowId = parseInt(id, 10);
  if (isNaN(flowId)) {
    notFound();
  }

  // Fetch flow data
  const flow = await getFlow(flowId);
  if (!flow) {
    notFound();
  }

  // Parallel data fetching for other counts/sections
  const [runCount, versions] = await Promise.all([
    fetchFlowRunCount(flowId),
    fetchFlowVersions(flow.name),
  ]);

  const parametersCount = flow.parameter?.length || 0;
  const componentsCount = flow.components?.component?.length || 0;
  const versionsCount = versions.length;

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Push context to the persistent workspace panel */}
        <WorkspaceSetter
          entity={{
            type: "flow",
            id: flow.flow_id,
            title: flow.name,
            subtitle: `Flow #${flow.flow_id}`,
            url: `/flows/${flow.flow_id}`,
            color: entityColors.flow,
          }}
          sections={[
            { id: "description", label: "Description", iconName: "FileText" },
            ...(runCount > 0
              ? [{ id: "analysis", label: "Analyse", iconName: "BarChart3" }]
              : []),
            ...(flow.dependencies
              ? [
                  {
                    id: "dependencies",
                    label: "Dependencies",
                    iconName: "Layers",
                  },
                ]
              : []),
            ...(parametersCount > 0
              ? [
                  {
                    id: "parameters",
                    label: "Parameters",
                    iconName: "Settings2",
                    count: parametersCount,
                  },
                ]
              : []),
            ...(componentsCount > 0
              ? [
                  {
                    id: "components",
                    label: "Components",
                    iconName: "Layers",
                    count: componentsCount,
                  },
                ]
              : []),
            ...(versionsCount > 1
              ? [
                  {
                    id: "versions",
                    label: "Versions",
                    iconName: "ExternalLink",
                    count: versionsCount,
                  },
                ]
              : []),
            {
              id: "runs",
              label: "Runs",
              iconName: "ExternalLink",
              count: runCount,
            },
          ]}
          quickLinks={[
            {
              label: `Runs using this flow`,
              href: `/runs?flow_id=${flow.flow_id}`,
              iconName: "ExternalLink",
            },
          ]}
        />

        {/* Header: Full Width */}
        <FlowHeader flow={flow} runCount={runCount} />

        {/* Main Content + Inline Panel */}
        <div className="mt-6 flex gap-8">
          <div className="min-w-0 flex-1 space-y-6">
          {/* 1. Description Section */}
          <CollapsibleSection
            id="description"
            title="Description"
            description="Full description of this flow"
            icon={<FileText className="h-4 w-4 text-gray-500" />}
            defaultOpen={true}
          >
            <FlowDescriptionSection flow={flow} />
          </CollapsibleSection>

          {/* 1.2. Analysis Section */}
          {runCount > 0 && (
            <CollapsibleSection
              id="analysis"
              title="Analyse"
              description="Performance analysis across tasks"
              icon={<BarChart3 className="h-4 w-4 text-[#3b82f6]" />}
              defaultOpen={true}
            >
              <FlowAnalysisSection flow={flow} runCount={runCount} />
            </CollapsibleSection>
          )}

          {/* 1.5. Dependencies Section */}
          {flow.dependencies && (
            <CollapsibleSection
              id="dependencies"
              title="Dependencies"
              description="Libraries and requirements"
              icon={
                <FontAwesomeIcon
                  icon={ENTITY_ICONS.flow}
                  className="h-4 w-4 text-gray-500"
                />
              }
              defaultOpen={true}
            >
              <FlowDependenciesSection flow={flow} />
            </CollapsibleSection>
          )}

          {/* 2. Parameters Section */}
          {parametersCount > 0 && (
            <CollapsibleSection
              id="parameters"
              title="Parameters"
              description="Configuration parameters and default values"
              icon={<Settings2 className="h-4 w-4 text-gray-500" />}
              badge={parametersCount}
              defaultOpen={true}
            >
              <FlowParametersSection flow={flow} />
            </CollapsibleSection>
          )}

          {/* 3. Components Section */}
          {componentsCount > 0 && (
            <CollapsibleSection
              id="components"
              title="Components"
              description="Sub-flows and nested components"
              icon={
                <FontAwesomeIcon
                  icon={ENTITY_ICONS.flow}
                  className="h-4 w-4 text-gray-500"
                />
              }
              badge={componentsCount}
              defaultOpen={true}
            >
              <FlowComponentsSection flow={flow} />
            </CollapsibleSection>
          )}

          {/* 4. Versions Section */}
          {versionsCount > 1 && (
            <CollapsibleSection
              id="versions"
              title="Versions"
              description="Other versions of this flow"
              icon={<History className="h-4 w-4 text-gray-500" />}
              badge={versionsCount}
              defaultOpen={false}
            >
              <FlowVersionsSection currentFlowId={flowId} versions={versions} />
            </CollapsibleSection>
          )}

          {/* 5. Runs List */}
          <CollapsibleSection
            id="runs"
            title="Runs"
            description="Experiments performed using this flow"
            icon={<List className="h-4 w-4 text-gray-500" />}
            badge={runCount}
            defaultOpen={false}
          >
            <FlowRunsList flow={flow} runCount={runCount} />
          </CollapsibleSection>
          </div>
          <WorkspaceInlinePanel />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // 1 hour
