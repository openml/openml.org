import { setRequestLocale } from "next-intl/server";

export default async function ModelEvaluationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Model Evaluation</h1>
      <p className="text-muted-foreground mt-4">
        Model evaluation measures - coming soon
      </p>
    </div>
  );
}
