import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Run #${id} | OpenML`,
    description: `View details for run #${id} on OpenML.`,
  };
}

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const runId = parseInt(id);

  if (isNaN(runId)) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-4xl font-bold">Run #{runId}</h1>
          <Badge>Placeholder</Badge>
        </div>
      </div>

      <Card className="border-yellow-500/50">
        <CardHeader>
          <Badge variant="outline" className="w-fit bg-yellow-500/10">
            🚧 Under Construction
          </Badge>
          <CardTitle>Run Detail Page</CardTitle>
          <CardDescription>
            TODO: Use{" "}
            <code className="bg-muted rounded px-1 py-0.5">
              useRun({runId})
            </code>{" "}
            hook to fetch data
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
