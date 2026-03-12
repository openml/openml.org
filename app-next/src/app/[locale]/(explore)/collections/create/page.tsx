import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CollectionCreateForm } from "@/components/collection/collection-create-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Collection | OpenML",
  description: "Create a new benchmark collection of tasks on OpenML.",
};

export default async function CollectionCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      `/${locale}/auth/sign-in?reason=createCollection&callbackUrl=/${locale}/collections/create`,
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          Create Collection
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Create a new collection (benchmark suite) of tasks.
        </p>
      </div>

      <CollectionCreateForm />
    </div>
  );
}
