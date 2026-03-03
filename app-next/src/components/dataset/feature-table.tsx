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
import { Badge } from "@/components/ui/badge";
import type { DatasetFeature } from "@/types/dataset";

interface FeatureTableProps {
  features: DatasetFeature[];
}

/**
 * FeatureTable Component
 *
 * Displays dataset features with their types, distributions, and statistics.
 * Client Component for interactive sorting and filtering.
 */
export function FeatureTable({ features }: FeatureTableProps) {
  const [sortField, setSortField] = useState<keyof DatasetFeature | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort features
  const sortedFeatures = [...features].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === undefined || bVal === undefined) return 0;

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: keyof DatasetFeature) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get type badge variant
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "numeric":
        return <Badge variant="default">Numeric</Badge>;
      case "nominal":
        return <Badge variant="secondary">Nominal</Badge>;
      case "string":
        return <Badge variant="outline">String</Badge>;
      case "date":
        return <Badge variant="outline">Date</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          {features.length} Feature{features.length !== 1 ? "s" : ""}
        </CardTitle>
        <CardDescription>
          Detailed information about each feature in the dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSort("index")}
                >
                  #
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Feature Name
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  Type
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer text-right"
                  onClick={() => handleSort("distinct")}
                >
                  Distinct
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer text-right"
                  onClick={() => handleSort("missing")}
                >
                  Missing
                </TableHead>
                <TableHead className="text-right">Statistics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFeatures.map((feature) => (
                <TableRow
                  key={feature.index}
                  className={
                    feature.target === "1"
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }
                >
                  <TableCell className="font-mono text-sm">
                    {feature.index}
                  </TableCell>
                  <TableCell className="font-medium">
                    {feature.name}
                    {feature.target === "1" && (
                      <Badge variant="default" className="ml-2">
                        Target
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getTypeBadge(feature.type)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {feature.distinct?.toLocaleString() ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {feature.missing?.toLocaleString() ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-sm">
                    {feature.type === "numeric" && (
                      <div className="space-y-0.5">
                        {feature.min && (
                          <div>
                            <span className="text-xs">min:</span>{" "}
                            {parseFloat(feature.min).toFixed(2)}
                          </div>
                        )}
                        {feature.max && (
                          <div>
                            <span className="text-xs">max:</span>{" "}
                            {parseFloat(feature.max).toFixed(2)}
                          </div>
                        )}
                        {feature.mean && (
                          <div>
                            <span className="text-xs">mean:</span>{" "}
                            {parseFloat(feature.mean).toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
