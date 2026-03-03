import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClickableTagListProps {
  tags: string[];
  getHref: (tag: string) => string;
  className?: string;
}

/**
 * Renders a list of tags as clickable Badge links.
 * Used by RunTagsSection, dataset metadata, etc. to keep tag UI consistent.
 */
export function ClickableTagList({
  tags,
  getHref,
  className,
}: ClickableTagListProps) {
  // OpenML API sometimes returns a single string instead of string[]
  const tagArray = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? [tags]
      : [];
  if (!tagArray.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tagArray.map((tag) => (
        <Link key={tag} href={getHref(tag)}>
          <Badge
            variant="secondary"
            className="cursor-pointer px-3 py-1 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
