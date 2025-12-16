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
import { Github, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function SignUpForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

      // Call Flask sign-up endpoint (you'll need to implement this in Flask)
      const res = await fetch(`${apiUrl}/api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
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

  return (
    <div className="space-y-4">
      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-sm">
              First name *
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Your first name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              disabled={isLoading}
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-sm">
              Last name *
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Your last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              disabled={isLoading}
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm">
            Email address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading}
            className="h-9"
          />
          <p className="text-muted-foreground text-xs">
            We never share your email
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm">
            Password (min 8 characters) *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
              className="h-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="h-9 w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up for OpenML"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
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

      <p className="text-muted-foreground text-center text-xs">
        📧 We'll send you a confirmation email to verify your account
      </p>

      <div className="bg-muted/50 flex items-start gap-2 rounded-lg border p-3">
        <p className="text-xs">
          By joining, you agree to the{" "}
          <Link
            href={`/${locale}/terms`}
            className="text-primary font-medium hover:underline"
          >
            Honor Code and Terms of Use
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
