import { ClickableTagList } from "@/components/ui/clickable-tag-list";

interface RunTagsSectionProps {
  tags: string[];
}

export function RunTagsSection({ tags }: RunTagsSectionProps) {
  // OpenML API may return a single string instead of string[]
  const normalizedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? [tags]
      : [];
  if (normalizedTags.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No tags available
      </div>
    );
  }

  return (
    <div className="p-4">
      <ClickableTagList
        tags={normalizedTags}
        getHref={(tag) => `/runs?tag=${encodeURIComponent(tag)}`}
      />
    </div>
  );
}
