/**
 * Repository for R2 object storage operations
 * Handles backups, artifacts, and large data objects
 */
export interface StorageRepository {
  /**
   * Store object with metadata
   */
  store(
    key: string,
    data: Uint8Array | string,
    metadata?: Record<string, string>
  ): Promise<StorageObject>;

  /**
   * Retrieve object by key
   */
  retrieve(key: string): Promise<StorageObject | null>;

  /**
   * Delete object
   */
  delete(key: string): Promise<boolean>;

  /**
   * List objects with prefix
   */
  list(
    prefix?: string,
    limit?: number,
    cursor?: string
  ): Promise<StorageListResult>;

  /**
   * Get object metadata only
   */
  getMetadata(key: string): Promise<Record<string, string> | null>;

  /**
   * Generate signed URL for direct access
   */
  generateSignedUrl(key: string, expiresIn: number): Promise<string>;

  /**
   * Create backup of graph/vector data
   */
  createBackup(
    organizationId: string,
    type: "full" | "incremental"
  ): Promise<BackupResult>;

  /**
   * Restore from backup
   */
  restoreBackup(
    backupId: string,
    organizationId: string
  ): Promise<RestoreResult>;

  /**
   * Store memory consolidation artifacts
   */
  storeConsolidationArtifact(
    agentId: string,
    data: ConsolidationArtifact
  ): Promise<string>;

  /**
   * Retrieve consolidation artifacts
   */
  getConsolidationArtifacts(
    agentId: string,
    limit?: number
  ): Promise<ConsolidationArtifact[]>;
}

export interface StorageObject {
  readonly key: string;
  readonly data: Uint8Array;
  readonly metadata: Record<string, string>;
  readonly size: number;
  readonly contentType: string;
  readonly lastModified: Date;
  readonly etag: string;
}

export interface StorageListResult {
  readonly objects: Array<{
    key: string;
    size: number;
    lastModified: Date;
    etag: string;
  }>;
  readonly hasMore: boolean;
  readonly nextCursor?: string;
}

export interface BackupResult {
  readonly backupId: string;
  readonly type: "full" | "incremental";
  readonly size: number;
  readonly checksum: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;
}

export interface RestoreResult {
  readonly success: boolean;
  readonly restoredObjects: number;
  readonly errors: string[];
  readonly duration: number;
}

export interface ConsolidationArtifact {
  readonly agentId: string;
  readonly timestamp: Date;
  readonly type: "episode_batch" | "graph_snapshot" | "vector_delta";
  readonly data: unknown;
  readonly metadata: Record<string, unknown>;
}
