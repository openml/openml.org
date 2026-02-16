import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchDataset } from "@/lib/api/dataset";
import { DatasetEditForm } from "@/components/dataset/dataset-edit-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Edit Dataset #${id} - OpenML`,
    description: `Edit metadata for OpenML dataset #${id}`,
  };
}

export default async function DatasetEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Auth check — redirect to sign-in if not authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/datasets/${id}/edit`);
  }

  const dataset = await fetchDataset(id);

  // Determine if current user is the dataset owner
  const userId = (session.user as { id?: string }).id;
  const isOwner = userId ? Number(userId) === dataset.uploader_id : false;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <DatasetEditForm
        datasetId={dataset.data_id}
        datasetName={dataset.name}
        isOwner={isOwner}
        initialValues={{
          description: dataset.description || "",
          creator: dataset.creator || "",
          collection_date: dataset.collection_date || "",
          citation: dataset.citation || "",
          language: dataset.language || "",
          original_data_url: dataset.original_data_url || "",
          paper_url: dataset.paper_url || "",
          default_target_attribute: dataset.default_target_attribute || "",
          ignore_attribute: dataset.ignore_attribute || "",
          row_id_attribute: dataset.row_id_attribute || "",
        }}
        features={dataset.features?.map((f) => f.name) || []}
      />
    </div>
  );
}
