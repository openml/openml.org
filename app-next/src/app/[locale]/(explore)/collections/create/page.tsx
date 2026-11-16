import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function CollectionCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      `/${locale}/auth/sign-in?reason=createCollection&callbackUrl=/${locale}/collections/create`
    );
  }

  // TODO: Implement collection creation form
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Create Collection</h1>
      <p className="text-muted-foreground mt-2">Coming soon.</p>
    </div>
  );
}
