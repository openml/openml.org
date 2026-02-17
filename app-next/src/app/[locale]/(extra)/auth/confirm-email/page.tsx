"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "already_confirmed"
  >(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "No confirmation token provided",
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
        setMessage("An error occurred during email confirmation");
      });
  }, [token]);

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
            {status === "loading" && "Confirming your email..."}
            {status === "success" && "Email Confirmed!"}
            {status === "already_confirmed" && "Already Confirmed"}
            {status === "error" && "Confirmation Failed"}
          </CardTitle>

          <CardDescription className="mt-2">
            {status === "loading" &&
              "Please wait while we verify your email address."}
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
                  Your account is now active. You can sign in to start exploring
                  OpenML.
                </p>
              </>
            )}

            {status === "error" && (
              <div className="text-muted-foreground space-y-3 text-sm">
                <p>Possible reasons:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>The confirmation link has expired (24 hours)</li>
                  <li>The link has already been used</li>
                  <li>The link is invalid or corrupted</li>
                </ul>
                <p className="mt-3">
                  If you need a new confirmation email, please contact support
                  or try signing up again.
                </p>
              </div>
            )}
          </CardContent>
        )}

        {status !== "loading" && (
          <CardFooter className="flex flex-col gap-2">
            {(status === "success" || status === "already_confirmed") && (
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">Sign In to OpenML</Link>
              </Button>
            )}

            {status === "error" && (
              <div className="flex w-full gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth/sign-up">Try Signing Up Again</Link>
                </Button>
                <Button asChild variant="default" className="flex-1">
                  <Link href="/">Go to Homepage</Link>
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
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-screen items-center justify-center py-10">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <EmailConfirmationContent />
    </Suspense>
  );
}
