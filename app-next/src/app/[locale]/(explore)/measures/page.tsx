import { redirect } from "next/navigation";

export default async function MeasuresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  redirect(q ? `/measures/evaluation?q=${encodeURIComponent(q)}` : "/measures/evaluation");
}
