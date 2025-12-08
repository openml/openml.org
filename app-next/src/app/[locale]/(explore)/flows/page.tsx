import { setRequestLocale } from "next-intl/server";

export default async function FlowsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Flows</h1>
      <p className="text-muted-foreground mt-4">Flows page - coming soon</p>
    </div>
  );
}
