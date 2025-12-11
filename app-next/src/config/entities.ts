/**
 * 🎯 Entity Configuration System
 *
 * Central configuration for all OpenML entities (datasets, tasks, flows, runs, etc.)
 * This prevents code duplication and makes it easy to add new entity types.
 */

import {
  FlaskConical,
  Heart,
  CloudDownload,
  BarChart3,
  Info,
  Database,
  Trophy,
  Cog,
  Play,
} from "lucide-react";

export type EntityType =
  | "dataset"
  | "task"
  | "flow"
  | "run"
  | "collection"
  | "benchmark"
  | "measure";

export interface EntityConfig {
  // Identity
  type: EntityType;
  singular: string;
  plural: string;

  // API
  elasticIndex: string;
  idField: string;

  // Display
  icon: any; // Lucide icon component
  color: string;

  // Routes
  listPath: string;
  detailPath: (id: string) => string;

  // Search fields
  nameField: string;
  descriptionField: string;

  // Stats to display
  stats: Array<{
    field: string;
    label: string;
    icon: any;
    color: string;
  }>;

  // Facets for filtering
  facets: Array<{
    field: string;
    label: string;
    type: "value" | "range";
  }>;

  // Detail page sections
  sections: Array<{
    id: string;
    label: string;
    icon: any;
    component?: string; // Optional override component
  }>;
}

/**
 * 🎨 Entity Configurations
 */
