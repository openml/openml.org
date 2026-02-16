import { setRequestLocale } from "next-intl/server";
import { UserProfilePage } from "@/components/user/user-profile-page";
import type { Metadata } from "next";

// Dynamic SEO metadata for user profiles
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // Fetch basic user info for metadata
  try {
    const response = await fetch(
      `https://www.openml.org/api/v1/json/user/${id}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );

    if (response.ok) {
      const data = await response.json();
      const user = data.user;
      const fullName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username ||
        `User ${id}`;

      return {
        title: `${fullName} - OpenML Contributor`,
        description: `${fullName}'s profile on OpenML. View their datasets, flows, runs, and contributions to the machine learning community.`,
        openGraph: {
          title: `${fullName} - OpenML`,
          description: `${fullName}'s contributions to OpenML`,
          type: "profile",
          url: `https://www.openml.org/users/${id}`,
          images: user.image ? [{ url: user.image }] : undefined,
        },
        twitter: {
          card: "summary",
          title: `${fullName} - OpenML`,
          description: `${fullName}'s ML contributions`,
        },
      };
    }
  } catch {
    // Fall through to default metadata
  }

  return {
    title: `User ${id} - OpenML`,
    description: `View user profile and contributions on OpenML.`,
  };
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <UserProfilePage userId={id} />;
}
