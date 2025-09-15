import { BaseEntity } from "../../domain/base";
import { PaginatedResponse, PaginationParams } from "../../domain/dto";

/**
 * Base repository interface with common CRUD operations
 * All repositories should extend this for consistency
 */
export interface BaseRepository<T extends BaseEntity, TFilter = object> {
  /**
   * Create a new entity
   */
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;

  /**
   * Create multiple entities in batch
   */
  createMany(data: Omit<T, keyof BaseEntity>[]): Promise<T[]>;

  /**
   * Find entity by ID
   */
  findById(id: string, organizationId?: string): Promise<T | null>;

  /**
   * Find multiple entities by IDs
   */
  findByIds(ids: string[], organizationId?: string): Promise<T[]>;

  /**
   * Find entities with filtering and pagination
   */
  find(
    filter: TFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>>;

  /**
   * Find single entity matching filter
   */
  findOne(filter: TFilter): Promise<T | null>;

  /**
   * Update entity by ID
   */
  update(
    id: string,
    data: Partial<Omit<T, keyof BaseEntity>>,
    organizationId?: string
  ): Promise<T>;

  /**
   * Update multiple entities matching filter
   */
  updateMany(
    filter: TFilter,
    data: Partial<Omit<T, keyof BaseEntity>>
  ): Promise<number>;

  /**
   * Delete entity by ID (soft delete preferred)
   */
  delete(id: string, organizationId?: string): Promise<boolean>;

  /**
   * Delete multiple entities matching filter
   */
  deleteMany(filter: TFilter): Promise<number>;

  /**
   * Count entities matching filter
   */
  count(filter: TFilter): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(id: string, organizationId?: string): Promise<boolean>;
}
