import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskCreateForm } from "@/components/task/task-create-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Task | OpenML",
  description: "Define a new machine learning task for a dataset on OpenML.",
};

export default async function TaskCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      `/${locale}/auth/sign-in?reason=createTask&callbackUrl=/${locale}/tasks/create`,
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          Define Task
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Create a new machine learning task for a dataset.
        </p>
      </div>

      <TaskCreateForm />
    </div>
  );
}
