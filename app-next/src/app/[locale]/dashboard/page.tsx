import { getTranslations } from "next-intl/server";
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

export default function DashboardPage() {
  return <UserDashboard />;
}
