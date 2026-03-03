"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, Loader2 } from "lucide-react";
import { registerPasskey, isPasskeySupported } from "@/services/passkey";
import { useToast } from "@/hooks/use-toast";

interface PasskeyRegistrationProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function PasskeyRegistration({
  onSuccess,
  trigger,
}: PasskeyRegistrationProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const supported = isPasskeySupported();

  const handleRegister = async () => {
    if (!session?.accessToken) {
      setError("You must be signed in to register a passkey");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await registerPasskey(
      session.accessToken,
      deviceName || undefined,
    );

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Passkey registered",
        description: "You can now sign in with your passkey",
      });
      setOpen(false);
      setDeviceName("");
      onSuccess?.();
    } else {
      setError(result.error || "Failed to register passkey");
    }
  };

  if (!supported) {
    return null; // Don't show if browser doesn't support passkeys
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Fingerprint className="mr-2 h-4 w-4" />
            Add Passkey
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register a Passkey</DialogTitle>
          <DialogDescription>
            Use your fingerprint, face, or security key to sign in quickly and
            securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="device-name">
              Device Name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="device-name"
              placeholder="e.g., MacBook Pro, iPhone 15"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-muted-foreground text-xs">
              Give this passkey a name to help you identify it later
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleRegister} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Registering..." : "Register Passkey"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
