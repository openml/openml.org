"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskDefinitionSection } from "./task-definition-section";
import { TaskAnalysisSection } from "./task-analysis-section";
import { TaskRunsList } from "./task-runs-list";
import type { Task } from "@/types/task";

interface TaskDetailTabsProps {
  task: Task;
  runCount: number;
}

/**
 * TaskDetailTabs Component
 *
 * Tab-based navigation matching the original OpenML design:
 * - Task Detail: Configuration, dataset info, metadata
 * - Analysis: Evaluation chart with metric selector
 * - Runs: Paginated list of runs
 */
export function TaskDetailTabs({ task, runCount }: TaskDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("detail");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Tab Navigation - OpenML style */}
      <TabsList className="mb-6 h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="detail"
          className="relative rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-orange-600 transition-colors data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-600 data-[state=active]:shadow-none"
        >
          Task Detail
        </TabsTrigger>
        <TabsTrigger
          value="analysis"
          className="relative rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-orange-600 transition-colors data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-600 data-[state=active]:shadow-none"
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger
          value="runs"
          className="relative rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-orange-600 transition-colors data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-600 data-[state=active]:shadow-none"
        >
          Runs
        </TabsTrigger>
      </TabsList>

      {/* Task Detail Tab */}
      <TabsContent value="detail" className="mt-0 space-y-6">
        <TaskDefinitionSection task={task} />
      </TabsContent>

      {/* Analysis Tab */}
      <TabsContent value="analysis" className="mt-0">
        <TaskAnalysisSection task={task} runCount={runCount} />
      </TabsContent>

      {/* Runs Tab */}
      <TabsContent value="runs" className="mt-0">
        <TaskRunsList task={task} runCount={runCount} />
      </TabsContent>
    </Tabs>
  );
}
