"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Upload,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Fingerprint,
} from "lucide-react";
import { PasskeyRegistration } from "@/components/auth/passkey-registration";
import { listPasskeys, removePasskey, Passkey } from "@/services/passkey";
import { useToast } from "@/hooks/use-toast";

/**
 * Profile Settings Page - Inspired by OpenML's /auth/edit-profile
 * Two tabs: Profile Information and API Key
 * Connected to TU Eindhoven Flask backend
 */
export function ProfileSettings() {
  const t = useTranslations("sidebar");
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk_openml_1234567890abcdefghijklmnop");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [isLoadingPasskeys, setIsLoadingPasskeys] = useState(false);
  const [isRemovingPasskey, setIsRemovingPasskey] = useState<number | null>(
    null,
  );

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    affiliation: "",
    country: "",
    image: "",
  });

  // Load profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            bio: data.bio || "",
            affiliation: data.affiliation || "",
            country: data.country || "",
            image: data.image || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to session data
        if (session?.user) {
          const nameParts = session.user.name?.split(" ") || [];
          setProfile((prev) => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: session.user?.email || "",
            image: session.user?.image || "",
          }));
        }
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchPasskeys = async () => {
    try {
      setIsLoadingPasskeys(true);
      const result = await listPasskeys();
      if (result.success) {
        setPasskeys(result.passkeys || []);
      }
    } catch (error) {
      console.error("Failed to fetch passkeys:", error);
    } finally {
      setIsLoadingPasskeys(false);
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  const handleDeletePasskey = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this passkey?")) {
      return;
    }

    try {
      setIsRemovingPasskey(id);
      const result = await removePasskey(id);
      if (result.success) {
        toast({
          title: "Passkey Removed",
          description: "The passkey has been successfully removed.",
        });
        fetchPasskeys();
      } else {
        throw new Error(result.error || "Failed to remove passkey");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove passkey",
        variant: "destructive",
      });
    } finally {
      setIsRemovingPasskey(null);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to clipboard.",
    });
  };

  const handleRegenerateApiKey = async () => {
    // Confirm action with user
    if (
      !window.confirm(
        "Are you sure you want to regenerate your API key? This will invalidate your current key and you'll need to update it in all your applications.",
      )
    ) {
      return;
    }

    try {
      setIsRegenerating(true);

      // Get JWT token from NextAuth session or localStorage fallback
      const token =
        (session as any)?.accessToken || localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

      const response = await fetch(`${apiUrl}/api-key/regenerate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ msg: "Failed to regenerate API key" }));
        throw new Error(error.msg || "Regeneration failed");
      }

      const data = await response.json();

      // Update API key in state
      setApiKey(data.api_key || data.apiKey || "");

      toast({
        title: "API Key Regenerated",
        description:
          "Your API key has been successfully regenerated. Make sure to update it in your applications.",
      });
    } catch (error) {
      console.error("API key regeneration error:", error);
      toast({
        title: "Regeneration Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to regenerate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Get JWT token from NextAuth session or localStorage fallback
      const token =
        (session as any)?.accessToken || localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const formData = new FormData();
      formData.append("file", file);

      // Use direct Next.js API route
      const uploadEndpoint = "/api/user/avatar";

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();

      // Update profile with new image path
      setProfile({ ...profile, image: data.imagePath });

      // Also update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.image = data.imagePath;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // ✅ CRITICAL: Update NextAuth session with new image
      if (update) {
        await update({
          ...session,
          user: {
            ...session?.user,
            image: data.imagePath,
          },
        });
      }

      toast({
        title: "Success",
        description:
          "Avatar uploaded successfully! Your profile picture will update shortly.",
      });
    } catch (error) {
      console.error("Upload error:", error);

      // Provide specific error messages
      let errorMessage = "Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for common development issues
        if (
          errorMessage.includes("BLOB_READ_WRITE_TOKEN") ||
          errorMessage.includes("zod")
        ) {
          errorMessage =
            "⚠️ Development: Vercel Blob token not configured. This will work in production deployment.";
        } else if (
          errorMessage.includes("fetch") ||
          errorMessage.includes("network")
        ) {
          errorMessage = "Network error. Check if the backend is running.";
        }
      }

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // Get JWT token from NextAuth session or localStorage fallback
      const token =
        (session as any)?.accessToken || localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      // Use direct Next.js API route
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          bio: profile.bio,
          affiliation: profile.affiliation,
          country: profile.country,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      // ✅ Update NextAuth session with new name/email
      if (update) {
        await update({
          ...session,
          user: {
            ...session?.user,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            name: `${profile.firstName} ${profile.lastName}`,
          },
        });
      }

      // Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.firstName = profile.firstName;
        userData.lastName = profile.lastName;
        userData.email = profile.email;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="apikey">API Key</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile information</CardTitle>
              <CardDescription>
                Update your profile information visible to other users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center gap-6">
                <Avatar className="size-32 border-4 border-slate-200">
                  <AvatarImage src={profile.image} alt="Profile" />
                  <AvatarFallback className="gradient-bg text-3xl font-bold text-white">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    type="button"
                    className="gap-2"
                    disabled={isUploading}
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <p className="text-muted-foreground text-sm">
                    Max 5MB. JPEG, PNG, or WebP format.
                  </p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="resize-none"
                />
              </div>

              {/* Affiliation */}
              <div className="space-y-2">
                <Label htmlFor="affiliation">Affiliation</Label>
                <Input
                  id="affiliation"
                  placeholder="University, Company, etc."
                  value={profile.affiliation}
                  onChange={(e) =>
                    setProfile({ ...profile, affiliation: e.target.value })
                  }
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(e) =>
                    setProfile({ ...profile, country: e.target.value })
                  }
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  size="lg"
                  className="px-8"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Key Tab */}
        <TabsContent value="apikey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>
                Use your API key to authenticate with the OpenML API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Display */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">Your API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="pr-12 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-8 w-8 p-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyApiKey}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* API Key Actions */}
              <div className="bg-muted rounded-lg border p-4">
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Regenerate API Key</h4>
                  <p className="text-muted-foreground text-sm">
                    If you believe your API key has been compromised, you can
                    regenerate it. This will invalidate your current key.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleRegenerateApiKey}
                  disabled={isRegenerating}
                  className="gap-2"
                >
                  {isRegenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isRegenerating ? "Regenerating..." : "Regenerate API Key"}
                </Button>
              </div>

              {/* API Documentation */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                  Getting Started with the API
                </h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Learn how to use your API key to interact with OpenML
                  programmatically.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://docs.openml.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View API Documentation →
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Passkeys</CardTitle>
                  <CardDescription>
                    Manage your biometrics and hardware security keys
                  </CardDescription>
                </div>
                <PasskeyRegistration onSuccess={fetchPasskeys} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingPasskeys ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                </div>
              ) : passkeys.length > 0 ? (
                <div className="divide-y rounded-md border">
                  {passkeys.map((pk) => (
                    <div
                      key={pk.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-full p-2">
                          <Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {pk.deviceName || "Unnamed Device"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Registered:{" "}
                            {new Date(pk.createdAt).toLocaleDateString()}
                            {pk.lastUsedAt &&
                              ` • Last used: ${new Date(
                                pk.lastUsedAt,
                              ).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        onClick={() => handleDeletePasskey(pk.id)}
                        disabled={isRemovingPasskey === pk.id}
                      >
                        {isRemovingPasskey === pk.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <Fingerprint className="text-muted-foreground mb-4 h-12 w-12 opacity-20" />
                  <h3 className="text-lg font-medium">
                    No passkeys registered
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm px-4 text-sm">
                    Register a passkey to sign in securely using your
                    fingerprint, face, or a hardware security key.
                  </p>
                  <PasskeyRegistration
                    onSuccess={fetchPasskeys}
                    trigger={
                      <Button variant="outline">
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Add your first Passkey
                      </Button>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                About Passkeys
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 dark:text-blue-400">
              Passkeys are a passwordless authentication method that offers
              stronger security and a faster sign-in experience. They are synced
              across your devices and cannot be phished.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