export const entityConfigs: Record<EntityType, EntityConfig> = {
  dataset: {
    type: "dataset",
    singular: "Dataset",
    plural: "Datasets",
    elasticIndex: "data",
    idField: "data_id",
    icon: Database,
    color: "#66BB6A",
    listPath: "/datasets",
    detailPath: (id) => `/datasets/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      { field: "runs", label: "Runs", icon: FlaskConical, color: "#EF5350" },
      { field: "nr_of_likes", label: "Likes", icon: Heart, color: "#AB47BC" },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: "#42A5F5",
      },
      {
        field: "NumberOfInstances",
        label: "Instances",
        icon: BarChart3,
        color: "#9E9E9E",
      },
      {
        field: "NumberOfFeatures",
        label: "Features",
        icon: BarChart3,
        color: "#9E9E9E",
      },
    ],
    facets: [
      { field: "status", label: "Status", type: "value" },
      { field: "licence", label: "License", type: "value" },
      { field: "NumberOfInstances", label: "Size", type: "range" },
      { field: "NumberOfFeatures", label: "Features", type: "range" },
    ],
    sections: [
      { id: "description", label: "Description", icon: Database },
      { id: "information", label: "Information", icon: Info },
      {
        id: "features",
        label: "Features",
        icon: BarChart3,
        component: "FeatureTable",
      },
      {
        id: "qualities",
        label: "Qualities",
        icon: BarChart3,
        component: "QualityTable",
      },
    ],
  },

  task: {
    type: "task",
    singular: "Task",
    plural: "Tasks",
    elasticIndex: "task",
    idField: "task_id",
    icon: Trophy,
    color: "#FFA726",
    listPath: "/tasks",
    detailPath: (id) => `/tasks/${id}`,
    nameField: "source_data.name", // Tasks use dataset name
    descriptionField: "tasktype.name",
    stats: [
      { field: "runs", label: "Runs", icon: FlaskConical, color: "#EF5350" },
      { field: "nr_of_likes", label: "Likes", icon: Heart, color: "#AB47BC" },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: "#42A5F5",
      },
    ],
    facets: [
      { field: "tasktype.name", label: "Task Type", type: "value" },
      {
        field: "estimation_procedure.name",
        label: "Estimation Procedure",
        type: "value",
      },
      {
        field: "evaluation_measures",
        label: "Evaluation Measures",
        type: "value",
      },
    ],
    sections: [
      { id: "description", label: "Description", icon: Trophy },
      { id: "information", label: "Information", icon: Info },
      { id: "dataset", label: "Source Dataset", icon: Database },
      { id: "evaluation", label: "Evaluation Setup", icon: BarChart3 },
    ],
  },

  flow: {
    type: "flow",
    singular: "Flow",
    plural: "Flows",
    elasticIndex: "flow",
    idField: "flow_id",
    icon: Cog,
    color: "#5C6BC0",
    listPath: "/flows",
    detailPath: (id) => `/flows/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      { field: "runs", label: "Runs", icon: FlaskConical, color: "#EF5350" },
      { field: "nr_of_likes", label: "Likes", icon: Heart, color: "#AB47BC" },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: "#42A5F5",
      },
    ],
    facets: [{ field: "licence", label: "License", type: "value" }],
    sections: [
      { id: "description", label: "Description", icon: Cog },
      { id: "information", label: "Information", icon: Info },
      { id: "parameters", label: "Parameters", icon: BarChart3 },
      { id: "dependencies", label: "Dependencies", icon: BarChart3 },
    ],
  },

  run: {
    type: "run",
    singular: "Run",
    plural: "Runs",
    elasticIndex: "run",
    idField: "run_id",
    icon: Play,
    color: "#EF5350",
    listPath: "/runs",
    detailPath: (id) => `/runs/${id}`,
    nameField: "run_flow.name",
    descriptionField: "run_task.source_data.name",
    stats: [
      { field: "nr_of_likes", label: "Likes", icon: Heart, color: "#AB47BC" },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: "#42A5F5",
      },
    ],
    facets: [
      { field: "run_task.tasktype.name", label: "Task Type", type: "value" },
    ],
    sections: [
      { id: "description", label: "Description", icon: Play },
      { id: "information", label: "Information", icon: Info },
      { id: "task", label: "Task", icon: Trophy },
      { id: "flow", label: "Flow", icon: Cog },
      { id: "results", label: "Results", icon: BarChart3 },
    ],
  },

  collection: {
    type: "collection",
    singular: "Collection",
    plural: "Collections",
    elasticIndex: "study",
    idField: "study_id",
    icon: Database,
    color: "#26A69A",
    listPath: "/collections",
    detailPath: (id) => `/collections/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      {
        field: "datasets_included",
        label: "Datasets",
        icon: Database,
        color: "#66BB6A",
      },
      {
        field: "tasks_included",
        label: "Tasks",
        icon: Trophy,
        color: "#FFA726",
      },
      { field: "flows_included", label: "Flows", icon: Cog, color: "#5C6BC0" },
      {
        field: "runs_included",
        label: "Runs",
        icon: FlaskConical,
        color: "#EF5350",
      },
    ],
    facets: [{ field: "study_type", label: "Collection Type", type: "value" }],
    sections: [
      { id: "description", label: "Description", icon: Database },
      { id: "information", label: "Information", icon: Info },
      { id: "contents", label: "Contents", icon: BarChart3 },
    ],
  },

  benchmark: {
    type: "benchmark",
    singular: "Benchmark",
    plural: "Benchmarks",
    elasticIndex: "study",
    idField: "study_id",
    icon: Trophy,
    color: "#FF7043",
    listPath: "/benchmarks",
    detailPath: (id) => `/benchmarks/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      {
        field: "tasks_included",
        label: "Tasks",
        icon: Trophy,
        color: "#FFA726",
      },
      {
        field: "runs_included",
        label: "Runs",
        icon: FlaskConical,
        color: "#EF5350",
      },
    ],
    facets: [],
    sections: [
      { id: "description", label: "Description", icon: Trophy },
      { id: "information", label: "Information", icon: Info },
      { id: "results", label: "Results", icon: BarChart3 },
    ],
  },

  measure: {
    type: "measure",
    singular: "Measure",
    plural: "Measures",
    elasticIndex: "measure",
    idField: "measure_id",
    icon: BarChart3,
    color: "#78909C",
    listPath: "/measures",
    detailPath: (id) => `/measures/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [],
    facets: [],
    sections: [
      { id: "description", label: "Description", icon: BarChart3 },
      { id: "information", label: "Information", icon: Info },
    ],
  },
};

/**
 * 🔧 Helper functions
 */
export const getEntityConfig = (type: EntityType): EntityConfig => {
  return entityConfigs[type];
};

export const getEntityIcon = (type: EntityType) => {
  return entityConfigs[type].icon;
};

export const getEntityColor = (type: EntityType): string => {
  return entityConfigs[type].color;
};

export const getEntityPath = (type: EntityType, id?: string): string => {
  const config = entityConfigs[type];
  return id ? config.detailPath(id) : config.listPath;
};

/**
 * 🌍 Translation keys for i18n
 *
 * These should be translated:
 * - Entity names (singular/plural)
 * - Section labels
 * - Stat labels
 * - Facet labels
 *
 * These should NOT be translated:
 * - Field names (API keys)
 * - Filter values (these come from API)
 * - IDs
 */
export const getTranslationKeys = (type: EntityType) => {
  const config = entityConfigs[type];
  return {
    singular: `entity.${type}.singular`,
    plural: `entity.${type}.plural`,
    sections: config.sections.map((s) => `entity.${type}.section.${s.id}`),
    stats: config.stats.map((s) => `entity.${type}.stat.${s.field}`),
    facets: config.facets.map((f) => `entity.${type}.facet.${f.field}`),
  };
};
