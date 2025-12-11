/**
 * 🎯 Entity Components
 *
 * Generic components that work with any OpenML entity type.
 * Configured through EntityConfig from @/config/entities
 *
 * USAGE:
 * import { EntityHeader, EntityDescription, EntityMetadataGrid, EntityToc } from '@/components/entity';
 * import { entityConfigs } from '@/config/entities';
 *
 * <EntityHeader config={entityConfigs.task} entity={task} stats={...} />
 * <EntityDescription config={entityConfigs.task} entity={task} />
 */

export { EntityHeader } from "./entity-header";
export { EntityDescription } from "./entity-description";
export { EntityMetadataGrid } from "./entity-metadata-grid";
export type { MetadataItem } from "./entity-metadata-grid";
export { EntityToc } from "./entity-toc";
