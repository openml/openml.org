import {
  Calendar,
  Hash,
  ArrowUp,
  ArrowDown,
  Ruler,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS } from "@/constants/entityIcons";
import { Badge } from "@/components/ui/badge";
import type { Measure } from "@/types/measure";
import { entityColors } from "@/constants/entityColors";

const MEASURE_TYPE_LABELS: Record<string, string> = {
  data_quality: "Data Quality",
  evaluation_measure: "Evaluation Measure",
  estimation_procedure: "Estimation Procedure",
};

interface MeasureHeaderProps {
  measure: Measure;
}

export function MeasureHeader({ measure }: MeasureHeaderProps) {
  const measureId =
    measure.eval_id || measure.proc_id || measure.quality_id || measure.measure_id;
  const typeLabel =
    MEASURE_TYPE_LABELS[measure.measure_type] || measure.measure_type;

  const uploadDate = measure.date
    ? new Date(measure.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <header className="space-y-6 border-b p-0">
      {/* LINE 1: Icon + Title */}
      <div className="flex items-start gap-3">
        <div
          className="flex shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <FontAwesomeIcon
            icon={ENTITY_ICONS.measure}
            size="3x"
            style={{ color: entityColors.measures }}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {measure.name}
          </h1>

          {/* LINE 2: ID badge, type, date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {measureId !== undefined && (
              <Badge
                variant="default"
                className="flex items-center gap-0.5 border-0 px-2 py-0.5 text-xs font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: entityColors.measures }}
              >
                <Hash className="h-3 w-3" />
                {measureId}
              </Badge>
            )}

            <Badge variant="outline" className="text-xs">
              {typeLabel}
            </Badge>

            {uploadDate && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{uploadDate}</span>
              </div>
            )}
          </div>

          {/* LINE 3: Properties */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
            {measure.higherIsBetter !== undefined && (
              <div className="flex items-center gap-1">
                {measure.higherIsBetter ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span>
                  {measure.higherIsBetter
                    ? "Higher is better"
                    : "Lower is better"}
                </span>
              </div>
            )}

            {measure.min !== undefined && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Ruler className="h-4 w-4 text-gray-500" />
                <span>Min: {measure.min}</span>
              </div>
            )}

            {measure.max !== undefined && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Ruler className="h-4 w-4 text-gray-500" />
                <span>Max: {measure.max}</span>
              </div>
            )}

            {measure.unit && (
              <div className="text-muted-foreground">Unit: {measure.unit}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
