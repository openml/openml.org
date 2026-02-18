"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || t("failedToSend"));
      }
    } catch (error) {
      setStatus("error");
      setMessage(t("unexpectedError"));
    }
  };

  if (status === "success") {
    return (
      <div className="container flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">{t("checkEmail")}</CardTitle>
            <CardDescription className="mt-2">{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
              <p className="font-medium mb-2">{t("nextSteps")}</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>{t("step1")} <strong>{email}</strong></li>
                <li>{t("step2")}</li>
                <li>{t("step3")}</li>
              </ol>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {t("didntReceive")}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={() => setStatus("idle")}
              variant="outline"
              className="w-full"
            >
              {t("sendAnother")}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/sign-in">{t("backToSignIn")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription className="mt-2">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && status === "error" && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("emailLabel")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("sendingResetLink")}
                </>
              ) : (
                t("sendResetLink")
              )}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToSignIn")}
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
