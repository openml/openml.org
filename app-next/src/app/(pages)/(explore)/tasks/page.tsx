import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Tasks | OpenML",
  description: "Browse machine learning tasks and benchmarks on OpenML.",
};

export default function TasksPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Tasks</h1>
        <p className="text-muted-foreground text-lg">
          Browse and compare standardized machine learning tasks
        </p>
      </div>

      <Card className="border-yellow-500/50">
        <CardHeader>
          <Badge variant="outline" className="w-fit bg-yellow-500/10">
            🚧 Under Construction
          </Badge>
          <CardTitle>Task Search Coming Soon</CardTitle>
          <CardDescription>
            <Link href="/tasks/1" className="text-primary hover:underline">
              Example: View Task #1 →
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
