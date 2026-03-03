import { AccountPage } from "@/components/auth/account-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | OpenML",
  robots: { index: false },
};

export default function Account() {
  return <AccountPage />;
}
