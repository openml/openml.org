"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DatasetEditFormProps {
  datasetId: number;
  datasetName: string;
  isOwner: boolean;
  hasApiKey: boolean;
  isLocalUser: boolean;
  initialValues: {
    description: string;
    creator: string;
    collection_date: string;
    citation: string;
    language: string;
    original_data_url: string;
    paper_url: string;
    default_target_attribute: string;
    ignore_attribute: string;
    row_id_attribute: string;
  };
  features: string[];
}

export function DatasetEditForm({
  datasetId,
  datasetName,
  isOwner,
  hasApiKey,
  isLocalUser,
  initialValues,
  features,
}: DatasetEditFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { toast } = useToast();
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    field: keyof typeof values,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/datasets/${datasetId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          isOwner,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to save (${res.status})`);
      }

      toast({
        title: "Changes saved",
        description: "Redirecting back to dataset...",
      });

      setTimeout(() => {
        router.push(`/${locale}/datasets/${datasetId}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      toast({
        title: "Failed to save",
        description: err instanceof Error ? err.message : "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}/datasets/${datasetId}`}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dataset
        </Link>
        <h1 className="text-2xl font-bold">Edit Dataset</h1>
        <p className="text-muted-foreground">
          {datasetName}{" "}
          <span className="text-xs">#{datasetId}</span>
        </p>
      </div>

      {/* Warning: user has no valid OpenML API key (e.g. local dev account) */}
      {(!hasApiKey || isLocalUser) && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Saving is unavailable in this environment</p>
            <p className="text-xs">
              {isLocalUser
                ? "This account was created locally and does not have a valid OpenML API key. Dataset edits cannot be saved to the OpenML backend in a local development environment."
                : "Your session does not include an OpenML API key. Saving changes requires signing in with a valid OpenML account."}
            </p>
          </div>
        </div>
      )}

      {/* General metadata */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={8}
              placeholder="Describe the dataset..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="creator">Creator</Label>
              <Input
                id="creator"
                value={values.creator}
                onChange={(e) => handleChange("creator", e.target.value)}
                placeholder="Original creator"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={values.language}
                onChange={(e) => handleChange("language", e.target.value)}
                placeholder="e.g. English"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection_date">Collection Date</Label>
            <Input
              id="collection_date"
              value={values.collection_date}
              onChange={(e) =>
                handleChange("collection_date", e.target.value)
              }
              placeholder="e.g. 2023"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="citation">Citation</Label>
            <Textarea
              id="citation"
              value={values.citation}
              onChange={(e) => handleChange("citation", e.target.value)}
              rows={3}
              placeholder="How to cite this dataset"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original_data_url">Original Data URL</Label>
            <Input
              id="original_data_url"
              type="url"
              value={values.original_data_url}
              onChange={(e) =>
                handleChange("original_data_url", e.target.value)
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paper_url">Paper URL</Label>
            <Input
              id="paper_url"
              type="url"
              value={values.paper_url}
              onChange={(e) => handleChange("paper_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Owner-only: Attribute settings */}
      {isOwner && (
        <Card className="mb-6 border-amber-200 dark:border-amber-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Attribute Settings (Owner Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Changing these attributes may affect tasks and runs associated with
              this dataset.
            </p>

            <div className="space-y-2">
              <Label htmlFor="default_target_attribute">
                Default Target Attribute
              </Label>
              <select
                id="default_target_attribute"
                value={values.default_target_attribute}
                onChange={(e) =>
                  handleChange("default_target_attribute", e.target.value)
                }
                className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {features.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ignore_attribute">Ignore Attribute</Label>
              <Input
                id="ignore_attribute"
                value={values.ignore_attribute}
                onChange={(e) =>
                  handleChange("ignore_attribute", e.target.value)
                }
                placeholder="Comma-separated feature names to ignore"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="row_id_attribute">Row ID Attribute</Label>
              <select
                id="row_id_attribute"
                value={values.row_id_attribute}
                onChange={(e) =>
                  handleChange("row_id_attribute", e.target.value)
                }
                className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {features.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/datasets/${datasetId}`}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={saving || !hasApiKey || isLocalUser} className="gap-2" title={(!hasApiKey || isLocalUser) ? "Saving is not available in this environment" : undefined}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
