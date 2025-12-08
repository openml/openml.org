import { setRequestLocale } from "next-intl/server";

export default async function APIPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">API</h1>
      <p className="text-muted-foreground mt-4">
        API documentation - coming soon
      </p>
    </div>
  );
}
