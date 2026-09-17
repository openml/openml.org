import { redirect } from "next/navigation";

export default async function BenchmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  redirect(q ? `/benchmarks/tasks?q=${encodeURIComponent(q)}` : "/benchmarks/tasks");
}
