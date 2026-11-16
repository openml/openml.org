export interface Measure {
  measure_id?: number;
  quality_id?: number;
  proc_id?: number;
  eval_id?: number;
  name: string;
  description?: string;
  measure_type: "data_quality" | "evaluation_measure" | "estimation_procedure";
  date?: string;
  min?: number;
  max?: number;
  unit?: string;
  higherIsBetter?: boolean;
}
