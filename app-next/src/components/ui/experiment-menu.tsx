"use client";

import { useState } from "react";
import {
  Play,
  ChevronDown,
  Trophy,
  Code,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExperimentMenuProps {
  entityType: "dataset" | "task" | "flow";
  entityId: number;
  entityName: string;
  taskCount?: number; // Only for datasets
  taskId?: number; // Only for tasks
}

export function ExperimentMenu({
  entityType,
  entityId,
  entityName,
  taskCount = 0,
  taskId,
}: ExperimentMenuProps) {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  // Generate code snippets based on entity type
  const getPythonCode = () => {
    if (entityType === "task") {
      return `import openml
from sklearn.ensemble import RandomForestClassifier

# Get task: ${entityName}
task = openml.tasks.get_task(${taskId || entityId})

# Define your model
model = RandomForestClassifier(n_estimators=100)

# Run experiment
run = openml.runs.run_model_on_task(task, model)

# Publish results to OpenML (requires API key)
# run.publish()

print(f"Run completed! Accuracy: {run.get_metric_fn(sklearn.metrics.accuracy_score)}")`;
    }

    if (entityType === "dataset") {
      return `import openml
from sklearn.ensemble import RandomForestClassifier

# Get dataset: ${entityName}
dataset = openml.datasets.get_dataset(${entityId})

# List available tasks for this dataset
tasks = openml.tasks.list_tasks(data_id=${entityId}, output_format="dataframe")
print(f"Found {len(tasks)} tasks for this dataset")

# Get a specific task (e.g., first classification task)
task_id = tasks[tasks['task_type'] == 'Supervised Classification'].iloc[0]['tid']
task = openml.tasks.get_task(task_id)

# Define your model
model = RandomForestClassifier(n_estimators=100)

# Run experiment
run = openml.runs.run_model_on_task(task, model)

# Publish results to OpenML (requires API key)
# run.publish()`;
    }

    // Flow
    return `import openml

# Get flow: ${entityName}
flow = openml.flows.get_flow(${entityId})

# To run this flow, you need a task
# task = openml.tasks.get_task(TASK_ID)
# run = openml.runs.run_flow_on_task(task, flow)`;
  };

  const getRCode = () => {
    if (entityType === "task") {
      return `library(OpenML)
library(mlr3)

# Get task: ${entityName}
task <- getOMLTask(${taskId || entityId})

# Create learner
learner <- lrn("classif.ranger")

# Run experiment
run <- runTaskMlr(task, learner)

# Upload to OpenML (requires API key)
# uploadOMLRun(run)`;
    }

    if (entityType === "dataset") {
      return `library(OpenML)
library(mlr3)

# Get dataset: ${entityName}
dataset <- getOMLDataSet(${entityId})

# List tasks for this dataset
tasks <- listOMLTasks(data.id = ${entityId})
print(paste("Found", nrow(tasks), "tasks"))

# Get a specific task
task <- getOMLTask(tasks$task.id[1])

# Create learner
learner <- lrn("classif.ranger")

# Run experiment
run <- runTaskMlr(task, learner)

# Upload to OpenML (requires API key)
# uploadOMLRun(run)`;
    }

    // Flow
    return `library(OpenML)

# Get flow: ${entityName}
flow <- getOMLFlow(${entityId})

# To run this flow, you need a task
# task <- getOMLTask(TASK_ID)`;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 dark:border-slate-400">
            <Play className="h-4 w-4" />
            Run Experiment
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {entityType === "dataset" && (
            <>
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                Experiments run on Tasks
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // Find and expand the tasks section
                  const tasksSection = document.getElementById("tasks");
                  if (tasksSection) {
                    // Find the collapsible trigger button and click to expand
                    const trigger = tasksSection.querySelector(
                      "button[data-state='closed']",
                    );
                    if (trigger) {
                      (trigger as HTMLButtonElement).click();
                    }
                    // Scroll to the section
                    tasksSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="cursor-pointer"
              >
                <Trophy className="mr-2 h-4 w-4 text-orange-500" />
                View Tasks ({taskCount})
              </DropdownMenuItem>
              {taskCount === 0 && (
                <DropdownMenuItem asChild>
                  <a
                    href="https://docs.openml.org/tasks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Create a Task
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            Code Examples
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setShowCodeDialog(true)}
            className="cursor-pointer"
          >
            <Code className="mr-2 h-4 w-4" />
            Show Code Snippets
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <a
              href="https://docs.openml.org/examples/20_basic/simple_flows_and_runs_tutorial/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Python Documentation
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href="https://docs.openml.org/r/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />R Documentation
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Code Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Run Experiment on {entityName}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="python" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="r">R</TabsTrigger>
            </TabsList>

            <TabsContent value="python" className="mt-4">
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100 dark:bg-slate-800">
                  <code>{getPythonCode()}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getPythonCode(), "python")}
                >
                  {copiedTab === "python" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Install:{" "}
                <code className="bg-muted rounded px-1">
                  pip install openml scikit-learn
                </code>
              </p>
            </TabsContent>

            <TabsContent value="r" className="mt-4">
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100 dark:bg-slate-800">
                  <code>{getRCode()}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getRCode(), "r")}
                >
                  {copiedTab === "r" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Install:{" "}
                <code className="bg-muted rounded px-1">
                  install.packages(&quot;OpenML&quot;)
                </code>
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
