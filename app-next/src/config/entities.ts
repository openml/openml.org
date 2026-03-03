import {
  type LucideIcon,
  Info, // Keeping generic icons
  BarChart3,
  CloudDownload,
  Heart,
} from "lucide-react";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ENTITY_ICONS, entityColors } from "@/constants";
// import { Icon } from "next/dist/lib/metadata/types/metadata-types";

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
  icon: IconDefinition; // FontAwesome icon
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
    icon: LucideIcon | IconDefinition; // Support both for now or migrate stats too
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
    icon: LucideIcon | IconDefinition;
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
    icon: ENTITY_ICONS.dataset,
    color: entityColors.data,
    listPath: "/datasets",
    detailPath: (id) => `/datasets/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      {
        field: "runs",
        label: "Runs",
        icon: ENTITY_ICONS.run,
        color: entityColors.run,
      },
      {
        field: "nr_of_likes",
        label: "Likes",
        icon: Heart,
        color: entityColors.collections,
      }, // Using collections/pink for generic heart/like or stick to lucide Heart? Let's check user request "use the icons... from the left menubar". Like is a generic concept, but run is an entity. Run should use ENTITY_ICONS.run. Heart is generic.
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: entityColors.terms, // Blue/Terms color for downloads? Original was #42A5F5 which matches entityColors.terms #42a5f5 (blue-400).
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
      { id: "description", label: "Description", icon: ENTITY_ICONS.dataset },
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
    icon: ENTITY_ICONS.task,
    color: entityColors.task,
    listPath: "/tasks",
    detailPath: (id) => `/tasks/${id}`,
    nameField: "source_data.name", // Tasks use dataset name
    descriptionField: "tasktype.name",
    stats: [
      {
        field: "runs",
        label: "Runs",
        icon: ENTITY_ICONS.run,
        color: entityColors.run,
      },
      {
        field: "nr_of_likes",
        label: "Likes",
        icon: Heart,
        color: entityColors.collections,
      },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: entityColors.terms,
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
      { id: "description", label: "Description", icon: ENTITY_ICONS.task },
      { id: "information", label: "Information", icon: Info },
      { id: "dataset", label: "Source Dataset", icon: ENTITY_ICONS.dataset },
      { id: "evaluation", label: "Evaluation Setup", icon: BarChart3 },
    ],
  },

  flow: {
    type: "flow",
    singular: "Flow",
    plural: "Flows",
    elasticIndex: "flow",
    idField: "flow_id",
    icon: ENTITY_ICONS.flow,
    color: entityColors.flow,
    listPath: "/flows",
    detailPath: (id) => `/flows/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      {
        field: "runs",
        label: "Runs",
        icon: ENTITY_ICONS.run,
        color: entityColors.run,
      },
      {
        field: "nr_of_likes",
        label: "Likes",
        icon: Heart,
        color: entityColors.collections,
      },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: entityColors.terms,
      },
    ],
    facets: [{ field: "licence", label: "License", type: "value" }],
    sections: [
      { id: "description", label: "Description", icon: ENTITY_ICONS.flow },
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
    icon: ENTITY_ICONS.run,
    color: entityColors.run,
    listPath: "/runs",
    detailPath: (id) => `/runs/${id}`,
    nameField: "run_flow.name",
    descriptionField: "run_task.source_data.name",
    stats: [
      {
        field: "nr_of_likes",
        label: "Likes",
        icon: Heart,
        color: entityColors.collections,
      },
      {
        field: "nr_of_downloads",
        label: "Downloads",
        icon: CloudDownload,
        color: entityColors.terms,
      },
    ],
    facets: [
      { field: "run_task.tasktype.name", label: "Task Type", type: "value" },
    ],
    sections: [
      { id: "description", label: "Description", icon: ENTITY_ICONS.run },
      { id: "information", label: "Information", icon: Info },
      { id: "task", label: "Task", icon: ENTITY_ICONS.task },
      { id: "flow", label: "Flow", icon: ENTITY_ICONS.flow },
      { id: "results", label: "Results", icon: BarChart3 },
    ],
  },

  collection: {
    type: "collection",
    singular: "Collection",
    plural: "Collections",
    elasticIndex: "study",
    idField: "study_id",
    icon: ENTITY_ICONS.collection,
    color: entityColors.collections,
    listPath: "/collections",
    detailPath: (id) => `/collections/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      {
        field: "datasets_included",
        label: "Datasets",
        icon: ENTITY_ICONS.dataset,
        color: entityColors.data,
      },
      {
        field: "tasks_included",
        label: "Tasks",
        icon: ENTITY_ICONS.task,
        color: entityColors.task,
      },
      {
        field: "flows_included",
        label: "Flows",
        icon: ENTITY_ICONS.flow,
        color: entityColors.flow,
      },
      {
        field: "runs_included",
        label: "Runs",
        icon: ENTITY_ICONS.run,
        color: entityColors.run,
      },
    ],
    facets: [{ field: "study_type", label: "Collection Type", type: "value" }],
    sections: [
      {
        id: "description",
        label: "Description",
        icon: ENTITY_ICONS.collection,
      },
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
    icon: ENTITY_ICONS.benchmark,
    color: entityColors.benchmarks,
    listPath: "/benchmarks",
    detailPath: (id) => `/benchmarks/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [
      {
        field: "tasks_included",
        label: "Tasks",
        icon: ENTITY_ICONS.task,
        color: entityColors.task,
      },
      {
        field: "runs_included",
        label: "Runs",
        icon: ENTITY_ICONS.run,
        color: entityColors.run,
      },
    ],
    facets: [],
    sections: [
      { id: "description", label: "Description", icon: ENTITY_ICONS.benchmark },
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
    icon: ENTITY_ICONS.measure,
    color: entityColors.measures,
    listPath: "/measures",
    detailPath: (id) => `/measures/${id}`,
    nameField: "name",
    descriptionField: "description",
    stats: [],
    facets: [],
    sections: [
      { id: "description", label: "Description", icon: ENTITY_ICONS.measure },
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
 * Translation keys for i18n
 *
 * To be translated:
 * - Entity names (singular/plural)
 * - Section labels
 * - Stat labels
 * - Facet labels
 *
 *  NOT translated:
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
