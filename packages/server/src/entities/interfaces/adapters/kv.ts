/**
 * Adapter contract for interacting with Cloudflare KV (key-value store).
 */

export interface KVValue {
  value: any;
  metadata?: any;
  expiration?: number;
  expirationTtl?: number;
}

export interface KVListResult {
  keys: Array<{
    name: string;
    expiration?: number;
    metadata?: any;
  }>;
  list_complete: boolean;
  cursor?: string;
}

export interface KVQueryResult {
  success: boolean;
  value?: any;
  metadata?: any;
}

/**
 * Minimal KV client interface used by repositories to execute operations.
 */
export interface IKVClient {
  /**
   * Get a value by key
   */
  get(
    key: string,
    opts?: { type?: "text" | "json" | "arrayBuffer" | "stream" }
  ): Promise<KVQueryResult>;

  /**
   * Put a value with optional metadata and expiration
   */
  put(
    key: string,
    value: any,
    opts?: {
      metadata?: any;
      expiration?: number;
      expirationTtl?: number;
    }
  ): Promise<{ success: boolean }>;

  /**
   * Delete a key
   */
  delete(key: string): Promise<{ success: boolean }>;

  /**
   * List keys with optional prefix and cursor
   */
  list(opts?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<KVListResult>;
}
