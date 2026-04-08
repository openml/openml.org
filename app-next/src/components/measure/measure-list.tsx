import { getElasticsearchUrl } from "@/lib/elasticsearch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Gauge } from "lucide-react";

interface Measure {
  quality_id?: number;
  proc_id?: number;
  eval_id?: number;
  name: string;
  description?: string;
  date?: string;
  min?: number;
  max?: number;
  unit?: string;
  higherIsBetter?: boolean;
}

interface MeasureListProps {
  measureType: "evaluation_measure" | "estimation_procedure" | "data_quality";
}

async function fetchMeasures(measureType: string): Promise<Measure[]> {
  const url = getElasticsearchUrl("measure/_search");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {
        bool: {
          filter: [{ term: { measure_type: measureType } }],
        },
      },
      size: 200,
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const measures = (data.hits?.hits || []).map(
    (hit: { _source: Measure }) => hit._source,
  );
  return measures.sort((a: Measure, b: Measure) =>
    a.name.localeCompare(b.name),
  );
}

export async function MeasureList({ measureType }: MeasureListProps) {
  const measures = await fetchMeasures(measureType);

  if (measures.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No measures found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {measures.map((measure, index) => {
        const id = measure.eval_id || measure.proc_id || measure.quality_id;

        return (
          <Card key={id || index} className="hover:border-primary/30 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-3">
                <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold">{measure.name}</h3>
                  {measure.description && (
                    <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                      {measure.description}
                    </p>
                  )}
                  <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {measure.higherIsBetter !== undefined && (
                      <span className="flex items-center gap-1">
                        {measure.higherIsBetter ? (
                          <ArrowUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-500" />
                        )}
                        {measure.higherIsBetter
                          ? "Higher is better"
                          : "Lower is better"}
                      </span>
                    )}
                    {measure.min !== undefined && (
                      <span>Min: {measure.min}</span>
                    )}
                    {measure.max !== undefined && (
                      <span>Max: {measure.max}</span>
                    )}
                    {measure.unit && <span>Unit: {measure.unit}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
