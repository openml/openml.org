"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function EmailConfirmationContent() {
  const t = useTranslations("auth.confirmEmail");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "already_confirmed"
  >(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : t("noToken"),
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`/api/auth/confirm-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        }

        if (data.alreadyConfirmed) {
          setStatus("already_confirmed");
        } else {
          setStatus("success");
        }

        if (data.email) {
          setEmail(data.email);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage(t("error"));
      });
  }, [token, t]);

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            )}
            {status === "success" && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === "already_confirmed" && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>

          <CardTitle className="text-2xl">
            {status === "loading" && t("confirming")}
            {status === "success" && t("success")}
            {status === "already_confirmed" && t("alreadyConfirmed")}
            {status === "error" && t("failed")}
          </CardTitle>

          <CardDescription className="mt-2">
            {status === "loading" && t("pleaseWait")}
            {message}
          </CardDescription>
        </CardHeader>

        {status !== "loading" && (
          <CardContent className="space-y-4">
            {(status === "success" || status === "already_confirmed") && (
              <>
                {email && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>
                )}
                <p className="text-muted-foreground text-center text-sm">
                  {t("accountActive")}
                </p>
              </>
            )}

            {status === "error" && (
              <div className="text-muted-foreground space-y-3 text-sm">
                <p>{t("possibleReasons")}</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>{t("reasonExpired")}</li>
                  <li>{t("reasonUsed")}</li>
                  <li>{t("reasonInvalid")}</li>
                </ul>
                <p className="mt-3">
                  {t("needNewEmail")}
                </p>
              </div>
            )}
          </CardContent>
        )}

        {status !== "loading" && (
          <CardFooter className="flex flex-col gap-2">
            {(status === "success" || status === "already_confirmed") && (
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">{t("signInToOpenML")}</Link>
              </Button>
            )}

            {status === "error" && (
              <div className="flex w-full gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth/sign-up">{t("trySignUpAgain")}</Link>
                </Button>
                <Button asChild variant="default" className="flex-1">
                  <Link href="/">{t("goToHomepage")}</Link>
                </Button>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function EmailConfirmationPage() {
  const t = useTranslations("auth.confirmEmail");
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-screen items-center justify-center py-10">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              </div>
              <CardTitle className="text-2xl">{t("loading")}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <EmailConfirmationContent />
    </Suspense>
  );
}
