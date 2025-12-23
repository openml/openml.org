"use client";

import { useState } from "react";
import {
  Database,
  BarChart3,
  ListTodo,
  Play,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Dataset } from "@/types/dataset";
import { DatasetMetadataGrid } from "./dataset-metadata-grid";
import { ExpandableFeatureTable } from "./expandable-feature-table";
import { QualityTable } from "./quality-table";

interface DatasetTabsProps {
  dataset: Dataset;
  taskCount?: number;
  runCount?: number;
}

/**
 * DatasetTabs - Kaggle-style tabbed interface for dataset details
 *
 * Tabs:
 * 1. Data Detail - Features, qualities, metadata
 * 2. Analysis - Visualizations (TODO)
 * 3. Tasks - Related tasks
 * 4. Runs - ML runs on this dataset
 * 5. Discussion - Comments (TODO)
 */
export function DatasetTabs({
  dataset,
  taskCount = 0,
  runCount = 0,
}: DatasetTabsProps) {
  const [citationExpanded, setCitationExpanded] = useState(false);

  return (
    <Tabs defaultValue="detail" className="w-full">
      {/* Tab Navigation */}
      <div className="border-b">
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="detail"
            className="data-[state=active]:border-primary border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Database className="mr-2 h-4 w-4" />
            Data Detail
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:border-primary border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:border-primary border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Tasks
            {taskCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {taskCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="runs"
            className="data-[state=active]:border-primary border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Play className="mr-2 h-4 w-4" />
            Runs
            {runCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {runCount.toLocaleString()}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Data Detail Tab */}
        <TabsContent value="detail" className="space-y-6">
          {/* Dataset Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                  <Info className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Dataset Information</CardTitle>
                  <CardDescription>
                    Technical details and metadata
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DatasetMetadataGrid dataset={dataset} />
            </CardContent>
          </Card>

          {/* Features Table */}
          {dataset.features && dataset.features.length > 0 && (
            <ExpandableFeatureTable features={dataset.features} />
          )}

          {/* Qualities Table */}
          {dataset.qualities && Object.keys(dataset.qualities).length > 0 && (
            <QualityTable qualities={dataset.qualities} />
          )}

          {/* Citation */}
          {dataset.citation && (
            <Collapsible
              open={citationExpanded}
              onOpenChange={setCitationExpanded}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between text-left">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                          <FileText className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <CardTitle>Citation</CardTitle>
                          <CardDescription>
                            How to cite this dataset in academic work
                          </CardDescription>
                        </div>
                      </div>
                      {citationExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {dataset.citation}
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() =>
                        navigator.clipboard.writeText(dataset.citation || "")
                      }
                    >
                      Copy Citation
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Data Visualizations
              </CardTitle>
              <CardDescription>
                Visual exploration of the dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Placeholder for visualizations */}
                <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <BarChart3 className="text-muted-foreground mx-auto h-12 w-12" />
                    <p className="text-muted-foreground mt-4 text-lg font-medium">
                      Visualizations Coming Soon
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Feature distributions, correlations, and data quality
                      metrics will be displayed here.
                    </p>
                  </div>
                </div>

                {/* Quick Stats Preview */}
                <div className="grid gap-4 md:grid-cols-3">
                  <QuickStatCard
                    title="Class Balance"
                    description="Distribution of target classes"
                    value={
                      dataset.qualities?.MajorityClassPercentage
                        ? `${dataset.qualities.MajorityClassPercentage.toFixed(1)}% majority`
                        : "N/A"
                    }
                  />
                  <QuickStatCard
                    title="Missing Values"
                    description="Data completeness"
                    value={
                      dataset.qualities?.PercentageOfMissingValues
                        ? `${dataset.qualities.PercentageOfMissingValues.toFixed(2)}%`
                        : "0%"
                    }
                  />
                  <QuickStatCard
                    title="Dimensionality"
                    description="Features per instance"
                    value={
                      dataset.qualities?.Dimensionality
                        ? dataset.qualities.Dimensionality.toFixed(4)
                        : "N/A"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Related Tasks
                <Badge variant="secondary">{taskCount}</Badge>
              </CardTitle>
              <CardDescription>
                Machine learning tasks defined on this dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              {taskCount > 0 ? (
                <div className="space-y-4">
                  {/* TODO: Fetch and display actual tasks */}
                  <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                    <ListTodo className="mx-auto h-8 w-8" />
                    <p className="mt-2">
                      {taskCount} task{taskCount !== 1 ? "s" : ""} available on
                      this dataset
                    </p>
                    <Button variant="link" className="mt-2" asChild>
                      <a
                        href={`/search?type=task&dataset=${dataset.data_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View all tasks →
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                  <ListTodo className="mx-auto h-8 w-8" />
                  <p className="mt-2">No tasks have been defined yet</p>
                  <Button variant="outline" className="mt-4">
                    Create a Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Runs Tab */}
        <TabsContent value="runs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                ML Runs
                <Badge variant="secondary">{runCount.toLocaleString()}</Badge>
              </CardTitle>
              <CardDescription>
                Machine learning experiments on this dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              {runCount > 0 ? (
                <div className="space-y-4">
                  {/* TODO: Fetch and display runs with better visualizations */}
                  <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                    <Play className="mx-auto h-8 w-8" />
                    <p className="mt-2">
                      {runCount.toLocaleString()} run
                      {runCount !== 1 ? "s" : ""} recorded on this dataset
                    </p>
                    <Button variant="link" className="mt-2" asChild>
                      <a
                        href={`/search?type=run&dataset=${dataset.data_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View all runs →
                      </a>
                    </Button>
                  </div>

                  {/* Performance Summary Placeholder */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Best Accuracy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          Leaderboard coming soon...
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-base">Top Flows</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          Best performing algorithms...
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                  <Play className="mx-auto h-8 w-8" />
                  <p className="mt-2">No runs have been recorded yet</p>
                  <Button variant="outline" className="mt-4">
                    Run an Experiment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}

function QuickStatCard({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
