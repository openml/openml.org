"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  total: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  page,
  total,
  pageSize,
  loading = false,
  onPageChange,
}: PaginationControlsProps) {
  // Use userProfile namespace for now as it contains existing pagination keys
  // In a future refactor, these should be moved to a 'common' namespace
  const t = useTranslations("userProfile");

  if (total <= pageSize) return null;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || loading}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        {t("pagination.previous")}
      </Button>
      <span className="text-muted-foreground text-sm">
        {t("pagination.pageOf", { page, totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || loading}
      >
        {t("pagination.next")}
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
