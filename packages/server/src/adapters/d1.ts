import type {
  D1QueryResult,
  ID1Client,
} from "@/entities/interfaces/adapters/d1";

class D1Client implements ID1Client {
  constructor(private readonly db: D1Database) {}
  async query(sql: string, params?: any[] | undefined): Promise<D1QueryResult> {
    const stmt = this.db.prepare(sql);
    return params ? await stmt.bind(params).all() : stmt.all();
  }

  async runTransaction(stmts: D1PreparedStatement[]): Promise<any> {
    return this.db.batch(stmts);
  }
}

export const getD1Client = (d1: D1Database): ID1Client => new D1Client(d1);
