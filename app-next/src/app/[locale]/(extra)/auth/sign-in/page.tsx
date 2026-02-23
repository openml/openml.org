import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AuthTabs from "@/components/auth/auth-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("signIn.title"),
    description: t("signIn.description"),
  };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reason?: string }>;
}) {
  const { locale } = await params;
  const { reason } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  // Map reason param to translated message
  const reasonMessages: Record<string, string> = {
    uploadDataset: t("signInRequired.uploadDataset"),
    createTask: t("signInRequired.createTask"),
    createCollection: t("signInRequired.createCollection"),
  };
  const reasonMessage = reason
    ? (reasonMessages[reason] ?? t("signInRequired.default"))
    : null;

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-4">
        {/* Contextual message shown when redirected from a protected action */}
        {reasonMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-800 px-4 py-3 text-slate-200 dark:border-slate-950 dark:bg-slate-950 dark:text-slate-200">
            <LogIn className="size-5 shrink-0" />
            <p className="text-sm font-medium">{reasonMessage}</p>
          </div>
        )}
        <Card className="border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-slate-800 dark:text-white">
              {t("signIn.welcome")}
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-300">
              {t("signIn.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthTabs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
