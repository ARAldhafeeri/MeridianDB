import { AccessLevel, EdgeType, NodeType } from ".";
import { BaseEntity } from "./base";

/**
 * Graph node representing knowledge entities
 */
export interface GraphNode extends BaseEntity {
  // identification
  readonly type: NodeType;
  readonly organizationId: string;
  readonly agentId?: string;
  readonly label: string;
  // meta data
  readonly properties: Record<string, unknown>;
  readonly importance: number; // 0-1 scale for consolidation priority
  readonly accessLevel: AccessLevel;
  readonly vectorId?: string; // Reference to Vectorize embedding
}

/**
 * Graph edge representing relationships
 */
export interface GraphEdge extends BaseEntity {
  // identification
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: EdgeType;
  readonly organizationId: string;
  readonly agentId?: string;
  // metadata
  readonly weight: number; // Relationship strength
  readonly confidence: number; // Certainty of relationship
  readonly properties: Record<string, unknown>;
  readonly accessLevel: AccessLevel;
  readonly decayRate: number; // For temporal forgetting
  readonly lastAccessedAt?: Date;
}
