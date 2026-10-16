import { redirect } from "next/navigation";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  redirect(q ? `/collections/tasks?q=${encodeURIComponent(q)}` : "/collections/tasks");
}
