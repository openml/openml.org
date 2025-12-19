"use client";

import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

const searchIndices = [
  { key: "data", labelKey: "datasets", route: "/datasets" },
  { key: "task", labelKey: "tasks", route: "/tasks" },
  { key: "flow", labelKey: "flows", route: "/flows" },
  { key: "run", labelKey: "runs", route: "/runs" },
  { key: "collection", labelKey: "collections", route: "/collections" },
  { key: "benchmark", labelKey: "benchmarks", route: "/benchmarks" },
  { key: "measure", labelKey: "measures", route: "/measures" },
];

export function SearchBar() {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState("data");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update selected index based on current route
  useEffect(() => {
    const currentIndex = searchIndices.find((index) =>
      pathname.startsWith(index.route),
    );
    if (currentIndex) {
      setSelectedIndex(currentIndex.key);
    }
  }, [pathname]);

  // Sync search input with URL query parameter on mount and route changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setSearchQuery(urlQuery);
  }, [pathname]); // Only sync on pathname change, not every searchParams change

  // Auto-search when debounced query changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";

    // Navigate if debounced query is different from current URL
    if (debouncedSearchQuery && debouncedSearchQuery !== urlQuery) {
      const currentIndex = searchIndices.find((i) => i.key === selectedIndex);
      if (currentIndex) {
        router.push(
          `${currentIndex.route}?q=${encodeURIComponent(debouncedSearchQuery)}`,
        );
      }
    }
  }, [debouncedSearchQuery, selectedIndex, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const currentIndex = searchIndices.find((i) => i.key === selectedIndex);
      if (currentIndex) {
        router.push(
          `${currentIndex.route}?q=${encodeURIComponent(searchQuery)}`,
        );
      }
    }
  };

  const handleIndexChange = (value: string) => {
    setSelectedIndex(value);
    // If there's an active search, navigate to the new index with the same query
    if (searchQuery.trim()) {
      const newIndex = searchIndices.find((i) => i.key === value);
      if (newIndex) {
        router.push(`${newIndex.route}?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl flex-1">
      <div className="relative flex items-center overflow-hidden rounded-md border border-slate-300 bg-slate-100! text-slate-900!">
        {/* Index Selector - Embedded on the left */}
        <Select value={selectedIndex} onValueChange={handleIndexChange}>
          <SelectTrigger className="h-10 w-[130px] border-none bg-transparent! text-slate-900! shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {searchIndices.map((index) => (
              <SelectItem key={index.key} value={index.key}>
                {t(`searchIndices.${index.labelKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-300" />

        {/* Search Icon */}
        <Search className="ml-3 h-4 w-4 shrink-0 text-slate-600" />

        {/* Search Input - Takes remaining space */}
        <Input
          type="search"
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none bg-transparent! pl-2 text-slate-900! shadow-none placeholder:text-slate-500! focus-visible:ring-0"
        />
      </div>
    </form>
  );
}
