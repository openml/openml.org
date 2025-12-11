import { setRequestLocale } from "next-intl/server";
import { TasksSearchPage } from "@/components/search/tasks-search-page";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TasksSearchPage />;
}
