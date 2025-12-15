"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Settings, Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { loginToOpenML } from "@/services/openml-api";

interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

// Zod validation schemas
const signInSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function AccountPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("sidebar");
  const { toast } = useToast();

  // Form states
  const [signInForm, setSignInForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check authentication status (check cookies/session)
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("openml_token");
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validated = signInSchema.parse(signInForm);

      // Call real OpenML API
      const result = await loginToOpenML(
        validated.emailOrUsername,
        validated.password,
      );

      if (!result.success) {
        toast({
          title: "Sign in failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      // Store JWT token and user data
      if (result.token) {
        localStorage.setItem("openml_token", result.token);
      }

      if (result.user) {
        const userProfile: UserProfile = {
          username: result.user.username,
          email: result.user.email,
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          image: result.user.image,
        };

        localStorage.setItem("user", JSON.stringify(userProfile));
        setUser(userProfile);
        setIsAuthenticated(true);
      }

      toast({
        title: "Success!",
        description: "Signed in successfully",
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show validation errors
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err) => {
            toast({
              title: "Validation Error",
              description: err.message,
              variant: "destructive",
            });
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Sign in failed. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validated = signUpSchema.parse(signUpForm);

      // TODO: Replace with actual API call to Flask /signup endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful signup
      const newUser: UserProfile = {
        username: validated.email.split("@")[0], // Generate username from email
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      toast({
        title: "Account created!",
        description:
          "You will receive an email to confirm your account. If you don't receive it, please check your spam folder.",
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show validation errors
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err) => {
            toast({
              title: "Validation Error",
              description: err.message,
              variant: "destructive",
            });
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update password. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If authenticated, show user profile/settings
  if (isAuthenticated && user) {
    const initials =
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Account</h1>
          <p className="text-muted-foreground mt-2">
            Manage your OpenML account and settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.image} alt={user.username} />
                  {/* <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white"> */}
                  <AvatarFallback className="gradient-bg text-xl font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-muted-foreground text-sm font-normal">
                    @{user.username}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Email</Label>
                <div className="text-sm">{user.email}</div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href={`/users/${user.username}`}>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    View Public Profile
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to new sign-in page with OAuth
  if (!isAuthenticated && !loading) {
    router.push("/auth/signin");
    return null;
  }

  // Old form below kept for backwards compatibility if needed
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to OpenML</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email or Username</Label>
                  <Input
                    id="signin-email"
                    type="text"
                    placeholder="cmhelder@xs4all.nl"
                    value={signInForm.emailOrUsername}
                    onChange={(e) =>
                      setSignInForm({
                        ...signInForm,
                        emailOrUsername: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signInForm.password}
                      onChange={(e) =>
                        setSignInForm({
                          ...signInForm,
                          password: e.target.value,
                        })
                      }
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <a
                    href="/auth/reset-password"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <CardDescription className="text-center text-base">
                Almost there
              </CardDescription>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstname">First name *</Label>
                  <Input
                    id="signup-firstname"
                    type="text"
                    placeholder=""
                    value={signUpForm.firstName}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname">Last name *</Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    placeholder=""
                    value={signUpForm.lastName}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">
                    Email Address (we never share your email) *
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder=""
                    value={signUpForm.email}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    Password (min 8 characters) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      value={signUpForm.password}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          password: e.target.value,
                        })
                      }
                      className="pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Sign up for OpenML"}
                </Button>

                <p className="text-muted-foreground text-sm">
                  You will receive an email to confirm your account. If you
                  don't receive it, please check your spam folder.
                </p>

                <div className="bg-muted/50 flex items-start gap-2 rounded-lg border p-3">
                  <svg
                    className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">
                    By joining, you agree to the{" "}
                    <a
                      href="/terms"
                      className="text-primary font-medium hover:underline"
                    >
                      Honor Code and Terms of Use
                    </a>
                    .
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
