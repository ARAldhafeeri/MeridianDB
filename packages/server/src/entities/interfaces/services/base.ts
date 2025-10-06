import { BaseEntity } from "../../domain/base";
import { PaginatedResponse, PaginationParams } from "../../domain/dto";

/**
 * Base service interface with common business logic patterns
 * All services should extend this for consistency
 */
export interface BaseService<T extends BaseEntity, TFilter = object> {
  /**
   * Create new entity with business validation
   */
  create(request: T): Promise<T>;

  /**
   * Get entity by ID with access control
   */
  getById(id: string): Promise<T>;

  /**
   * List entities with filtering and pagination
   */
  list(
    filter: TFilter,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<T>>;

  /**
   * Update entity with validation
   */
  update(id: string, request: Omit<T, keyof BaseEntity>): Promise<T>;

  /**
   * Delete entity with cascade handling
   */
  delete(id: string): Promise<boolean>;

}

export type {
  ServiceResult,
  ValidationResult,
} from "@meridiandb/shared/src/entities/base";
