"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * Search Bar Component - Client Component
 * Full-width search with icon
 */
export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/datasets?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search datasets, tasks, flows, runs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-muted/50 w-full border-none pl-10 focus-visible:ring-1"
        />
      </div>
    </form>
  );
}
