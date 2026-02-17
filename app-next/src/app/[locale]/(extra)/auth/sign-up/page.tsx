import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignUpForm from "@/components/auth/sign-up-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign Up - OpenML",
    description: "Create a new OpenML account",
  };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-slate-800 dark:text-white">
            Sign Up
          </CardTitle>
          <CardDescription className="text-base text-slate-500 dark:text-slate-400">
            Create your OpenML account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
