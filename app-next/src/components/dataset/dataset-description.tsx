"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, ChevronDown, ChevronUp } from "lucide-react";
import type { Dataset } from "@/types/dataset";
import ReactMarkdown from "react-markdown";

interface DatasetDescriptionProps {
  dataset?: Dataset;
  description?: string;
  maxLines?: number;
}

/**
 * DatasetDescription Component
 *
 * Displays the dataset description with markdown rendering.
 * Collapsible with configurable max lines (default 5).
 */
export function DatasetDescription({
  dataset,
  description: directDescription,
  maxLines = 5,
}: DatasetDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const descriptionText = directDescription || dataset?.description || "";

  // Check if content exceeds maxLines
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(contentRef.current).lineHeight,
      );
      const maxHeight = lineHeight * maxLines;
      setNeedsExpand(contentRef.current.scrollHeight > maxHeight);
    }
  }, [descriptionText, maxLines]);

  // If called with dataset prop (legacy), render full card layout
  if (dataset) {
    return (
      <div className="space-y-6">
        {/* Description Card */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{dataset.description}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Citation (if available) */}
        {dataset.citation && (
          <Card>
            <CardHeader>
              <CardTitle>Citation</CardTitle>
              <CardDescription>
                How to cite this dataset in academic work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <p className="font-mono text-sm">{dataset.citation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information - only show when there's content */}
        {(dataset.paper_url || dataset.original_data_url) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataset.paper_url && (
                <div>
                  <p className="text-sm font-medium">Paper URL</p>
                  <a
                    href={dataset.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {dataset.paper_url}
                  </a>
                </div>
              )}
              {dataset.original_data_url && (
                <div>
                  <p className="text-sm font-medium">Original Data URL</p>
                  <a
                    href={dataset.original_data_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {dataset.original_data_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // New collapsible description with just the description prop
  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={contentRef}
          className={`prose prose-sm dark:prose-invert max-w-none overflow-hidden transition-all duration-300 ${
            !isExpanded && needsExpand ? "line-clamp-5" : ""
          }`}
          style={{
            maxHeight:
              isExpanded || !needsExpand ? "none" : `calc(${maxLines} * 1.5em)`,
          }}
        >
          <ReactMarkdown>{descriptionText}</ReactMarkdown>
        </div>
        {needsExpand && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
