"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { PasskeySignInButton } from "./passkey-signin-button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Badge } from "@/components/ui/badge";

export default function SignInForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError(t("signIn.emailRequired"));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("signIn.passwordMinLength"));
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
    <div className="space-y-6">
      {/* High Priority: Passkey & OAuth Section */}
      <div className="space-y-4">
        <div className="group relative">
          <Badge className="absolute -top-2.5 right-4 z-10 border-0 bg-slate-500 px-2 py-0 text-[10px] text-white">
            {t("recommended")}
          </Badge>
          <PasskeySignInButton
            className="h-12 w-full bg-slate-600 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:bg-slate-500 active:scale-[0.99]"
            label={t("signIn.passkeyLabel")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 border-slate-300 bg-white text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Google</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 border-slate-300 bg-white text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
          >
            <Github className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">GitHub</span>
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-4 font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            {t("signIn.orWithEmail")}
          </span>
        </div>
      </div>

      {/* Traditional Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          id="email"
          label={t("signIn.emailLabel")}
          type="text"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading}
          autoComplete="username"
        />

        <div className="space-y-1">
          <FloatingInput
            id="password"
            label={t("signIn.passwordLabel")}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
            autoComplete="current-password"
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
          <div className="flex justify-end pt-1">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-white"
            >
              {t("signIn.forgotPassword")}
            </Link>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-1 py-2.5"
          >
            <AlertDescription className="text-sm font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="h-11 w-full bg-slate-600 font-semibold text-white transition-all hover:bg-slate-500"
          disabled={isLoading}
        >
          {isLoading ? t("signIn.signingIn") : t("signIn.signInButton")}
        </Button>
      </form>

      {/* Footer Info */}
      <div className="pt-2 text-center text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {t("signIn.noAccount")}{" "}
        </span>
        <Link
          href={`/${locale}/auth/sign-up`}
          className="font-semibold text-slate-700 decoration-2 underline-offset-4 hover:underline dark:text-white"
        >
          {t("signIn.createAccount")}
        </Link>
      </div>
    </div>
  );
}
