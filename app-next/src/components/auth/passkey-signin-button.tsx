"use client";

import * as React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, Loader2 } from "lucide-react";
import {
  authenticateWithPasskey,
  isPasskeySupported,
} from "@/services/passkey";

interface PasskeySignInButtonProps {
  callbackUrl?: string;
  className?: string;
  label?: string;
}

export function PasskeySignInButton({
  callbackUrl = "/dashboard",
  className,
  label = "Sign in with Passkey",
}: PasskeySignInButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsSupported(isPasskeySupported());
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");

    // Authenticate with passkey
    const result = await authenticateWithPasskey();

    if (result.success && result.accessToken && result.user) {
      // Sign in with NextAuth using the passkey provider
      const signInResult = await signIn("passkey", {
        credential: JSON.stringify({
          accessToken: result.accessToken,
          user: result.user,
        }),
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError("Failed to complete sign in");
        setIsLoading(false);
      }
    } else {
      setError(result.error || "Authentication failed");
      setIsLoading(false);
    }
  };

  if (!mounted || !isSupported) {
    return null; // Don't show if not mounted yet or if browser doesn't support passkeys
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        className={className}
        onClick={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Fingerprint className="mr-2 h-5 w-5" />
        )}
        {isLoading ? "Authenticating..." : label}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
