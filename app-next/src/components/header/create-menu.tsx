"use client";

import * as React from "react";
import { Plus, Database, Target, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Create Menu - Client Component
 * Dropdown menu for creating new content (datasets, tasks, collections)
 * Now with full i18n support
 * Only visible when user is logged in
 */
export function CreateMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("header");

  // Hide menu if user is not authenticated
  if (status === "loading" || !session) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="openml"
          size="sm"
          className="group mr-0 cursor-pointer gap-2 border-0 bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-slate-500/30 transition-all duration-300 hover:scale-105 hover:from-slate-700 hover:to-slate-800 hover:shadow-xl hover:shadow-slate-600/40 md:mr-2"
        >
          <Plus className="size-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="hidden md:inline-flex">{t("addNew")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("createMenu.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/datasets/upload" className="flex items-center">
            <Database className="mr-2 size-6" />
            <span>{t("createMenu.uploadDataset")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/tasks/create" className="flex items-center">
            <Target className="mr-2 size-6" />
            <span>{t("createMenu.defineTask")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/collections/create" className="flex items-center">
            <FolderPlus className="mr-2 size-6" />
            <span>{t("createMenu.createCollection")}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
