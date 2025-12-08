import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon } from "lucide-react";
import type { Dataset } from "@/types/dataset";
import ReactMarkdown from "react-markdown";

interface DatasetDescriptionProps {
  dataset: Dataset;
}

/**
 * DatasetDescription Component
 *
 * Displays the dataset description with markdown rendering and tags.
 * Server Component for optimal performance.
 */
export function DatasetDescription({ dataset }: DatasetDescriptionProps) {
  return (
    <div className="space-y-6">
      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            And many more Detailed information about this dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{dataset.description}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="h-5 w-5" />
              Tags
            </CardTitle>
            <CardDescription>
              Keywords and categories for this dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dataset.tags.map((tagObj, index) => (
                <Badge
                  key={`${tagObj.tag}-${index}`}
                  variant="secondary"
                  className="hover:bg-secondary/80 cursor-pointer"
                >
                  {tagObj.tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Additional Information */}
      {(dataset.creator || dataset.paper_url || dataset.original_data_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dataset.creator && (
              <div>
                <p className="text-sm font-medium">Creator</p>
                <p className="text-muted-foreground text-sm">
                  {dataset.creator}
                </p>
              </div>
            )}

            {dataset.paper_url && (
              <diwv>
                <p className="text-sm font-medium">Related Paper</p>
                <a
                  href={dataset.paper_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {dataset.paper_url}
                </a>
              </diwv>
            )}

            {dataset.original_data_url && (
              <div>
                <p className="text-sm font-medium">Original Data Source</p>
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
