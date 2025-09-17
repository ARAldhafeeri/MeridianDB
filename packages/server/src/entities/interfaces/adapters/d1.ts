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
 * Batched sql statements for Transactions in d1
 */

/**
 * Minimal D1 client interface used by repositories to execute SQL.
 * Implementations can be thin wrappers around Cloudflare D1 driver.
 */
export interface ID1Client {
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
   * Batched statements are SQL transactions ↗.
   *  If a statement in the sequence fails,
   * then an error is returned for that specific
   * statement, and it aborts or rolls back the
   * entire sequence.
   */
  runTransaction?(stmts: D1PreparedStatement[]): Promise<D1QueryResult>;
}
