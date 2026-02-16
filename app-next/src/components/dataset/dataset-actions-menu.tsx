"use client";

import * as React from "react";
import { useState } from "react";
import {
  MoreHorizontal,
  FolderPlus,
  Bookmark,
  BookmarkCheck,
  Share2,
  NotebookPen,
  Flag,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
  ExternalLink,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

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
    setBookmarked(!bookmarked);
    onBookmarkToggle?.();
    // TODO: Implement actual bookmark API call
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
    // Link to OpenML documentation examples
    const notebookUrls: Record<string, string> = {
      python:
        "https://docs.openml.org/examples/20_basic/simple_datasets_tutorial/",
      r: "https://docs.openml.org/r/",
    };

    window.open(notebookUrls[platform], "_blank");
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
                  <Twitter className="mr-2 h-4 w-4" />
                  <span>Twitter / X</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare("linkedin")}
                  className="cursor-pointer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  <span>LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare("facebook")}
                  className="cursor-pointer"
                >
                  <Facebook className="mr-2 h-4 w-4" />
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
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Python Tutorial</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenNotebook("r")}
                  className="cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>R Tutorial</span>
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

          {/* TODO: Fetch user's collections and display them here */}
          <div className="space-y-4 py-4">
            <div className="text-muted-foreground flex items-center justify-center rounded-lg border-2 border-dashed p-8 text-sm">
              <p>Sign in to add datasets to your collections</p>
            </div>

            <div className="text-center">
              <Button variant="outline" size="sm">
                Create New Collection
              </Button>
            </div>
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

      {/* Report Issue Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Flag className="h-5 w-5" />
              Report an Issue
            </DialogTitle>
            <DialogDescription>
              Help us improve OpenML by reporting issues with this dataset.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <select
                id="issue-type"
                className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Select an issue type...</option>
                <option value="incorrect-data">
                  Incorrect or corrupt data
                </option>
                <option value="missing-metadata">
                  Missing or wrong metadata
                </option>
                <option value="duplicate">Duplicate dataset</option>
                <option value="license">License violation</option>
                <option value="privacy">Privacy concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-description">Description</Label>
              <Textarea
                id="issue-description"
                placeholder="Please describe the issue in detail..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-email">Your Email (optional)</Label>
              <Input
                id="issue-email"
                type="email"
                placeholder="email@example.com"
              />
              <p className="text-muted-foreground text-xs">
                We&apos;ll use this to follow up if needed
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: Implement report submission
                setReportDialogOpen(false);
              }}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
