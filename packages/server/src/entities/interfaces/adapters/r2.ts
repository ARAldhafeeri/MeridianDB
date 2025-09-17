/**
 * Adapter contract for interacting with Cloudflare R2 (object storage).
 */

export interface R2Object {
  key: string;
  size: number;
  etag: string;
  uploaded: Date;
  httpMetadata?: any;
  customMetadata?: any;
}

export interface R2PutOptions {
  httpMetadata?: any;
  customMetadata?: any;
  md5?: string;
  sha1?: string;
  sha256?: string;
  sha384?: string;
  sha512?: string;
}

export interface R2QueryResult {
  success: boolean;
  object?: R2Object | null;
  body?: any;
}

export interface R2ListResult {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

/**
 * Minimal R2 client interface used by repositories to execute operations.
 */
export interface IR2Client {
  /**
   * Get an object by key
   */
  get(key: string): Promise<R2QueryResult>;

  /**
   * Put an object with optional metadata
   */
  put(
    key: string,
    value: any,
    opts?: R2PutOptions
  ): Promise<{ success: boolean }>;

  /**
   * Delete an object by key
   */
  delete(key: string): Promise<{ success: boolean }>;

  /**
   * List objects with optional prefix and cursor
   */
  list(opts?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
    include?: ("httpMetadata" | "customMetadata")[];
  }): Promise<R2ListResult>;

  /**
   * Head operation to get metadata without body
   */
  head(key: string): Promise<R2QueryResult>;
}
