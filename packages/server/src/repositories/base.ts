import { D1Client } from "../infrastructure/d1/connection";
import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { BaseRepository } from "@/entities/interfaces/repositories/base";
import { BaseEntity } from "@meridiandb/shared/src/entities/base";
import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";

export abstract class DrizzleBaseRepository<
  T extends BaseEntity,
  TFilter = object
> implements BaseRepository<T, TFilter>
{
  protected abstract table: SQLiteTable;
  protected abstract getIdColumn(): SQLiteColumn;
  protected abstract getOrganizationColumn(): SQLiteColumn | null;

  constructor(protected db: D1Client) {}

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const entityData = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    // Type assertion is safe here as we're adding the required BaseEntity fields
    const entity = entityData as unknown as T;

    await this.db.insert(this.table).values(entityData);
    return entity;
  }

  async createMany(data: Omit<T, keyof BaseEntity>[]): Promise<T[]> {
    const entitiesData = data.map((item) => ({
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    }));

    // Type assertion is safe here as we're adding the required BaseEntity fields
    const entities = entitiesData as unknown as T[];

    await this.db.insert(this.table).values(entitiesData);
    return entities;
  }

  async findById(id: string, organizationId?: string): Promise<T | null> {
    const idColumn = this.getIdColumn();
    const orgColumn = this.getOrganizationColumn();

    const conditions = [eq(idColumn, id)];

    if (organizationId && orgColumn) {
      conditions.push(eq(orgColumn, organizationId));
    }

    const result = await this.db
      .select()
      .from(this.table)
      .where(and(...conditions))
      .limit(1);

    return (result[0] as T) || null;
  }

  async findByIds(ids: string[], organizationId?: string): Promise<T[]> {
    // Implementation would use inArray operator
    const results = [];
    for (const id of ids) {
      const item = await this.findById(id, organizationId);
      if (item) results.push(item);
    }
    return results;
  }

  abstract find(
    filter: TFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>>;

  abstract findOne(filter: TFilter): Promise<T | null>;

  async update(
    id: string,
    data: Partial<Omit<T, keyof BaseEntity>>,
    organizationId?: string
  ): Promise<T> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const idColumn = this.getIdColumn();
    const orgColumn = this.getOrganizationColumn();

    const conditions = [eq(idColumn, id)];

    if (organizationId && orgColumn) {
      conditions.push(eq(orgColumn, organizationId));
    }

    await this.db
      .update(this.table)
      .set(updateData)
      .where(and(...conditions));

    const updatedEntity = await this.findById(id, organizationId);
    if (!updatedEntity) {
      throw new Error(`Entity with id ${id} not found after update`);
    }
    return updatedEntity;
  }

  abstract updateMany(
    filter: TFilter,
    data: Partial<Omit<T, keyof BaseEntity>>
  ): Promise<number>;

  async delete(id: string, organizationId?: string): Promise<boolean> {
    const idColumn = this.getIdColumn();
    const orgColumn = this.getOrganizationColumn();

    const conditions = [eq(idColumn, id)];

    if (organizationId && orgColumn) {
      conditions.push(eq(orgColumn, organizationId));
    }

    const result = await this.db.delete(this.table).where(and(...conditions));

    return result.success;
  }

  abstract deleteMany(filter: TFilter): Promise<number>;

  abstract count(filter: TFilter): Promise<number>;

  async exists(id: string, organizationId?: string): Promise<boolean> {
    const item = await this.findById(id, organizationId);
    return item !== null;
  }
}
