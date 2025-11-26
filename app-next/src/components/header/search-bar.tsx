"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Enhanced Search Bar Component - Integrated Design
 *
 * TERMINOLOGY:
 * - "Integrated design": Dropdown is embedded INSIDE the search bar (single visual unit)
 * - "Composite component": Multiple UI elements (dropdown + input) working as one
 * - "Absolute positioning": Dropdown positioned within the search bar container
 *
 * Features:
 * - Index selector dropdown embedded in search bar
 * - Dynamic search with URL integration
 * - Responsive design
 */

const searchIndices = [
  { key: "data", label: "Datasets", route: "/datasets" },
  { key: "task", label: "Tasks", route: "/tasks" },
  { key: "flow", label: "Flows", route: "/flows" },
  { key: "run", label: "Runs", route: "/runs" },
  { key: "collection", label: "Collections", route: "/collections" },
  { key: "benchmark", label: "Benchmarks", route: "/benchmarks" },
  { key: "measure", label: "Measures", route: "/measures" },
];

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState("data");
  const [searchQuery, setSearchQuery] = useState("");

  // Update selected index based on current route
  useEffect(() => {
    const currentIndex = searchIndices.find((index) =>
      pathname.startsWith(index.route),
    );
    if (currentIndex) {
      setSelectedIndex(currentIndex.key);
    }
  }, [pathname]);

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

  const currentIndexLabel =
    searchIndices.find((i) => i.key === selectedIndex)?.label || "Datasets";

  return (
    <form onSubmit={handleSearch} className="max-w-2xl flex-1">
      {/* 
        INTEGRATED SEARCH BAR DESIGN:
        - Single container with rounded border
        - Dropdown on the left (embedded)
        - Search icon in the middle
        - Input field on the right
      */}
      <div className="bg-muted/50 border-input relative flex items-center overflow-hidden rounded-md border">
        {/* Index Selector - Embedded on the left */}
        <Select value={selectedIndex} onValueChange={handleIndexChange}>
          <SelectTrigger className="h-10 w-[130px] border-none bg-transparent shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {searchIndices.map((index) => (
              <SelectItem key={index.key} value={index.key}>
                {index.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Vertical Divider */}
        <div className="bg-border h-6 w-px" />

        {/* Search Icon */}
        <Search className="text-muted-foreground ml-3 h-4 w-4 shrink-0" />

        {/* Search Input - Takes remaining space */}
        <Input
          type="search"
          placeholder={`Search ${currentIndexLabel.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none bg-transparent pl-2 shadow-none focus-visible:ring-0"
        />
      </div>
    </form>
  );
}
