import { getD1 } from "./context";
import { INDEXES, SCHEMAS, TABLES, TABLE_NAMES } from "./schemas";

/**
 * Check if all required tables exist
 * Fast check that short-circuits if any table is missing
 */
const checkTablesExist = async (): Promise<boolean | null> => {
  try {
    const d1 = getD1();

    // Use a single query to check for all tables
    const placeholders = TABLE_NAMES.map(() => "?").join(", ");
    const query = `
      SELECT COUNT(*) as count 
      FROM sqlite_master 
      WHERE type = 'table' 
      AND name IN (${placeholders})
    `;

    const result = await d1
      .prepare(query)
      .bind(...TABLE_NAMES)
      .first();

    return result && (result as any).count === TABLE_NAMES.length;
  } catch (error) {
    console.error("Error checking table existence:", error);
    return false;
  }
};

/**
 * Initialize database schema with batched operations
 */
export const initSchema = async (): Promise<boolean> => {
  try {
    const d1 = getD1();

    // Fast check: if all tables exist, skip initialization
    const tablesExist = await checkTablesExist();
    if (tablesExist) {
      console.log("All tables already exist, skipping schema initialization");
      return true;
    }

    console.log("Initializing database schema with batched operations...");

    // Collect all SQL statements for batch execution
    const batchStatements = [];

    // Add table creation statements in optimal order
    const tableCreationOrder = [
      TABLES.organizations,
      TABLES.admins,
      TABLES.agents,
      TABLES.memories,
    ];

    for (const tableName of tableCreationOrder) {
      batchStatements.push(d1.prepare(SCHEMAS[tableName]));

      // Add index creation statements for this table
      for (const indexQuery of INDEXES[tableName]) {
        batchStatements.push(d1.prepare(indexQuery));
      }
    }

    // Execute all statements in a single batch
    const results = await d1.batch(batchStatements);

    // Check if any operation failed
    const hasErrors = results.some((result) => result.error);
    if (hasErrors) {
      console.error("Some schema operations failed:", results);
      return false;
    }

    console.log(
      "Database schema initialized successfully with batch operations"
    );
    return true;
  } catch (error) {
    console.error("Failed to initialize schema:", error);
    return false;
  }
};

/**
 * Drop all tables with batched operations (for testing/development only)
 */
export const dropAllTables = async (): Promise<boolean> => {
  try {
    const d1 = getD1();

    // Collect all drop statements
    const dropStatements = [];

    // Drop tables in reverse order (children first)
    const dropOrder = [
      TABLES.memories,
      TABLES.agents,
      TABLES.admins,
      TABLES.organizations,
    ];

    for (const tableName of dropOrder) {
      dropStatements.push(d1.prepare(`DROP TABLE IF EXISTS ${tableName}`));
    }

    // Execute all drop statements in batch
    const results = await d1.batch(dropStatements);

    const hasErrors = results.some((result) => result.error);
    if (hasErrors) {
      console.error("Some drop operations failed:", results);
      return false;
    }

    console.log("All tables dropped successfully with batch operations");
    return true;
  } catch (error) {
    console.error("Failed to drop tables:", error);
    return false;
  }
};
