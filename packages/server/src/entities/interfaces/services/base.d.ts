import { BaseEntity } from "../../domain/base";
import { PaginatedResponse, PaginationParams } from "../../domain/dto";
/**
 * Base service interface with common business logic patterns
 * All services should extend this for consistency
 */
export interface BaseService<T extends BaseEntity, TCreateRequest, TUpdateRequest, TFilter = object> {
    /**
     * Create new entity with business validation
     */
    create(request: TCreateRequest): Promise<ServiceResult<T>>;
    /**
     * Get entity by ID with access control
     */
    getById(id: string, context: ServiceContext): Promise<ServiceResult<T>>;
    /**
     * List entities with filtering and pagination
     */
    list(filter: TFilter, pagination: PaginationParams): Promise<ServiceResult<PaginatedResponse<T>>>;
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
export interface ServiceContext {
    readonly organizationId: string;
    readonly agentId?: string;
    readonly userId?: string;
    readonly permissions: string[];
    readonly requestId: string;
    readonly timestamp: Date;
}
export interface ServiceResult<T = unknown> {
    readonly success: boolean;
    readonly data?: T;
    readonly error?: ServiceError;
    readonly warnings?: string[];
    readonly metadata?: Record<string, unknown>;
}
export interface ServiceError {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
    readonly retryable: boolean;
}
export interface ValidationResult {
    readonly valid: boolean;
    readonly errors: ValidationError[];
    readonly warnings: string[];
}
export interface ValidationError {
    readonly field: string;
    readonly code: string;
    readonly message: string;
    readonly value?: unknown;
}
//# sourceMappingURL=base.d.ts.map