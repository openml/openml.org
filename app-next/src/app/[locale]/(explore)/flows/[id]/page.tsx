import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  FileText,
  Settings2,
  List,
  Cog,
  History,
  BarChart3,
} from "lucide-react";
import { getFlow, fetchFlowRunCount, fetchFlowVersions } from "@/lib/api/flow";
import { FlowHeader } from "@/components/flow/flow-header";
import { FlowDescriptionSection } from "@/components/flow/flow-description-section";
import { FlowParametersSection } from "@/components/flow/flow-parameters-section";
import { FlowComponentsSection } from "@/components/flow/flow-components-section";
import { FlowDependenciesSection } from "@/components/flow/flow-dependencies-section";
import { FlowAnalysisSection } from "@/components/flow/flow-analysis-section";
import { FlowVersionsSection } from "@/components/flow/flow-versions-section";
import { FlowRunsList } from "@/components/flow/flow-runs-list";
import { FlowNavigationMenu } from "@/components/flow/flow-navigation-menu";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

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
        {/* Header: Full Width */}
        <FlowHeader flow={flow} runCount={runCount} />

        {/* Content with Sidebar - Below Header */}
        <div className="relative mt-6 flex min-h-screen gap-8">
          {/* Left: Main Content */}
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
                icon={<Cog className="h-4 w-4 text-gray-500" />}
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
                icon={<Cog className="h-4 w-4 text-gray-500" />}
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
                <FlowVersionsSection
                  currentFlowId={flowId}
                  versions={versions}
                />
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

          {/* Right: Navigation Menu - Responsive */}
          <FlowNavigationMenu
            runCount={runCount}
            parametersCount={parametersCount}
            componentsCount={componentsCount}
            versionsCount={versionsCount}
            hasDependencies={!!flow.dependencies}
          />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // 1 hour
