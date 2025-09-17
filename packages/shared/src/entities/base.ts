/**
 * Base entity interface - all domain objects extend this
 */
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

export interface ServiceResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ServiceError;
  readonly warnings?: string[];
  readonly metadata?: Record<string, unknown>;
}

export interface ServiceContext {
  readonly organizationId: string;
  readonly agentId?: string;
  readonly userId?: string;
  readonly permissions: string[];
  readonly requestId: string;
  readonly timestamp: Date;
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
