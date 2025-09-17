import { BaseEntity } from "../../domain/base";
import { PaginatedResponse, PaginationParams } from "../../domain/dto";
import type {
  ServiceResult,
  ValidationResult,
} from "@meridiandb/shared/src/entities/base";
/**
 * Base service interface with common business logic patterns
 * All services should extend this for consistency
 */
export interface BaseService<
  T extends BaseEntity,
  TCreateRequest,
  TUpdateRequest,
  TFilter = object
> {
  /**
   * Create new entity with business validation
   */
  create(request: TCreateRequest): Promise<ServiceResult<T>>;

  /**
   * Get entity by ID with access control
   */
  getById(id: string): Promise<ServiceResult<T>>;

  /**
   * List entities with filtering and pagination
   */
  list(
    filter: TFilter,
    pagination: PaginationParams
  ): Promise<ServiceResult<PaginatedResponse<T>>>;

  /**
   * Update entity with validation
   */
  update(id: string, request: TUpdateRequest): Promise<ServiceResult<T>>;

  /**
   * Delete entity with cascade handling
   */
  delete(id: string): Promise<ServiceResult<boolean>>;

  /**
   * Validate entity against business rules
   */
  validate(data: Partial<T>): Promise<ValidationResult>;

  /**
   * Check access permissions
   */
  checkAccess(entityId: string, action: string): Promise<boolean>;
}

export type {
  ServiceResult,
  ValidationResult,
} from "@meridiandb/shared/src/entities/base";
