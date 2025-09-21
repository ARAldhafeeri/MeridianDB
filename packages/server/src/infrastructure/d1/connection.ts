import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type D1Client = DrizzleD1Database<typeof schema>;
let db: D1Client | null = null;

/**
 * Cache connection of d1 with drizzle
 * @param d1
 * @returns Drizzle D1 client
 */
export const getD1WithDrizzle = (d1: D1Database): D1Client => {
  if (!db) {
    db = drizzle(d1, { schema });
  }
  return db;
};
