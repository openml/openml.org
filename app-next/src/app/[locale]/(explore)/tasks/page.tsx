import { setRequestLocale } from "next-intl/server";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="text-muted-foreground mt-4">Tasks page - coming soon</p>
    </div>
  );
}
