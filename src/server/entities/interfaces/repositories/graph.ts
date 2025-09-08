import { EdgeType } from "../../domain";
import { BaseEntity } from "../../domain/base";
import {
  EdgeFilter,
  NodeFilter,
  PaginatedResponse,
  PaginationParams,
} from "../../domain/dto";
import { GraphEdge, GraphNode } from "../../domain/graph";

/**
 * Repository for graph operations on nodes and edges
 * Implements graph-specific queries and traversals
 */
export interface GraphRepository {
  // Node operations
  createNode(node: Omit<GraphNode, keyof BaseEntity>): Promise<GraphNode>;
  findNode(id: string, organizationId?: string): Promise<GraphNode | null>;
  findNodes(
    filter: NodeFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<GraphNode>>;
  updateNode(
    id: string,
    data: Partial<GraphNode>,
    organizationId?: string
  ): Promise<GraphNode>;
  deleteNode(id: string, organizationId?: string): Promise<boolean>;

  // Edge operations
  createEdge(edge: Omit<GraphEdge, keyof BaseEntity>): Promise<GraphEdge>;
  findEdge(id: string, organizationId?: string): Promise<GraphEdge | null>;
  findEdges(
    filter: EdgeFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<GraphEdge>>;
  updateEdge(
    id: string,
    data: Partial<GraphEdge>,
    organizationId?: string
  ): Promise<GraphEdge>;
  deleteEdge(id: string, organizationId?: string): Promise<boolean>;

  // Graph traversal operations
  /**
   * Find neighbors of a node within specified hops
   */
  findNeighbors(
    nodeId: string,
    hops: number,
    edgeTypes?: EdgeType[]
  ): Promise<GraphNode[]>;

  /**
   * Find shortest path between two nodes
   */
  findShortestPath(
    sourceId: string,
    targetId: string,
    maxHops?: number
  ): Promise<GraphPath | null>;

  /**
   * Traverse graph using PageRank-like algorithm for importance scoring
   */
  calculateNodeImportance(
    organizationId: string,
    iterations?: number
  ): Promise<Record<string, number>>;

  /**
   * Find connected components in the graph
   */
  findConnectedComponents(organizationId: string): Promise<string[][]>;

  /**
   * Get subgraph around a node
   */
  getSubgraph(
    nodeId: string,
    radius: number,
    organizationId?: string
  ): Promise<SubGraph>;

  /**
   * Batch create nodes and edges for efficient graph construction
   */
  createSubgraph(
    nodes: Omit<GraphNode, keyof BaseEntity>[],
    edges: Omit<GraphEdge, keyof BaseEntity>[]
  ): Promise<SubGraph>;
}

export interface GraphPath {
  readonly nodes: GraphNode[];
  readonly edges: GraphEdge[];
  readonly totalWeight: number;
  readonly pathLength: number;
}

export interface SubGraph {
  readonly nodes: GraphNode[];
  readonly edges: GraphEdge[];
  readonly centerNodeId: string;
  readonly radius: number;
}
