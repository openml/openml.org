"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github, Eye, EyeOff, Fingerprint } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { startRegistration } from "@simplewebauthn/browser";
import { FloatingInput } from "@/components/ui/floating-input";
import { Badge } from "@/components/ui/badge";

export default function SignUpForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const checkEmail = async (email: string) => {
    if (!email || !email.includes("@")) return;
    try {
      const res = await fetch(
        `/api/auth/check-email?email=${encodeURIComponent(email)}`,
      );
      const data = await res.json();
      if (data.exists) {
        setEmailError("This email is already registered");
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.error("Error checking email:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Use direct Next.js API route
      const registerUrl = "/api/auth/register";

      // Call Next.js sign-up endpoint
      const res = await fetch(registerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto sign-in after successful registration
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setError("Account created! Please sign in.");
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
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
      setError("OAuth sign up failed");
      setIsLoading(false);
    }
  };

  const handlePasskeySignUp = async () => {
    setIsLoading(true);
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      setError(
        "Please fill in your name and email before using Passkey sign up",
      );
      setIsLoading(false);
      return;
    }

    if (emailError) {
      setError(emailError);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Get Registration Options
      const optionsRes = await fetch("/api/auth/passkey/signup-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      const options = await optionsRes.json();
      if (!optionsRes.ok) {
        if (options.error === "Email already registered") {
          setEmailError("This email is already registered");
          throw new Error("This email is already registered");
        }
        throw new Error(options.error || "Failed to get options");
      }

      // 2. Start WebAuthn Registration
      const attestation = await startRegistration(options);

      // 3. Verify Registration
      const verifyRes = await fetch("/api/auth/passkey/signup-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: attestation,
          deviceName:
            navigator.userAgent.split(")")[0].split("(")[1] || "Mobile Device",
        }),
      });

      const verification = await verifyRes.json();
      if (!verifyRes.ok)
        throw new Error(verification.error || "Verification failed");

      // 4. Auto Sign-in
      const result = await signIn("passkey", {
        credential: JSON.stringify(verification),
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/auth/signin?success=account_created");
      }
    } catch (err: any) {
      console.error("Passkey Sign-up error:", err);
      setError(
        err.message ||
          "Passkey registration failed. Please try a different method.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* High Priority: Passkey & OAuth Section */}
      <div className="space-y-4">
        <div className="group relative">
          <Badge className="absolute -top-2.5 right-4 z-10 border-0 bg-slate-500 px-2 py-0 text-[10px] text-white">
            RECOMMENDED
          </Badge>
          <Button
            type="button"
            className="ext-[10px] h-12 w-full bg-slate-600 font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:bg-slate-500 active:scale-[0.99]"
            onClick={handlePasskeySignUp}
            disabled={isLoading || !!emailError}
          >
            <Fingerprint className="mr-2 h-5 w-5" />
            Sign up with FaceID or Fingerprint
          </Button>
          <p className="mt-1.5 text-center text-[10px] font-medium text-slate-500 opacity-70 dark:text-slate-400">
            No password required for biometric sign up
          </p>
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
            or sign up with email
          </span>
        </div>
      </div>

      {/* Manual Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            id="firstName"
            label="First name"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            disabled={isLoading}
          />
          <FloatingInput
            id="lastName"
            label="Family name"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <FloatingInput
          id="email"
          label="Email address"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (emailError) setEmailError("");
          }}
          onBlur={(e) => checkEmail(e.target.value)}
          error={emailError}
          disabled={isLoading}
        />

        <div className="relative">
          <div className="bg-card absolute -top-2 right-2 z-10 px-1">
            <span className="text-[9px] font-bold tracking-tight text-slate-400 uppercase dark:text-slate-500">
              Only for email sign up
            </span>
          </div>
          <FloatingInput
            id="password"
            label="Password (min 8 characters)"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
            className="border-muted-foreground/10"
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
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-1 py-2.5"
          >
            <AlertDescription className="text-xs font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="h-11 w-full bg-slate-600 font-semibold text-white transition-all hover:bg-slate-500"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Footer Info */}
      <div className="space-y-4 pt-2">
        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          By joining, you agree to our Terms of Use
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </p>

        <div className="text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
          </span>
          <Link
            href={`/${locale}/auth/signin`}
            className="font-semibold text-slate-700 decoration-2 underline-offset-4 hover:underline dark:text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
