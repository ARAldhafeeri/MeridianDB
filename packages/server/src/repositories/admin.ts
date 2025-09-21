import { DrizzleBaseRepository } from "./base";
import { admins } from "@/infrastructure/d1/schema";
import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";
import { like, count, eq, and } from "drizzle-orm";
import { D1Client } from "@/infrastructure/d1/connection";
import { BaseEntity } from "@/entities/domain/base";
import { Admin } from "@/entities/domain/admin";

export interface AdminFilter {
  organizationId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export class AdminRepository extends DrizzleBaseRepository<Admin, AdminFilter> {
  constructor(db: D1Client) {
    super(db);
    this.db = db;
  }

  protected table = admins;

  protected getIdColumn() {
    return admins.id;
  }

  protected getOrganizationColumn() {
    return admins.organizationId;
  }

  async find(
    filter: AdminFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Admin>> {
    let query = this.db.select().from(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(admins.organizationId, filter.organizationId));
    }
    if (filter.email) {
      conditions.push(like(admins.email, `%${filter.email}%`));
    }
    if (filter.firstName) {
      conditions.push(like(admins.firstName, `%${filter.firstName}%`));
    }
    if (filter.lastName) {
      conditions.push(like(admins.lastName, `%${filter.lastName}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const results = await query.limit(limit).offset(offset);
    const totalCount = await this.count(filter);

    const mappedResults = results.map((row: any) => ({
      id: row.id,
      organizationId: row.organizationId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      salt: row.salt,
      hash: row.hash,
      createdAt: row.createdAt ? new Date(row.createdAt) : null,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
      version: row.version,
    }));

    return {
      data: mappedResults as unknown as Admin[],
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    };
  }

  async findOne(filter: AdminFilter): Promise<Admin | null> {
    let query = this.db.select().from(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(admins.organizationId, filter.organizationId));
    }
    if (filter.email) {
      conditions.push(like(admins.email, `%${filter.email}%`));
    }
    if (filter.firstName) {
      conditions.push(like(admins.firstName, `%${filter.firstName}%`));
    }
    if (filter.lastName) {
      conditions.push(like(admins.lastName, `%${filter.lastName}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.limit(1);
    if (!result[0]) return null;

    return result[0] as unknown as Admin;
  }

  async updateMany(
    filter: AdminFilter,
    data: Partial<Omit<Admin, keyof BaseEntity>>
  ): Promise<number> {
    const updateData = { ...data, updatedAt: new Date().toISOString() };
    let query = this.db.update(this.table).set(updateData).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(admins.organizationId, filter.organizationId));
    }
    if (filter.email) {
      conditions.push(like(admins.email, `%${filter.email}%`));
    }
    if (filter.firstName) {
      conditions.push(like(admins.firstName, `%${filter.firstName}%`));
    }
    if (filter.lastName) {
      conditions.push(like(admins.lastName, `%${filter.lastName}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return (result as [])?.length;
  }

  async deleteMany(filter: AdminFilter): Promise<number> {
    let query = this.db.delete(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(admins.organizationId, filter.organizationId));
    }
    if (filter.email) {
      conditions.push(like(admins.email, `%${filter.email}%`));
    }
    if (filter.firstName) {
      conditions.push(like(admins.firstName, `%${filter.firstName}%`));
    }
    if (filter.lastName) {
      conditions.push(like(admins.lastName, `%${filter.lastName}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return result.meta.changes || 0;
  }

  async count(filter: AdminFilter): Promise<number> {
    let query = this.db.select({ count: count() }).from(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(admins.organizationId, filter.organizationId));
    }
    if (filter.email) {
      conditions.push(like(admins.email, `%${filter.email}%`));
    }
    if (filter.firstName) {
      conditions.push(like(admins.firstName, `%${filter.firstName}%`));
    }
    if (filter.lastName) {
      conditions.push(like(admins.lastName, `%${filter.lastName}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return Number(result[0]?.count) || 0;
  }
}
