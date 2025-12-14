"use client";

import * as React from "react";
import { Plus, Database, Target, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
 */
export function CreateMenu() {
  const t = useTranslations("header");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="hidden cursor-pointer gap-2 border-2 border-slate-700 bg-transparent py-3 font-semibold text-slate-700 hover:bg-slate-700 hover:text-white md:inline-flex"
        >
          <Plus className="size-6" />
          <span>{t("addNew")}</span>
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
