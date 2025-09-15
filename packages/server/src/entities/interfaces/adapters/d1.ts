/**
 * Adapter contract for interacting with Cloudflare D1 (relational / property graph layer).
 * The actual implementation will wrap D1 prepared statements / transactions.
 *
 * All methods are interface-only; no implementation here.
 */

/** Generic low-level row result */
export interface D1Row {
  [column: string]: any;
}

/** Simple query result */
export interface D1QueryResult {
  success: boolean;
  rows?: D1Row[];
  lastInsertId?: string | number | null;
}

/**
 * Minimal D1 client interface used by repositories to execute SQL.
 * Implementations can be thin wrappers around Cloudflare D1 driver.
 */
export interface D1Client {
  /**
   * Execute a parameterized SQL query and return rows.
   * Implementations should honor targetLatencyMs hints where possible.
   */
  query(
    sql: string,
    params?: any[],
    opts?: { targetLatencyMs?: number }
  ): Promise<D1QueryResult>;

  /**
   * Begin a transaction. Returns a transaction handle (opaque).
   * The transaction handle type is left as 'any' to preserve adapter flexibility.
   */
  beginTransaction?(): Promise<any>;

  /** Commit a transaction */
  commitTransaction?(tx: any): Promise<void>;

  /** Rollback transaction */
  rollbackTransaction?(tx: any): Promise<void>;
}
