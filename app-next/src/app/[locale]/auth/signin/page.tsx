import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthTabs from "@/components/auth/auth-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("signIn.title"),
    description: t("signIn.description"),
  };
}

export default async function SignInPage() {
  const t = await getTranslations("auth");

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{t("signIn.welcome")}</CardTitle>
          <CardDescription className="text-base">
            {t("signIn.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthTabs />
        </CardContent>
      </Card>
    </div>
  );
}
