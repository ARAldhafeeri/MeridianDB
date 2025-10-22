import { Agent, AgentFilter } from "@meridiandb/shared/src/entities/agent";
import { DrizzleBaseRepository } from "./base";
import { agents } from "@/infrastructure/d1/schema";
import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";
import { like, count, eq, and, desc } from "drizzle-orm";
import { D1Client } from "@/infrastructure/d1/connection";
import { BaseEntity } from "@/entities/domain/base";

export class AgentRepository extends DrizzleBaseRepository<Agent, AgentFilter> {
  constructor(db: D1Client) {
    super(db);
    this.db = db;
  }

  protected table = agents;

  protected getIdColumn() {
    return agents.id;
  }

  protected getOrganizationColumn() {
    return agents.organizationId;
  }

  async find(
    filter: AgentFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Agent>> {
    let query = this.db.select().from(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(agents.organizationId, filter.organizationId));
    }
    if (filter.name) {
      conditions.push(like(agents.name, `%${filter.name}%`));
    }
    if (filter.isActive) {
      conditions.push(eq(agents.isActive, filter.isActive as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // sort by dates for ui/ux when mutation happen such as create or update
    query.orderBy(desc(this.table.createdAt), desc(this.table.updatedAt));

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const results = await query.limit(limit).offset(offset);
    const totalCount = await this.count(filter);

    return {
      data: results as unknown as Agent[],
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    };
  }

  async findOne(filter: AgentFilter): Promise<Agent | null> {
    let query = this.db.select().from(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(agents.organizationId, filter.organizationId));
    }
    if (filter.name) {
      conditions.push(like(agents.name, `%${filter.name}%`));
    }
    if (filter.isActive) {
      conditions.push(eq(agents.isActive, filter.isActive as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.limit(1);
    if (!result[0]) return null;

    return result[0] as unknown as Agent;
  }

  async updateMany(
    filter: AgentFilter,
    data: Partial<Omit<Agent, keyof BaseEntity>>
  ): Promise<number> {
    const updateData = { ...data, updatedAt: new Date().toISOString() };
    let query = this.db.update(this.table).set(updateData).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(agents.organizationId, filter.organizationId));
    }
    if (filter.name) {
      conditions.push(like(agents.name, `%${filter.name}%`));
    }
    if (filter.isActive) {
      conditions.push(eq(agents.isActive, filter.isActive as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return (result as any).results.length;
  }

  async deleteMany(filter: AgentFilter): Promise<number> {
    let query = this.db.delete(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(agents.organizationId, filter.organizationId));
    }
    if (filter.name) {
      conditions.push(like(agents.name, `%${filter.name}%`));
    }
    if (filter.isActive) {
      conditions.push(eq(agents.isActive, filter.isActive as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return result.meta.changes || 0;
  }

  async count(filter: AgentFilter): Promise<number> {
    let query = this.db.select({ count: count() }).from(this.table).$dynamic();
    const conditions = [];

    if (filter.organizationId) {
      conditions.push(eq(agents.organizationId, filter.organizationId));
    }
    if (filter.name) {
      conditions.push(like(agents.name, `%${filter.name}%`));
    }
    if (filter.isActive) {
      conditions.push(eq(agents.isActive, filter.isActive as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return Number(result[0]?.count) || 0;
  }
}
