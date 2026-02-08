import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountConfirmation } from "@/components/auth/account-confirmation";

export const metadata: Metadata = {
  title: "Confirm Account - OpenML",
  description: "Verify your OpenML account",
};

export default function ConfirmPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Account Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountConfirmation />
        </CardContent>
      </Card>
    </div>
  );
}
