import { Badge } from "@/components/ui/badge";

interface RunTagsSectionProps {
  tags: string[];
}

export function RunTagsSection({ tags }: RunTagsSectionProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No tags available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {tags.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="px-3 py-1 text-sm"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
