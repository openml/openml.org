"use client";

import {
  Eye,
  Download,
  Activity,
  MessageSquare,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { Dataset } from "@/types/dataset";

interface ActivityOverviewProps {
  dataset: Dataset;
}

/**
 * ActivityOverview Component (kggl-style)
 *
 * Displays activity metrics similar to kggl's Activity Overview section.
 * Shows: Views, Downloads, Engagement, Comments, Top Contributors
 */
export function ActivityOverview({ dataset }: ActivityOverviewProps) {
  // Use actual data from dataset
  const views = dataset.nr_of_downloads || 0;
  const downloads = dataset.nr_of_downloads || 0;
  const runs = dataset.runs || 0;
  const likes = dataset.nr_of_likes || 0;

  // Placeholder for top contributors - in future, this would come from API
  const uploader = {
    id: dataset.uploader_id,
    name: dataset.uploader,
    avatar: dataset.uploader_id
      ? `https://www.openml.org/img/${dataset.uploader_id}`
      : null,
  };

  // Only show if there's any activity data
  const hasActivity =
    views > 0 || downloads > 0 || runs > 0 || likes > 0 || uploader.name;

  if (!hasActivity) {
    return null;
  }

  return (
    <section id="activity" className="scroll-mt-20">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatItem
              icon={<Eye className="h-4 w-4" />}
              label="Views"
              value={views.toLocaleString()}
              trend={null}
            />
            <StatItem
              icon={<Download className="h-4 w-4" />}
              label="Downloads"
              value={downloads.toLocaleString()}
              trend={null}
            />
            <StatItem
              icon={<TrendingUp className="h-4 w-4" />}
              label="Runs"
              value={runs.toLocaleString()}
              trend={null}
            />
            <StatItem
              icon={<MessageSquare className="h-4 w-4" />}
              label="Likes"
              value={likes.toLocaleString()}
              trend={null}
            />
          </div>

          {/* Engagement metric */}
          {downloads > 0 && views > 0 && (
            <div className="mb-4 border-t pt-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Engagement: </span>
                <span className="font-medium">
                  {((downloads / Math.max(views, 1)) * 100).toFixed(2)}%
                  downloads per view
                </span>
              </div>
            </div>
          )}

          {/* Top Contributors */}
          <div className="border-t pt-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Top Contributors
            </h4>
            <div className="flex flex-wrap gap-3">
              {uploader.name && (
                <Link
                  href={`/users/${uploader.id}`}
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={uploader.avatar || undefined}
                      alt={uploader.name}
                    />
                    <AvatarFallback className="text-xs">
                      {uploader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{uploader.name}</span>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// Stat Item Component
function StatItem({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string | null;
}) {
  return (
    <div className="text-center">
      <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {trend && (
        <div className="text-muted-foreground mt-1 text-xs">{trend}</div>
      )}
    </div>
  );
}
