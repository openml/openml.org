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
    title: "Sign Up - OpenML",
    description: "Create a new OpenML account",
  };
}

export default async function SignUpPage() {
  const t = await getTranslations("auth");

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Sign Up</CardTitle>
          <CardDescription className="text-base">
            Create your OpenML account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Sign up page coming soon. For now, please use the{" "}
            <a href="../signin" className="text-primary hover:underline">
              sign in page
            </a>{" "}
            with OAuth (GitHub or Google).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
