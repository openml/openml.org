"use client";

import * as React from "react";
import { Plus, Database, Target, FolderPlus } from "lucide-react";
import Link from "next/link";
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
 */
export function CreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="hidden gap-2 md:inline-flex"
        >
          <Plus className="h-4 w-4" />
          <span>Add new</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/datasets/upload" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            <span>Upload Dataset</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/tasks/create" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            <span>Define Task</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/collections/create" className="flex items-center">
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>New Collection</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
