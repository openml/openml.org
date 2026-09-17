"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ReportIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityId: number | string;
  entityName: string;
}

const ISSUE_TYPES = [
  { value: "incorrect-data", label: "Incorrect or corrupt data" },
  { value: "missing-metadata", label: "Missing or wrong metadata" },
  { value: "duplicate", label: "Duplicate entry" },
  { value: "license", label: "License violation" },
  { value: "privacy", label: "Privacy concern" },
  { value: "other", label: "Other" },
];

export function ReportIssueDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  entityName,
}: ReportIssueDialogProps) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const typeLabel =
      ISSUE_TYPES.find((t) => t.value === issueType)?.label ?? issueType;
    const title = encodeURIComponent(
      `[Report] ${entityType} #${entityId}: ${typeLabel || "Issue"}`,
    );
    const body = encodeURIComponent(
      [
        `**Entity:** ${entityType} — [${entityName}](https://www.openml.org/${entityType}s/${entityId}) (ID: ${entityId})`,
        `**Issue type:** ${typeLabel || "—"}`,
        `**Description:**\n${description || "—"}`,
        email ? `**Contact:** ${email}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    );

    window.open(
      `https://github.com/openml/OpenML/issues/new?title=${title}&body=${body}&labels=data-issue`,
      "_blank",
    );

    setIssueType("");
    setDescription("");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Flag className="h-5 w-5" />
            Report an Issue
          </DialogTitle>
          <DialogDescription>
            Help us improve OpenML by reporting issues with this {entityType}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type</Label>
            <select
              id="issue-type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select an issue type...</option>
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-description">Description</Label>
            <Textarea
              id="issue-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-email">Your Email (optional)</Label>
            <Input
              id="issue-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
            <p className="text-muted-foreground text-xs">
              We&apos;ll use this to follow up if needed
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
