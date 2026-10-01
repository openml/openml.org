import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "dashboard.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false, // Don't index personal dashboards
      follow: false,
    },
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/auth/sign-in?callbackUrl=/${locale}/dashboard`);
  }

  return <UserDashboard />;
}
