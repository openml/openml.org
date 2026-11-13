import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DatasetUploadForm } from "@/components/dataset/dataset-upload-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Dataset | OpenML",
  description:
    "Upload and share a machine learning dataset with the OpenML community.",
};

export default async function DatasetUploadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      `/${locale}/auth/sign-in?reason=uploadDataset&callbackUrl=/${locale}/datasets/upload`,
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          Upload Dataset
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Contribute data to the OpenML community. Make sure your data is
          machine-readable and properly formatted.
        </p>
      </div>

      <DatasetUploadForm />
    </div>
  );
}
