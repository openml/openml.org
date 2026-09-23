"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MoreHorizontal,
  FolderPlus,
  Bookmark,
  BookmarkCheck,
  Share2,
  NotebookPen,
  Flag,
  Link2,
  Check,
} from "lucide-react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaPython } from "react-icons/fa6";
import { SiR } from "react-icons/si";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportIssueDialog } from "@/components/ui/report-issue-dialog";
import { cn } from "@/lib/utils";

const BOOKMARK_KEY = "openml_bookmarks_datasets";

interface DatasetActionsMenuProps {
  datasetId: number;
  datasetName: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  className?: string;
}

/**
 * DatasetActionsMenu - 3-dot menu with additional actions
 *
 * Features:
 * - Add to collection
 * - Bookmark/Save
 * - Social share (Twitter, LinkedIn, Facebook, Copy link)
 * - Create notebook (Colab, kggl)
 * - Report issue
 */
export function DatasetActionsMenu({
  datasetId,
  datasetName,
  isBookmarked = false,
  onBookmarkToggle,
  className,
}: DatasetActionsMenuProps) {
  const { data: session } = useSession();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARK_KEY);
      const ids: number[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(datasetId)) setBookmarked(true);
    } catch {
      // localStorage unavailable
    }
  }, [datasetId]);

  const datasetUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/datasets/${datasetId}`
      : `https://www.openml.org/datasets/${datasetId}`;

  const shareText = `Check out "${datasetName}" on OpenML - a machine learning dataset repository`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(datasetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleBookmarkToggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    onBookmarkToggle?.();
    try {
      const stored = localStorage.getItem(BOOKMARK_KEY);
      const ids: number[] = stored ? JSON.parse(stored) : [];
      const updated = next
        ? [...new Set([...ids, datasetId])]
        : ids.filter((id) => id !== datasetId);
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(datasetUrl);
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

  const handleOpenNotebook = (platform: "python" | "r") => {
    const cells =
      platform === "python"
        ? [
            {
              cell_type: "markdown",
              metadata: {},
              source: [
                `# OpenML Dataset: ${datasetName}\n`,
                `Dataset ID: **${datasetId}** — loaded via the [OpenML Python API](https://github.com/openml/openml-python)`,
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
                `dataset = openml.datasets.get_dataset(${datasetId})\n`,
                'print(f"Dataset: {dataset.name}")\n',
                'print(f"Description: {(dataset.description or \"\")[:500]}")',
              ],
            },
            {
              cell_type: "code",
              execution_count: null,
              metadata: {},
              outputs: [],
              source: [
                "X, y, categorical_indicator, attribute_names = dataset.get_data(\n",
                "    target=dataset.default_target_attribute\n",
                ")\n",
                'print(f"Shape: {X.shape}")\n',
                "X.head()",
              ],
            },
          ]
        : [
            {
              cell_type: "markdown",
              metadata: {},
              source: [
                `# OpenML Dataset: ${datasetName}\n`,
                `Dataset ID: **${datasetId}** — loaded via the [OpenML R package](https://cran.r-project.org/web/packages/OpenML/)`,
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
              source: [
                `dataset <- getOMLDataSet(data.id = ${datasetId})\n`,
                "print(dataset$desc$name)\n",
                "head(dataset$data)",
              ],
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
    a.download = `openml_dataset_${datasetId}_${platform}.ipynb`;
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

          {/* Edit Dataset */}
          {/* <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/datasets/${datasetId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Dataset</span>
            </Link>
          </DropdownMenuItem> */}

          {/* Bookmark */}
          <DropdownMenuItem
            onClick={handleBookmarkToggle}
            className="cursor-pointer"
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Bookmark</span>
              </>
            )}
          </DropdownMenuItem>

          {/* Add to Collection */}
          <DropdownMenuItem
            onClick={() => setCollectionDialogOpen(true)}
            className="cursor-pointer"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>Add to Collection</span>
          </DropdownMenuItem>

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

          <DropdownMenuSeparator />

          {/* Notebook options */}
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

      {/* Add to Collection Dialog */}
      <Dialog
        open={collectionDialogOpen}
        onOpenChange={setCollectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              Add to Collection
            </DialogTitle>
            <DialogDescription>
              Add &quot;{datasetName}&quot; to one of your collections or create
              a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {session ? (
              <>
                <p className="text-muted-foreground text-sm">
                  Collections group machine learning tasks. Create a new
                  collection and add tasks from this dataset.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/collections/create">Create New Collection</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/collections">View My Collections</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-muted-foreground flex items-center justify-center rounded-lg border-2 border-dashed p-8 text-sm">
                  <p>Sign in to add datasets to your collections</p>
                </div>
                <div className="text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCollectionDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportIssueDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        entityType="dataset"
        entityId={datasetId}
        entityName={datasetName}
      />
    </>
  );
}
