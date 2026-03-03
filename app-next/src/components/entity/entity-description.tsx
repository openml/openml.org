/**
 * 🎯 Generic Entity Description Component
 *
 * Displays description, tags, and citation for any entity type.
 * Uses EntityConfig for dynamic rendering.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon, Quote } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { EntityConfig } from "@/config/entities";

interface EntityDescriptionProps {
  /** The entity data object */
  entity: Record<string, unknown>;
  /** Entity configuration from config/entities.ts */
  config: EntityConfig;
  /** Optional custom description (overrides entity.description) */
  customDescription?: string;
}

/**
 * Generic Entity Description
 *
 * Renders:
 * - Description with Markdown support
 * - Tags (if available)
 * - Citation (if available)
 * - Paper URL (if available)
 */
export function EntityDescription({
  entity,
  config,
  customDescription,
}: EntityDescriptionProps) {
  const description = customDescription || (entity.description as string) || "";
  const tags = entity.tags as Array<{ tag: string }> | undefined;
  const citation = entity.citation as string | undefined;
  const paperUrl = entity.paper_url as string | undefined;

  return (
    <div className="space-y-6">
      {/* Description Card */}
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            Detailed information about this {config.singular.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {description ? (
              <ReactMarkdown>{description}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                No description available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="h-5 w-5" />
              Tags
            </CardTitle>
            <CardDescription>Keywords and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tagObj, index) => (
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
      {citation && (
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5" />
              Citation
            </CardTitle>
            <CardDescription>
              How to cite this {config.singular.toLowerCase()} in academic work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <p className="font-mono text-sm whitespace-pre-wrap">
                {citation}
              </p>
            </div>
            {paperUrl && (
              <a
                href={paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary mt-4 inline-block text-sm hover:underline"
              >
                View Paper →
              </a>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
