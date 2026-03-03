import { UsersSearchPage } from "@/components/search/users/users-search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - OpenML Community",
  description:
    "Browse OpenML community members and their contributions to open machine learning.",
};

export default function UsersPage() {
  return <UsersSearchPage />;
}
