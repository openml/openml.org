"use client";

import { Search } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
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
import { useDebouncedCallback } from "@/hooks/use-debounce";

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

  // Strip locale prefix for route matching (handles /en/datasets, /nl/tasks, etc.)
  const effectivePath = useMemo(() => {
    return pathname.replace(/^\/[a-z]{2}\//, "/");
  }, [pathname]);

  // Derive selected index from URL pathname
  const selectedIndex = useMemo(() => {
    const currentIndex = searchIndices.find((index) =>
      effectivePath.startsWith(index.route),
    );
    return currentIndex?.key ?? "data";
  }, [effectivePath]);

  // Get the query from URL - this is the source of truth
  const urlQuery = searchParams.get("q") || "";

  // Local input state for responsive typing
  const [inputValue, setInputValue] = useState(urlQuery);

  // Sync input with URL when it changes externally (back/forward navigation, direct link)
  useEffect(() => {
    if (urlQuery !== inputValue) {
      setInputValue(urlQuery);
    }
    // Only run when urlQuery changes, not inputValue (prevents loop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  // When on a search sub-tab (e.g. /datasets/runs), preserve that sub-path so
  // searching stays on the same tab. Detail pages (e.g. /datasets/47155) always
  // fall back to the root search route.
  const getRoute = useCallback(
    (indexKey: string): string => {
      const index = searchIndices.find((i) => i.key === indexKey);
      if (!index) return "/";
      if (!effectivePath.startsWith(index.route)) return index.route;
      // Only preserve sub-paths that look like named tabs (no numeric/slug IDs).
      // e.g. /datasets/runs ✅  — /datasets/47155 ❌  — /measures/wall-clock-time ❌
      const subPath = effectivePath.slice(index.route.length);
      const nextSegment = subPath.split("/").filter(Boolean)[0] ?? "";
      const isDetailPage = nextSegment !== "" && !/^[a-z]+$/.test(nextSegment);
      return isDetailPage ? index.route : effectivePath;
    },
    [effectivePath],
  );

  // Debounced navigation - centralized and predictable
  const debouncedNavigate = useDebouncedCallback(
    (value: string, route: string) => {
      if (!value.trim()) return;
      // Use replace to avoid polluting history while typing
      router.replace(`${route}?q=${encodeURIComponent(value)}`);
    },
    700,
  );

  // Handle input change - update local state immediately, navigate after debounce
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      if (newValue.trim()) {
        debouncedNavigate(newValue, getRoute(selectedIndex));
      }
    },
    [selectedIndex, getRoute, debouncedNavigate],
  );

  // Handle form submit (Enter key) - navigate immediately
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        router.push(`${getRoute(selectedIndex)}?q=${encodeURIComponent(inputValue)}`);
      }
    },
    [inputValue, selectedIndex, getRoute, router],
  );

  // Handle index (entity type) change
  const handleIndexChange = useCallback(
    (value: string) => {
      const route = getRoute(value);
      if (inputValue.trim()) {
        router.push(`${route}?q=${encodeURIComponent(inputValue)}`);
      } else {
        router.push(route);
      }
    },
    [inputValue, getRoute, router],
  );

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
          value={inputValue}
          onChange={handleInputChange}
          className="border-none bg-transparent! pl-2 text-slate-900! shadow-none placeholder:text-slate-500! focus-visible:ring-0"
        />
      </div>
    </form>
  );
}
