import { setRequestLocale } from "next-intl/server";

export default async function FlowDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Flow {id}</h1>
      <p className="text-muted-foreground mt-4">
        Flow detail page - coming soon
      </p>
    </div>
  );
}
