"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function SignInForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!formData.email.trim()) {
      setError("Email or username is required");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("signIn.invalidCredentials"));
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(t("signIn.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(true);
    setError("");

    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err) {
      setError(t("signIn.oauthError"));
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Traditional Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm">
            {t("signIn.emailLabel")}
          </Label>
          <Input
            id="email"
            type="text"
            placeholder={t("signIn.emailPlaceholder")}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading}
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm">
            {t("signIn.passwordLabel")}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t("signIn.passwordPlaceholder")}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
            className="h-9"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="h-9 w-full" disabled={isLoading}>
          {isLoading ? t("signIn.signingIn") : t("signIn.signInButton")}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            {t("signIn.orContinueWith")}
          </span>
        </div>
      </div>

      {/* OAuth Buttons - Side by Side */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-9"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      {/* Footer Links */}
      <div className="text-center text-sm">
        <Link
          href={`/${locale}/auth/forgot-password`}
          className="text-primary hover:underline"
        >
          {t("signIn.forgotPassword")}
        </Link>
      </div>

      <div className="text-muted-foreground text-center text-sm">
        {t("signIn.noAccount")}{" "}
        <Link
          href={`/${locale}/auth/signup`}
          className="text-primary hover:underline"
        >
          {t("signIn.signUpLink")}
        </Link>
      </div>
    </div>
  );
}
