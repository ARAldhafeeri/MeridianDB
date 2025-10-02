import { Agent } from "@meridiandb/shared/src/entities/agent";
import { TemporalMessage } from "@meridiandb/shared/src/queue/entities/domain/queue";
import { ITemporalQueueConsumeHandler } from "@meridiandb/shared/src/queue/entities/interfaces/IRequestHandler";
import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";

class ConsumerHandler implements ITemporalQueueConsumeHandler {
  constructor(
    private dependencies: {
      d1: D1Database;
    }
  ) {}

  /**
   * Calculates a recency score with configurable parameters
   *
   * @param {number} accessCount - Total number of accesses
   * @param {number} lastAccessed - Timestamp of last access (ms)
   * @param {Object} options - Configuration options
   * @returns {number} Score between 0-100
   */
  calculateRecencyScore(
    accessCount: number,
    lastAccessed: number,
    options = {}
  ) {
    // Default configuration (can be overridden)
    const config = {
      baseScore: 100,
      halfLifeHours: 168, // 7 days (was 72)
      timeWeight: 0.6, // Weight for recency (was 0.7)
      frequencyWeight: 0.4, // Weight for frequency (was 0.3)
      frequencyDamping: 4, // Divisor for frequency boost (was 3)
      decayFloor: 0.1, // Minimum decay value (10%)
      decayCurve: "exponential", // 'exponential', 'polynomial', or 'hybrid'
      ...options,
    };

    const now = Date.now();
    const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);

    // Calculate time decay based on selected curve
    let timeDecay;
    switch (config.decayCurve) {
      case "polynomial":
        // Gentler initial decay, steeper later
        timeDecay =
          1 / (1 + Math.pow(hoursSinceAccess / config.halfLifeHours, 2));
        break;

      case "hybrid":
        // Exponential with a floor to prevent complete decay
        timeDecay = Math.max(
          config.decayFloor,
          Math.exp(-hoursSinceAccess / config.halfLifeHours)
        );
        break;

      case "exponential":
      default:
        timeDecay = Math.exp(-hoursSinceAccess / config.halfLifeHours);
    }

    // Logarithmic frequency boost (prevents domination by frequent accesses)
    const frequencyBoost = Math.log10(accessCount + 1);

    // Combine components with configurable weights
    const rawScore =
      config.baseScore *
      (config.timeWeight * timeDecay +
        config.frequencyWeight * (frequencyBoost / config.frequencyDamping));

    // Normalize to 0-100 scale
    return Math.min(100, Math.max(0, rawScore));
  }

  /**
   * Get Agent or return null
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    // Input validation
    if (!agentId || typeof agentId !== "string") {
      throw new Error("agentId is missing or malformed");
    }

    try {
      // Use parameterized query to prevent SQL injection
      const agent = await this.dependencies.d1
        .prepare(`SELECT agent FROM agents WHERE id = ?;`)
        .bind(agentId)
        .run();

      // Validate query result
      if (!agent || !agent.results || agent.results.length === 0) {
        throw new Error("Agent not found");
      }

      return agent.results[0] as unknown as Agent;
    } catch (error) {
      // Log the error for monitoring
      console.error(`Database error for agentId ${agentId}:`, error);

      // Re-throw with appropriate message (avoid leaking DB details)
      if (error instanceof Error) {
        throw new Error("Database operation failed");
      }
      throw error;
    }
  }
  /**
   * Update multiple messages temporal features with effecient d1 query.
   * If the batch fail, the retry is handled implicitly by fail handler
   * in schedule tick operations.
   * @param messages queue messages with temporal feature data
   */
  async handle(batch: TemporalMessage): Promise<void> {
    if (!batch.data.agentId || typeof batch.data.agentId !== "string") {
      throw new Error("agentId is missing or malformed");
    }

    const memoryIds = batch.data.memories; // Just array of IDs

    if (!memoryIds || memoryIds.length === 0) {
      return;
    }

    // most accurate date when all memories where retreived.
    const accessedAt = batch.createdAt || Date.now();

    // Fetch current state of memories in one
    const [agent, memoriesResult] = await Promise.all([
      this.getAgent(batch.data.agentId),
      this.dependencies.d1
        .prepare(
          `SELECT id, accessFrequency, lastAccessedAt 
         FROM memory_episodes 
         WHERE id IN (${memoryIds}) AND agentId = ?`
        )
        .bind(...memoryIds, batch.data.agentId)
        .all(),
    ]);

    const memories = memoriesResult.results as unknown as MemoryEpisode[];
    // fail the entire batch
    if (memories.length === 0) {
      throw new Error("No memories found for update");
    }

    const statements: D1PreparedStatement[] = [];

    for (const memory of memories) {
      // Calculate recency with CURRENT DB values
      const newRecency = this.calculateRecencyScore(
        memory.accessFrequency || 0,
        memory.lastAccessedAt
          ? new Date(memory.lastAccessedAt).getTime()
          : accessedAt,
        {
          halfLifeHours: agent?.halfLifeHours || 168,
          timeWeight: agent?.timeWeight || 0.6,
          frequencyWeight: agent?.frequencyWeight || 0.4,
          decayCurve: agent?.decayCurve || "hybrid",
        }
      );

      const stmt = this.dependencies.d1
        .prepare(
          `UPDATE memory_episodes 
           SET recencyScore = ?,
               accessFrequency = accessFrequency + 1,
               lastAccessedAt = datetime(?, 'unixepoch', 'subsec'),
               updatedAt = CURRENT_TIMESTAMP,
               version = version + 1
           WHERE id = ? AND agentId = ?`
        )
        .bind(newRecency, accessedAt / 1000, memory.id, batch.data.agentId);

      statements.push(stmt);
    }

    try {
      const results = await this.dependencies.d1.batch(statements);

      for (let i = 0; i < results.length; i++) {
        if (!results[i].success) {
          throw new Error(`Failed to update memory at index ${i}`);
        }
      }
    } catch (error) {
      console.error("Batch update failed:", error);
      throw new Error("Transaction rolled back: failed to update memories");
    }
  }
}
export default ConsumerHandler;
