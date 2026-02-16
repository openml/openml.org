"use client";

import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OutputFile {
  name: string;
  file_id?: number;
  url?: string;
}

interface RunOutputFilesSectionProps {
  runId: number;
  outputFiles?: OutputFile[];
}

export function RunOutputFilesSection({
  runId,
  outputFiles,
}: RunOutputFilesSectionProps) {
  const apiUrl =
    process.env.NEXT_PUBLIC_URL_API || "https://www.openml.org/api/v1";

  // Default output files for runs
  const defaultFiles = [
    {
      name: "description",
      label: "Description",
      format: "xml",
      url: `${apiUrl}/run/${runId}`,
      icon: FileText,
    },
    {
      name: "predictions",
      label: "Predictions",
      format: "arff",
      url: `https://www.openml.org/data/downloadRunPredictions/${runId}`,
      icon: FileSpreadsheet,
    },
  ];

  // Merge with any additional output files from API
  const allFiles = [
    ...defaultFiles,
    ...(outputFiles || []).map((f) => ({
      name: f.name,
      label: f.name,
      format: f.url?.split(".").pop() || "file",
      url:
        f.url || `https://www.openml.org/data/download/${f.file_id}/${f.name}`,
      icon: FileText,
    })),
  ];

  return (
    <div className="p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Output Files
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {allFiles.map((file) => (
            <DropdownMenuItem key={file.name} asChild>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-2"
              >
                <file.icon className="text-muted-foreground h-4 w-4" />
                <span className="flex-1">{file.label}</span>
                <span className="text-muted-foreground text-xs uppercase">
                  {file.format}
                </span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <p className="text-muted-foreground mt-3 text-sm">
        Download the run description (XML) or prediction results (ARFF format).
      </p>
    </div>
  );
}
