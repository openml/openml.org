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

  const handleOpenNotebook = (platform: "colab" | "kggl") => {
    // TODO: Generate notebook URL based on platform
    const notebookUrls: Record<string, string> = {
      colab: `https://colab.research.google.com/github/openml/openml-colab/blob/main/notebooks/openml_dataset_template.ipynb?datasetId=${datasetId}`,
      kggl: `https://www.kggl.com/code?scriptUrl=https://raw.githubusercontent.com/openml/openml-python/main/notebooks/dataset_template.py&datasetId=${datasetId}`,
    };

    window.open(notebookUrls[platform], "_blank");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className={cn(className)}>
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
                  onClick={() => handleOpenNotebook("colab")}
                  className="cursor-pointer"
                >
                  <ColabIcon className="mr-2 h-4 w-4" />
                  <span>Google Colab</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenNotebook("kggl")}
                  className="cursor-pointer"
                >
                  <KaggleIcon className="mr-2 h-4 w-4" />
                  <span>Kaggle Notebook</span>
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

// Platform icons
function ColabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.941 4.976a7.033 7.033 0 00-4.942 2.047 7.033 7.033 0 00-.873 8.876c.02-.073.037-.146.06-.218l.029-.092a.5.5 0 01.964.261l-.03.093c-.093.345-.175.694-.245 1.046a7.033 7.033 0 005.037-4.083c-.215.026-.43.041-.645.044l-.105.002a.5.5 0 01-.023-1l.106-.001c.367-.003.732-.039 1.093-.107a7.033 7.033 0 00-.426-6.868z" />
      <path d="M4.353 12.002a7.033 7.033 0 003.707 6.2 7.033 7.033 0 008.14-.987c-.055-.033-.11-.063-.166-.092l-.086-.044a.5.5 0 01.45-.893l.086.045c.303.157.6.328.888.512a7.033 7.033 0 00-.95-6.234c-.008.22-.028.44-.061.66l-.017.104a.5.5 0 01-.988-.164l.017-.105c.05-.3.082-.602.094-.906a7.033 7.033 0 00-4.952 1.858c.068.046.136.095.203.145l.08.06a.5.5 0 01-.603.797l-.08-.06a10.06 10.06 0 00-.897-.614 7.033 7.033 0 00-4.884.718z" />
    </svg>
  );
}

function KaggleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.339" />
    </svg>
  );
}
