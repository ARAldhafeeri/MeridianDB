import {
  Organization,
  OrganizationFilter,
} from "@meridiandb/shared/src/entities/organization";
import { DrizzleBaseRepository } from "./base";
import { organizations } from "@/infrastructure/d1/schema";
import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";
import { like, count, asc } from "drizzle-orm";
import { D1Client } from "@/infrastructure/d1/connection";
import { BaseEntity } from "@/entities/domain/base"; // Make sure to import BaseEntity

export class OrganizationRepository extends DrizzleBaseRepository<
  Organization,
  OrganizationFilter
> {
  constructor(db: D1Client) {
    super(db);
    this.db = db;
  }

  protected table = organizations;

  protected getIdColumn() {
    return organizations.id;
  }

  protected getOrganizationColumn() {
    return null;
  }

  async find(
    filter: OrganizationFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Organization>> {
    let query = this.db.select().from(this.table).$dynamic();

    if (filter.name) {
      query = query.where(like(organizations.name, `%${filter.name}%`));
    }
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const results = await query.limit(limit).offset(offset);
    const totalCount = await this.count(filter);

    // Map the results to Organization type
    const mappedResults = results.map((row: any) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt ? new Date(row.createdAt) : null,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
      version: row.version,
      // Add any other properties from Organization entity
    }));

    return {
      data: mappedResults as unknown as Organization[],
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    };
  }

  async findOne(filter: OrganizationFilter): Promise<Organization | null> {
    let query = this.db.select().from(this.table).$dynamic();

    if (filter.name) {
      query = query.where(like(organizations.name, `%${filter.name}%`));
    }

    const result = await query.limit(1);
    if (!result[0]) return null;

    return result[0] as unknown as Organization;
  }

  async updateMany(
    filter: OrganizationFilter,
    data: Partial<Omit<Organization, keyof BaseEntity>>
  ): Promise<number> {
    const updateData = { ...data, updatedAt: new Date().toISOString() };
    let result = await this.db
      .update(this.table)
      .set(updateData)
      .where(like(organizations.name, `%${filter.name}%`));

    return result.results.length;
  }

  async deleteMany(filter: OrganizationFilter): Promise<number> {
    let query = this.db.delete(this.table).$dynamic();

    if (filter.name) {
      query = query.where(like(organizations.name, `%${filter.name}%`));
    }

    const result = await query;
    return result.meta.changes || 0;
  }

  async count(filter: OrganizationFilter): Promise<number> {
    let query = this.db.select({ count: count() }).from(this.table).$dynamic();

    if (filter.name) {
      query = query.where(like(organizations.name, `%${filter.name}%`));
    }

    const result = await query;
    return Number(result[0]?.count) || 0;
  }
}
