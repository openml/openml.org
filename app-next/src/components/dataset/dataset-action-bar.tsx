"use client";

import { Download, Code, FileJson, Edit, Croissant } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Dataset } from "@/types/dataset";

interface DatasetActionBarProps {
  dataset: Dataset;
  isLoggedIn?: boolean;
}

/**
 * DatasetActionBar Component
 *
 * Provides action buttons for downloading, accessing APIs, and editing.
 * This is a Client Component for interactivity.
 */
export function DatasetActionBar({
  dataset,
  isLoggedIn = false,
}: DatasetActionBarProps) {
  const croissantUrl = `https://www.openml.org/croissant/dataset/${dataset.data_id}`;
  const xmlUrl = `https://www.openml.org/api/v1/data/${dataset.data_id}`;
  const jsonUrl = `https://www.openml.org/api/v1/json/data/${dataset.data_id}`;
  const editUrl = isLoggedIn
    ? `/auth/data-edit?id=${dataset.data_id}`
    : "/auth/sign-in";

  const actions = [
    {
      label: "Croissant Metadata",
      description: "Download dataset metadata in Croissant format",
      icon: Croissant,
      href: croissantUrl,
      variant: "default" as const,
    },
    {
      label: "XML",
      description: "Access dataset metadata via XML API",
      icon: Code,
      href: xmlUrl,
      variant: "outline" as const,
    },
    {
      label: "JSON",
      description: "Access dataset metadata via JSON API",
      icon: FileJson,
      href: jsonUrl,
      variant: "outline" as const,
    },
    {
      label: "Download Data",
      description: "Download the dataset file",
      icon: Download,
      href: dataset.url,
      variant: "outline" as const,
    },
    {
      label: "Edit",
      description: isLoggedIn
        ? "Edit dataset metadata"
        : "Sign in to edit dataset",
      icon: Edit,
      href: editUrl,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-16 z-10 -mx-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground mr-2 text-sm font-medium">
            Actions:
          </span>
          {actions.map((action) => (
            <Tooltip key={action.label}>
              <TooltipTrigger asChild>
                <Button
                  variant={action.variant}
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <a
                    href={action.href}
                    target={action.label === "Edit" ? undefined : "_blank"}
                    rel={
                      action.label === "Edit"
                        ? undefined
                        : "noopener noreferrer"
                    }
                  >
                    <action.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
