"use client";

import * as React from "react";
import {
  Download,
  FileJson,
  FileCode,
  Croissant,
  Edit,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DatasetDownloadMenuProps {
  datasetId: number;
  datasetName: string;
  datasetUrl: string;
  className?: string;
}

/**
 * DatasetDownloadMenu - Download dropdown with multiple format options
 *
 * Options:
 * - Edit (link to edit page)
 * - Download dataset file
 * - JSON API
 * - XML API
 * - Croissant metadata
 */
export function DatasetDownloadMenu({
  datasetId,
  datasetName: _datasetName,
  datasetUrl,
  className,
}: DatasetDownloadMenuProps) {
  const jsonUrl = `https://www.openml.org/api/v1/json/data/${datasetId}`;
  const xmlUrl = `https://www.openml.org/api/v1/data/${datasetId}`;
  const croissantUrl = `https://www.openml.org/croissant/dataset/${datasetId}`;
  const editUrl = `/datasets/${datasetId}/edit`;

  const handleCroissantDownload = () => {
    const link = document.createElement("a");
    link.href = croissantUrl;
    link.download = `dataset_${datasetId}_croissant.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="openml"
          className={cn(
            "border-accent gap-2 bg-slate-600 text-white",
            className,
          )}
        >
          <Download className="h-4 w-4" />
          Download
          <ChevronDown className="h-4 w-4 opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {/* <DropdownMenuLabel>Download & Export</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}

        {/* Edit */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href={editUrl}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Dataset</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Download Dataset File */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href={datasetUrl} download>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Data File</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          API Formats
        </DropdownMenuLabel>

        {/* JSON */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href={jsonUrl} target="_blank" rel="noopener noreferrer">
            <FileJson className="mr-2 h-4 w-4" />
            <span>JSON</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </a>
        </DropdownMenuItem>

        {/* XML */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href={xmlUrl} target="_blank" rel="noopener noreferrer">
            <FileCode className="mr-2 h-4 w-4" />
            <span>XML</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </a>
        </DropdownMenuItem>

        {/* Croissant */}
        <DropdownMenuItem
          onClick={handleCroissantDownload}
          className="cursor-pointer"
        >
          <Croissant className="mr-2 h-4 w-4" />
          <span>Croissant</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
