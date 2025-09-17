import type {
  IR2Client,
  R2QueryResult,
  R2ListResult,
  R2PutOptions,
} from "@/entities/interfaces/adapters/r2";

class R2Client implements IR2Client {
  constructor(private readonly r2: R2Bucket) {}

  async get(key: string): Promise<R2QueryResult> {
    try {
      const object = await this.r2.get(key);
      if (!object) {
        return { success: true, object: null };
      }

      return {
        success: true,
        object: {
          key: object.key,
          size: object.size,
          etag: object.etag,
          uploaded: object.uploaded,
          httpMetadata: object.httpMetadata,
          customMetadata: object.customMetadata,
        },
        body: await object.arrayBuffer(),
      };
    } catch (error) {
      return { success: false, object: null };
    }
  }

  async put(
    key: string,
    value: any,
    opts?: R2PutOptions
  ): Promise<{ success: boolean }> {
    try {
      await this.r2.put(key, value, opts);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async delete(key: string): Promise<{ success: boolean }> {
    try {
      await this.r2.delete(key);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async list(opts?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
    include?: ("httpMetadata" | "customMetadata")[];
  }): Promise<R2ListResult> {
    try {
      const result = await this.r2.list(opts);
      return {
        objects: result.objects.map((obj) => ({
          key: obj.key,
          size: obj.size,
          etag: obj.etag,
          uploaded: obj.uploaded,
          httpMetadata: obj.httpMetadata,
          customMetadata: obj.customMetadata,
        })),
        truncated: result.truncated,
      };
    } catch (error) {
      return {
        objects: [],
        truncated: false,
      };
    }
  }

  async head(key: string): Promise<R2QueryResult> {
    try {
      const object = await this.r2.head(key);
      if (!object) {
        return { success: true, object: null };
      }

      return {
        success: true,
        object: {
          key: object.key,
          size: object.size,
          etag: object.etag,
          uploaded: object.uploaded,
          httpMetadata: object.httpMetadata,
          customMetadata: object.customMetadata,
        },
      };
    } catch (error) {
      return { success: false, object: null };
    }
  }
}

export const getR2Client = (r2: R2Bucket): IR2Client => new R2Client(r2);
