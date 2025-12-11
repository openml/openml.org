import { redirect } from "next/navigation";

export default async function UserRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/users/${id}`);
}
