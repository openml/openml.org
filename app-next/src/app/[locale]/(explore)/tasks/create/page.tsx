import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function TaskCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      `/${locale}/auth/sign-in?reason=createTask&callbackUrl=/${locale}/tasks/create`
    );
  }

  // TODO: Implement task creation form
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Define Task</h1>
      <p className="text-muted-foreground mt-2">Coming soon.</p>
    </div>
  );
}
