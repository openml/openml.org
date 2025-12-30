"use client";

import { Info, Calendar, Hash, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";

interface TaskInfoSectionProps {
  task: Task;
}

/**
 * TaskInfoSection Component
 *
 * Displays additional task information and metadata.
 */
export function TaskInfoSection({ task }: TaskInfoSectionProps) {
  const uploadDate = task.upload_date
    ? new Date(task.upload_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const tags = task.tag ?? [];

  return (
    <section id="information" className="scroll-mt-20">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Info className="h-5 w-5 text-orange-500" />
            Task Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Task ID */}
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4" />
                Task ID
              </p>
              <Badge variant="outline" className="font-mono text-lg">
                #{task.task_id}
              </Badge>
            </div>

            {/* Task Type ID */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Task Type ID
              </p>
              <p className="font-mono text-lg">{task.task_type_id}</p>
            </div>

            {/* Upload Date */}
            {uploadDate && (
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Upload Date
                </p>
                <p className="text-lg">{uploadDate}</p>
              </div>
            )}

            {/* Tags - Full Width */}
            {tags.length > 0 && (
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
