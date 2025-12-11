import { setRequestLocale } from "next-intl/server";
import { UserProfilePage } from "@/components/user/user-profile-page";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <UserProfilePage userId={id} />;
}
