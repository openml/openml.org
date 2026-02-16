// Centralized icon mapping for all entities
// Use these icons consistently across the entire app
import {
  faDatabase,
  faFlag,
  faCog,
  faFlask,
  faLayerGroup,
  faChartColumn,
  faTachometerAlt,
  faBookOpenReader,
  faRocket,
  faHandHoldingHeart,
  faScaleBalanced,
  faUsers,
  faCampground,
  faComments,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Entity Icons - Consistent across all components
 * These match the sidebar icons from openml.org
 */
export const ENTITY_ICONS = {
  // Main entities
  dataset: faDatabase, // Green - Datasets
  data: faDatabase, // Alias
  task: faFlag, // Yellow/Orange - Tasks
  flow: faCog, // Orange - Flows (algorithms)
  run: faFlask, // Red - Runs (experiments)

  // Collections & Benchmarks
  collection: faLayerGroup, // Purple - Collections
  collections: faLayerGroup,
  benchmark: faChartColumn, // Pink - Benchmarks
  benchmarks: faChartColumn,
  measure: faTachometerAlt, // Gray - Measures/Metrics
  measures: faTachometerAlt,

  // Learn section
  documentation: faBookOpenReader,
  docs: faBookOpenReader,
  api: faRocket,
  apis: faRocket,
  contribute: faHandHoldingHeart,
  terms: faScaleBalanced,
  citation: faScaleBalanced,

  // Community
  about: faUsers,
  aboutUs: faUsers,
  team: faUsers,
  meetup: faCampground,
  meet: faCampground,
  discussions: faComments,

  // Users
  user: faUser,
  users: faUser,
  profile: faUser,
} as const satisfies Record<string, IconDefinition>;

/**
 * Get icon for entity type
 * Falls back to database icon if not found
 */
export function getEntityIcon(entityType: string): IconDefinition {
  const key = entityType.toLowerCase() as keyof typeof ENTITY_ICONS;
  return ENTITY_ICONS[key] || ENTITY_ICONS.dataset;
}

export type EntityType = keyof typeof ENTITY_ICONS;
