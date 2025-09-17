import type {
  IKVClient,
  KVListResult,
  KVQueryResult,
} from "@/entities/interfaces/adapters/kv";

class KVClient implements IKVClient {
  constructor(private readonly kv: KVNamespace) {}

  async get(key: string): Promise<KVQueryResult> {
    try {
      const result = await this.kv.getWithMetadata(key);

      return {
        success: true,
        value: result,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        success: false,
        value: null,
      };
    }
  }

  async put(
    key: string,
    value: any,
    opts?: {
      metadata?: any;
      expiration?: number;
      expirationTtl?: number;
    }
  ): Promise<{ success: boolean }> {
    try {
      await this.kv.put(key, value, opts);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async delete(key: string): Promise<{ success: boolean }> {
    try {
      await this.kv.delete(key);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async list(opts?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<KVListResult> {
    try {
      const result = await this.kv.list(opts);
      return {
        keys: result.keys,
        list_complete: result.list_complete,
      };
    } catch (error) {
      return {
        keys: [],
        list_complete: true,
      };
    }
  }
}

export const getKVClient = (kv: KVNamespace): IKVClient => new KVClient(kv);
