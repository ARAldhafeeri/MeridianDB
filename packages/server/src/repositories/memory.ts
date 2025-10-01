import { DrizzleBaseRepository } from "./base";
import { memoryEpisodes } from "@/infrastructure/d1/schema";
import { PaginatedResponse, PaginationParams } from "@/entities/domain/dto";
import { inArray, count, eq, and, gte, or } from "drizzle-orm";
import { D1Client } from "@/infrastructure/d1/connection";
import { BaseEntity } from "@/entities/domain/base";
import {
  MemoryEpisode,
  MemoryEpisodeFilter,
} from "@meridiandb/shared/src/entities/memory";

export class MemoryEpisodeRepository extends DrizzleBaseRepository<
  MemoryEpisode,
  MemoryEpisodeFilter
> {
  constructor(db: D1Client) {
    super(db);
    this.db = db;
  }

  protected table = memoryEpisodes;

  protected getIdColumn() {
    return memoryEpisodes.id;
  }

  protected getOrganizationColumn() {
    return memoryEpisodes.organizationId;
  }

  async find(
    filter: MemoryEpisodeFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<MemoryEpisode>> {
    const conditions = this.buildWhereConditions(filter);
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const results = await this.db
      .select()
      .from(this.table)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const totalCount = await this.count(filter);

    const mappedResults = results.map((row: any) => ({
      id: row.id,
      agentId: row.agentId,
      organizationId: row.organizationId,
      content: row.content,
      conceptTags: row.conceptTags,
      recencyScore: row.recencyScore,
      accessFrequency: row.accessFrequency,
      lastAccessedAt: row.lastAccessedAt
        ? new Date(row.lastAccessedAt)
        : undefined,
      isFactual: row.isFactual,
      isIrrelevant: row.isIrrelevant,
      environment: row.environment,
      taskType: row.taskType,
      extra: row.extra,
      successRate: row.successRate,
      positive: row.positive,
      negative: row.negative,
      createdAt: row.createdAt ? new Date(row.createdAt) : null,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
      version: row.version,
    }));

    return {
      data: mappedResults as unknown as MemoryEpisode[],
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    };
  }

  async findOne(filter: MemoryEpisodeFilter): Promise<MemoryEpisode | null> {
    const conditions = this.buildWhereConditions(filter);
    let result = await this.db
      .select()
      .from(this.table)
      .where(and(...conditions))
      .limit(1);

    if (!result[0]) return null;

    return result[0] as unknown as MemoryEpisode;
  }

  async updateMany(
    filter: MemoryEpisodeFilter,
    data: Partial<Omit<MemoryEpisode, keyof BaseEntity>>
  ): Promise<number> {
    const updateData = { ...data, updatedAt: new Date().toISOString() };

    const conditions = this.buildWhereConditions(filter);
    if (conditions.length === 0) {
      throw new Error(
        "At least one filter condition is required for updateMany"
      );
    }

    const result = await this.db
      .update(this.table)
      .set(updateData as any)
      .where(and(...conditions));

    return result.results.length;
  }

  async deleteMany(filter: MemoryEpisodeFilter): Promise<number> {
    const conditions = this.buildWhereConditions(filter);
    if (conditions.length === 0) {
      throw new Error(
        "At least one filter condition is required for deleteMany"
      );
    }

    const result = await this.db.delete(this.table).where(and(...conditions));

    return result.meta.changes || 0;
  }

  async count(filter: MemoryEpisodeFilter): Promise<number> {
    const conditions = this.buildWhereConditions(filter);
    let result = await this.db
      .select({ count: count() })
      .from(this.table)
      .where(and(...conditions));

    return Number(result[0]?.count) || 0;
  }

  buildWhereConditions(filter: MemoryEpisodeFilter) {
    const conditions = [];

    // base filters
    if (filter.agentId) {
      conditions.push(eq(memoryEpisodes.agentId, filter.agentId));
    }
    if (filter.ids) {
      conditions.push(inArray(memoryEpisodes.id, filter.ids));
    }
    if (filter.organizationId) {
      conditions.push(eq(memoryEpisodes.organizationId, filter.organizationId));
    }

    if (typeof filter.isIrrelevant === "boolean") {
      // always exclude irrelevant data
      conditions.push(eq(memoryEpisodes.isIrrelevant, false));
    }

    // temporal with factual check
    if (typeof filter.stabilityThreshold === "number") {
      conditions.push(
        or(
          eq(memoryEpisodes.isFactual, true), // Include factual regardless of stability
          and(
            eq(memoryEpisodes.isFactual, false),
            gte(memoryEpisodes.recencyScore, filter.stabilityThreshold)
          )
        )
      );
    }

    // behavioral success rate of using this memory
    if (typeof filter.successRate === "number") {
      conditions.push(gte(memoryEpisodes.successRate, filter.successRate));
    }

    return conditions;
  }
}
