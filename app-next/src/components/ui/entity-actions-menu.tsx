"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Share2,
  Flag,
  Link2,
  Check,
  NotebookPen,
} from "lucide-react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaPython } from "react-icons/fa6";
import { SiR } from "react-icons/si";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportIssueDialog } from "@/components/ui/report-issue-dialog";
import { cn } from "@/lib/utils";

type EntityType = "task" | "flow" | "run" | "collection" | "benchmark" | "measure";

const entityRoutes: Record<EntityType, string> = {
  task: "tasks",
  flow: "flows",
  run: "runs",
  collection: "collections",
  benchmark: "benchmarks",
  measure: "measures",
};

interface EntityActionsMenuProps {
  entityType: EntityType;
  entityId: number | string;
  entityName: string;
  className?: string;
}

export function EntityActionsMenu({
  entityType,
  entityId,
  entityName,
  className,
}: EntityActionsMenuProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const entityUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${entityRoutes[entityType]}/${entityId}`
      : `https://www.openml.org/${entityRoutes[entityType]}/${entityId}`;

  const shareText = `Check out "${entityName}" on OpenML`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(entityUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(entityUrl);
    const encodedText = encodeURIComponent(shareText);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&via=open_ml`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const notebookEntityTypes = ["task", "flow", "run"] as const;
  const supportsNotebook = (notebookEntityTypes as readonly string[]).includes(entityType);

  const handleOpenNotebook = (platform: "python" | "r") => {
    const pythonApiCall: Record<string, string> = {
      task: `task = openml.tasks.get_task(${entityId})`,
      flow: `flow = openml.flows.get_flow(${entityId})`,
      run: `run = openml.runs.get_run(${entityId})`,
    };
    const rApiCall: Record<string, string> = {
      task: `entity <- getOMLTask(task.id = ${entityId})`,
      flow: `entity <- getOMLFlow(flow.id = ${entityId})`,
      run: `entity <- getOMLRun(run.id = ${entityId})`,
    };

    const cells =
      platform === "python"
        ? [
            {
              cell_type: "markdown",
              metadata: {},
              source: [
                `# OpenML ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}: ${entityName}\n`,
                `ID: **${entityId}** — loaded via the [OpenML Python API](https://github.com/openml/openml-python)`,
              ],
            },
            {
              cell_type: "code",
              execution_count: null,
              metadata: {},
              outputs: [],
              source: ["!pip install openml --quiet"],
            },
            {
              cell_type: "code",
              execution_count: null,
              metadata: {},
              outputs: [],
              source: [
                "import openml\n",
                "\n",
                `${pythonApiCall[entityType]}\n`,
                "print(entity)",
              ],
            },
          ]
        : [
            {
              cell_type: "markdown",
              metadata: {},
              source: [
                `# OpenML ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}: ${entityName}\n`,
                `ID: **${entityId}** — loaded via the [OpenML R package](https://cran.r-project.org/web/packages/OpenML/)`,
              ],
            },
            {
              cell_type: "code",
              execution_count: null,
              metadata: {},
              outputs: [],
              source: ['install.packages("OpenML")\n', "library(OpenML)"],
            },
            {
              cell_type: "code",
              execution_count: null,
              metadata: {},
              outputs: [],
              source: [`${rApiCall[entityType]}\n`, "print(entity)"],
            },
          ];

    const notebook = {
      nbformat: 4,
      nbformat_minor: 5,
      metadata:
        platform === "python"
          ? {
              kernelspec: {
                display_name: "Python 3",
                language: "python",
                name: "python3",
              },
              language_info: { name: "python", version: "3.9.0" },
            }
          : {
              kernelspec: {
                display_name: "R",
                language: "R",
                name: "ir",
              },
              language_info: { name: "R" },
            },
      cells,
    };

    const blob = new Blob([JSON.stringify(notebook, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `openml_${entityType}_${entityId}_${platform}.ipynb`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn("dark:border-slate-400", className)}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Share submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleShare("twitter")}
                  className="cursor-pointer"
                >
                  <FaXTwitter className="mr-2 h-4 w-4" />
                  <span>Twitter / X</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare("linkedin")}
                  className="cursor-pointer"
                >
                  <FaLinkedin className="mr-2 h-4 w-4" />
                  <span>LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare("facebook")}
                  className="cursor-pointer"
                >
                  <FaFacebook className="mr-2 h-4 w-4" />
                  <span>Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleCopyLink}
                  className="cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Notebook submenu — only for task, flow, run */}
          {supportsNotebook && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <NotebookPen className="mr-2 h-4 w-4" />
                  <span>Open in Notebook</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleOpenNotebook("python")}
                      className="cursor-pointer"
                    >
                      <FaPython className="mr-2 h-4 w-4" />
                      <span>Download Python Notebook</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenNotebook("r")}
                      className="cursor-pointer"
                    >
                      <SiR className="mr-2 h-4 w-4" />
                      <span>Download R Notebook</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}

          <DropdownMenuSeparator />

          {/* Report Issue */}
          <DropdownMenuItem
            onClick={() => setReportDialogOpen(true)}
            className="cursor-pointer text-red-600 dark:text-red-400"
          >
            <Flag className="mr-2 h-4 w-4" />
            <span>Report Issue</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportIssueDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        entityType={entityType}
        entityId={entityId}
        entityName={entityName}
      />
    </>
  );
}
