import { getD1, getOrgId } from "@/config/context";
import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";
import { BaseRepository } from "@/entities/interfaces/repositories/base";
import { BaseEntity } from "@meridiandb/shared/src/entities/base";
import { SQL, SQLStatement } from "sql-template-strings";

/**
 * Base D1 repository implementation with common CRUD operations
 * All D1 repositories should extend this for consistency
 */
export abstract class D1BaseRepository<T extends BaseEntity, TFilter = object>
  implements BaseRepository<T, TFilter>
{
  protected abstract tableName: string;
  protected abstract schema: string;

  /**
   * Convert entity to database row (remove BaseEntity fields)
   */
  protected abstract toRow(
    entity: Omit<T, keyof BaseEntity> | Partial<Omit<T, keyof BaseEntity>>
  ): Record<string, any>;

  /**
   * Convert database row to entity
   */
  protected abstract fromRow(row: any): T;

  /**
   * Build WHERE clause from filter
   */
  protected abstract buildWhereClause(filter: TFilter): SQLStatement;

  /**
   * Create a new entity
   */
  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const now = new Date().toISOString();
    const orgId = getOrgId();

    const row = {
      ...this.toRow(data),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...(orgId && { organizationId: orgId }),
    };

    const columns = Object.keys(row).join(", ");
    const placeholders = Object.keys(row)
      .map(() => "?")
      .join(", ");
    const values = Object.values(row);

    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

    const result = await getD1()
      .prepare(query)
      .bind(...values)
      .first();

    if (!result) {
      throw new Error("Failed to create entity");
    }

    return this.fromRow(result);
  }

  /**
   * Create multiple entities in batch
   */
  async createMany(data: Omit<T, keyof BaseEntity>[]): Promise<T[]> {
    if (data.length === 0) return [];

    const now = new Date().toISOString();
    const orgId = getOrgId();
    const rows = data.map((item) => ({
      ...this.toRow(item),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...(orgId && { organizationId: orgId }),
    }));

    const columns = Object.keys(rows[0]).join(", ");
    const placeholders = rows
      .map(
        () =>
          `(${Object.keys(rows[0])
            .map(() => "?")
            .join(", ")})`
      )
      .join(", ");

    const values = rows.flatMap((row) => Object.values(row));

    const query = `
      INSERT INTO ${this.tableName} (${columns}) 
      VALUES ${placeholders} 
      RETURNING *
    `;

    const result = await getD1()
      .prepare(query)
      .bind(...values)
      .all();

    if (!result.results) {
      throw new Error("Failed to create entities");
    }

    return result.results.map((row) => this.fromRow(row));
  }

  /**
   * Find entity by ID
   */
  async findById(id: string, organizationId?: string): Promise<T | null> {
    const orgId = organizationId || getOrgId();
    let query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const params: any[] = [id];

    if (orgId) {
      query += " AND organizationId = ?";
      params.push(orgId);
    }

    const result = await getD1()
      .prepare(query)
      .bind(...params)
      .first();

    return result ? this.fromRow(result) : null;
  }

  /**
   * Find multiple entities by IDs
   */
  async findByIds(ids: string[], organizationId?: string): Promise<T[]> {
    if (ids.length === 0) return [];

    const orgId = organizationId || getOrgId();
    let query = `SELECT * FROM ${this.tableName} WHERE id IN (${ids
      .map(() => "?")
      .join(", ")})`;
    const params: any[] = [...ids];

    if (orgId) {
      query += " AND organizationId = ?";
      params.push(orgId);
    }

    const result = await getD1()
      .prepare(query)
      .bind(...params)
      .all();

    return result.results ? result.results.map((row) => this.fromRow(row)) : [];
  }

  /**
   * Find entities with filtering and pagination
   */
  async find(
    filter: TFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const whereClause = this.buildWhereClause(filter);
    const orgId = getOrgId();

    let query = SQL`SELECT * FROM ${this.tableName} WHERE `;

    if (orgId) {
      query.append(SQL`organizationId = ${orgId} AND `);
    }

    query.append(whereClause);

    // Count total
    const countQuery = SQL`SELECT COUNT(*) as total FROM ${this.tableName} WHERE `;

    if (orgId) {
      countQuery.append(SQL`organizationId = ${orgId} AND `);
    }

    countQuery.append(whereClause);

    const countResult = await getD1()
      .prepare(countQuery.text)
      .bind(...countQuery.values)
      .first();
    const total = countResult ? (countResult as any).total : 0;

    // Apply pagination
    if (pagination) {
      const { page = 1, limit = 50 } = pagination;
      const offset = (page - 1) * limit;

      query.append(SQL` LIMIT ${limit} OFFSET ${offset}`);
    }

    query.append(SQL` ORDER BY createdAt DESC`);

    const result = await getD1()
      .prepare(query.text)
      .bind(...query.values)
      .all();
    const items = result.results
      ? result.results.map((row) => this.fromRow(row))
      : [];

    return {
      data: items,
      pagination: {
        page: pagination?.page || 1,
        limit: pagination?.limit || items.length,
        total,
      },
    };
  }

  /**
   * Find single entity matching filter
   */
  async findOne(filter: TFilter): Promise<T | null> {
    const whereClause = this.buildWhereClause(filter);
    const orgId = getOrgId();

    let query = SQL`SELECT * FROM ${this.tableName} WHERE `;

    if (orgId) {
      query.append(SQL`organizationId = ${orgId} AND `);
    }

    query.append(whereClause);
    query.append(SQL` LIMIT 1`);

    const result = await getD1()
      .prepare(query.text)
      .bind(...query.values)
      .first();

    return result ? this.fromRow(result) : null;
  }

  /**
   * Update entity by ID
   */
  async update(
    id: string,
    data: Partial<Omit<T, keyof BaseEntity>>,
    organizationId?: string
  ): Promise<T> {
    const orgId = organizationId || getOrgId();
    const updateData = this.toRow(data);
    const now = new Date().toISOString();

    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .concat("updatedAt = ?")
      .join(", ");

    const values = [...Object.values(updateData), now];

    let query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    values.push(id);

    if (orgId) {
      query += " AND organizationId = ?";
      values.push(orgId);
    }

    query += " RETURNING *";

    const result = await getD1()
      .prepare(query)
      .bind(...values)
      .first();

    if (!result) {
      throw new Error("Entity not found or update failed");
    }

    return this.fromRow(result);
  }

  /**
   * Update multiple entities matching filter
   */
  async updateMany(
    filter: TFilter,
    data: Partial<Omit<T, keyof BaseEntity>>
  ): Promise<number> {
    const whereClause = this.buildWhereClause(filter);
    const orgId = getOrgId();
    const updateData = this.toRow(data);
    const now = new Date().toISOString();

    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .concat("updatedAt = ?")
      .join(", ");

    const values = [...Object.values(updateData), now];

    let query = SQL`UPDATE ${this.tableName} SET ${setClause} WHERE `;

    if (orgId) {
      query.append(SQL`organizationId = ${orgId} AND `);
    }

    query.append(whereClause);

    // Convert SQLStatement to regular query
    const fullQuery = query.text.replace("${setClause}", setClause);
    const allValues = [...values, ...query.values];

    const result = await getD1()
      .prepare(fullQuery)
      .bind(...allValues)
      .run();

    return result.meta.changes || 0;
  }

  /**
   * Delete entity by ID (soft delete preferred)
   */
  async delete(id: string, organizationId?: string): Promise<boolean> {
    const orgId = organizationId || getOrgId();

    let query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const params: any[] = [id];

    if (orgId) {
      query += " AND organizationId = ?";
      params.push(orgId);
    }

    const result = await getD1()
      .prepare(query)
      .bind(...params)
      .run();

    return result.meta.changes > 0;
  }

  /**
   * Delete multiple entities matching filter
   */
  async deleteMany(filter: TFilter): Promise<number> {
    const whereClause = this.buildWhereClause(filter);
    const orgId = getOrgId();

    let query = SQL`DELETE FROM ${this.tableName} WHERE `;

    if (orgId) {
      query.append(SQL`organizationId = ${orgId} AND `);
    }

    query.append(whereClause);

    const result = await getD1()
      .prepare(query.text)
      .bind(...query.values)
      .run();

    return result.meta.changes || 0;
  }

  /**
   * Count entities matching filter
   */
  async count(filter: TFilter): Promise<number> {
    const whereClause = this.buildWhereClause(filter);
    const orgId = getOrgId();

    let query = SQL`SELECT COUNT(*) as count FROM ${this.tableName} WHERE `;

    if (orgId) {
      query.append(SQL`organizationId = ${orgId} AND `);
    }

    query.append(whereClause);

    const result = await getD1()
      .prepare(query.text)
      .bind(...query.values)
      .first();

    return result ? (result as any).count : 0;
  }

  /**
   * Check if entity exists
   */
  async exists(id: string, organizationId?: string): Promise<boolean> {
    const orgId = organizationId || getOrgId();

    let query = `SELECT 1 FROM ${this.tableName} WHERE id = ?`;
    const params: any[] = [id];

    if (orgId) {
      query += " AND organizationId = ?";
      params.push(orgId);
    }

    query += " LIMIT 1";

    const result = await getD1()
      .prepare(query)
      .bind(...params)
      .first();

    return !!result;
  }
}
