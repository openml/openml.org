"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function AccountConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    const confirmAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing confirmation token.");
        return;
      }

      try {
        // Use direct Next.js API route
        const confirmUrl = "/api/auth/confirm";

        const response = await fetch(confirmUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: window.location.href,
          }),
        });

        if (response.ok) {
          setStatus("success");
          setMessage(
            "Your account has been successfully activated. You can now sign in.",
          );
          // Auto-redirect after 5 seconds
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 5000);
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(
            data.message ||
              "Failed to confirm account. The link may have expired or is invalid.",
          );
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred during confirmation.");
      }
    };

    confirmAccount();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Confirming Account</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Account Verified!</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>
          <Button onClick={() => router.push("/auth/sign-in")}>
            Sign In Now
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-12 w-12 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Confirmation Failed</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/auth/sign-up")}
            >
              Back to Sign Up
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </>
      )}
    </div>
  );
}
