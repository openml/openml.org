"use client";

import { ArrowUp, ArrowDown, Ruler, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Measure } from "@/types/measure";

const MEASURE_TYPE_LABELS: Record<string, string> = {
  data_quality: "Data Quality",
  evaluation_measure: "Evaluation Measure",
  estimation_procedure: "Estimation Procedure",
};

interface MeasureDescriptionSectionProps {
  measure: Measure;
}

export function MeasureDescriptionSection({
  measure,
}: MeasureDescriptionSectionProps) {
  const typeLabel =
    MEASURE_TYPE_LABELS[measure.measure_type] || measure.measure_type;

  const hasProperties =
    measure.higherIsBetter !== undefined ||
    measure.min !== undefined ||
    measure.max !== undefined ||
    measure.unit;

  return (
    <div className="space-y-6">
      {/* Description */}
      {measure.description && (
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed">{measure.description}</p>
        </div>
      )}

      {/* Properties Grid */}
      {hasProperties && (
        <Card>
          <CardContent className="pt-5 pb-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Properties
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Type */}
              <div className="flex items-start gap-2">
                <Tag className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="text-sm font-medium">{typeLabel}</p>
                </div>
              </div>

              {/* Direction */}
              {measure.higherIsBetter !== undefined && (
                <div className="flex items-start gap-2">
                  {measure.higherIsBetter ? (
                    <ArrowUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  ) : (
                    <ArrowDown className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs">Direction</p>
                    <p className="text-sm font-medium">
                      {measure.higherIsBetter
                        ? "Higher is better"
                        : "Lower is better"}
                    </p>
                  </div>
                </div>
              )}

              {/* Range */}
              {(measure.min !== undefined || measure.max !== undefined) && (
                <div className="flex items-start gap-2">
                  <Ruler className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Range</p>
                    <p className="text-sm font-medium">
                      {measure.min !== undefined ? measure.min : "–"} to{" "}
                      {measure.max !== undefined ? measure.max : "–"}
                    </p>
                  </div>
                </div>
              )}

              {/* Unit */}
              {measure.unit && (
                <div className="flex items-start gap-2">
                  <Ruler className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Unit</p>
                    <p className="text-sm font-medium">{measure.unit}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
