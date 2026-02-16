import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forgot Password - OpenML",
    description: "Reset your OpenML password",
  };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Forgot Password</CardTitle>
          <CardDescription className="text-base">
            Reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Password reset page coming soon. For now, please contact support or
            use{" "}
            <a href="../signin" className="text-primary hover:underline">
              sign in
            </a>{" "}
            with OAuth (GitHub or Google).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
