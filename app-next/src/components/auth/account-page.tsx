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

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function AccountPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser: UserProfile = {
        username: validated.emailOrUsername,
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
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

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful signup
      const newUser: UserProfile = {
        username: validated.username,
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully",
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

  // If not authenticated, show sign-in/sign-up tabs
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button">
                  <FontAwesomeIcon icon={faGithub} className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" type="button">
                  <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">First name</Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      placeholder="John"
                      value={signUpForm.firstName}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Last name</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Doe"
                      value={signUpForm.lastName}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                    value={signUpForm.username}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpForm.email}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signUpForm.password}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
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
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signUpForm.confirmPassword}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
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
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button">
                  <FontAwesomeIcon icon={faGithub} className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" type="button">
                  <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
