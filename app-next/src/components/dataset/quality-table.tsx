"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QualityTableProps {
  qualities: Record<string, number>;
}

/**
 * QualityTable Component
 *
 * Displays dataset quality metrics (meta-features) in a searchable table.
 * Client Component for interactive search and sorting.
 */
export function QualityTable({ qualities }: QualityTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Convert qualities object to array
  const qualityEntries = Object.entries(qualities).map(([name, value]) => ({
    name,
    value,
  }));

  // Filter and sort
  const filteredQualities = qualityEntries
    .filter((q) => q.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Categorize qualities for better organization
  const categorizeQuality = (name: string): string => {
    if (name.startsWith("NumberOf")) return "Counts";
    if (name.includes("Mean") || name.includes("Std")) return "Statistics";
    if (name.includes("Entropy") || name.includes("Mutual"))
      return "Information Theory";
    if (name.includes("Dimensionality") || name.includes("Ratio"))
      return "Ratios";
    return "Other";
  };

  // Group by category
  const categorized = filteredQualities.reduce(
    (acc, quality) => {
      const category = categorizeQuality(quality.name);
      if (!acc[category]) acc[category] = [];
      acc[category].push(quality);
      return acc;
    },
    {} as Record<string, typeof qualityEntries>,
  );

  // Format quality name for display
  const formatQualityName = (name: string): string => {
    // Add spaces before capital letters
    return name
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^Number Of/, "Number of");
  };

  // Format value for display
  const formatValue = (value: number): string => {
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    // For decimals, show up to 4 significant digits
    if (Math.abs(value) < 0.0001) {
      return value.toExponential(3);
    }
    return value.toFixed(4);
  };

  const totalQualities = qualityEntries.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {totalQualities} Quality Metric{totalQualities !== 1 ? "s" : ""}{" "}
          (Meta-features)
        </CardTitle>
        <CardDescription>
          Statistical characteristics and meta-features of the dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search quality metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Results count */}
        {searchTerm && (
          <p className="text-muted-foreground text-sm">
            Showing {filteredQualities.length} of {totalQualities} metrics
          </p>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                >
                  Quality Name
                </TableHead>
                <TableHead className="w-32 text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(categorized).map(([category, qualities]) => (
                <>
                  {/* Category Header */}
                  <TableRow
                    key={`category-${category}`}
                    className="bg-muted/50"
                  >
                    <TableCell colSpan={2} className="text-sm font-semibold">
                      {category}
                    </TableCell>
                  </TableRow>

                  {/* Category Items */}
                  {qualities.map((quality) => (
                    <TableRow key={quality.name}>
                      <TableCell className="font-medium">
                        {formatQualityName(quality.name)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatValue(quality.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}

              {filteredQualities.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground text-center"
                  >
                    No quality metrics found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
