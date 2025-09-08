import {
  AccessLevel,
  ConsolidationStage,
  EdgeType,
  NodeType,
  SimilarityType,
} from ".";
import { EmbeddingContext } from "./vector";

/**
 * Pagination parameters
 */
export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
  readonly cursor?: string;
  readonly sortBy?: string;
  readonly sortOrder?: "asc" | "desc";
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
    readonly nextCursor?: string;
    readonly prevCursor?: string;
  };
}

/**
 * Query filters for various entities
 */
export interface NodeFilter {
  readonly type?: NodeType[];
  readonly organizationId?: string;
  readonly agentId?: string;
  readonly accessLevel?: AccessLevel[];
  readonly importanceMin?: number;
  readonly importanceMax?: number;
  readonly createdAfter?: Date;
  readonly createdBefore?: Date;
  readonly hasVector?: boolean;
}

export interface EdgeFilter {
  readonly type?: EdgeType[];
  readonly sourceId?: string;
  readonly targetId?: string;
  readonly organizationId?: string;
  readonly agentId?: string;
  readonly weightMin?: number;
  readonly weightMax?: number;
  readonly confidenceMin?: number;
}

/**
 * Parameters used in performing vector search in victorize
 */
export interface VectorSearchParams {
  readonly query: number[] | string; // embedding vector or text to embed
  readonly limit?: number;
  readonly threshold?: number;
  readonly includeMetadata?: boolean;
  readonly filter?: VectorFilter;
  readonly similarityTypes?: SimilarityType[];
}

/**
 * Vector database filter
 */
export interface VectorFilter {
  readonly organizationId?: string;
  readonly agentId?: string;
  readonly stage?: ConsolidationStage[];
  readonly importanceMin?: number;
  readonly nodeTypes?: NodeType[];
  readonly accessLevel?: AccessLevel[];
}

/**
 * Multi-dimensional similarity search request
 */
export interface AdvancedSearchRequest {
  readonly query: string | number[];
  readonly semanticWeight: number; // 0-1
  readonly temporalWeight: number; // 0-1
  readonly contextualWeight: number; // 0-1
  readonly behavioralWeight: number; // 0-1
  readonly limit: number;
  readonly threshold?: number;
  readonly contextHints?: EmbeddingContext;
  readonly excludeIds?: string[];
  readonly organizationId: string;
  readonly agentId?: string;
}

/**
 * Memory consolidation request
 */
export interface ConsolidationRequest {
  readonly agentId: string;
  readonly organizationId: string;
  readonly batchSize?: number;
  readonly importanceThreshold?: number;
  readonly timeWindow?: number; // hours
  readonly forceFullConsolidation?: boolean;
}
