import { ProfileSettings } from "@/components/auth/profile-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | OpenML",
  robots: { index: false },
};

export default function ProfilePage() {
  return <ProfileSettings />;
}
