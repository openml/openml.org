import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Collections - OpenML",
  description:
    "Browse curated collections of machine learning tasks. Find grouped tasks for specific domains, competitions, or research projects.",
  keywords: [
    "task collections",
    "ML benchmarks",
    "curated tasks",
    "OpenML collections",
  ],
  openGraph: {
    title: "Task Collections - OpenML",
    description: "Curated collections of ML tasks.",
    type: "website",
    url: "https://www.openml.org/collections/tasks",
    siteName: "OpenML",
  },
};

export default async function CollectionTasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Task Collections</h1>
      <p className="text-muted-foreground mt-4">
        Task collections - coming soon
      </p>
    </div>
  );
}
