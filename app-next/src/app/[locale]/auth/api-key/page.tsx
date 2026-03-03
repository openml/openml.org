import { ProfileSettings } from "@/components/auth/profile-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Key | OpenML",
  robots: { index: false },
};

export default function ApiKeyPage() {
  return <ProfileSettings />;
}
