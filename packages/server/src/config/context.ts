import { getContext } from "hono/context-storage";

// Bindings
export type Env = {
  Bindings: {
    readonly D1: D1Database;
    readonly KV: KVNamespace;
    readonly R2_BUCKET: R2Bucket;
    readonly __STATIC_CONTENT?: any;
  };
  Variables: {};
};

export const getD1 = () => {
  return getContext<Env>().env.D1;
};

export const getKV = () => {
  return getContext<Env>().env.KV;
};

export const getR2 = () => {
  return getContext<Env>().env.R2_BUCKET;
};

export const getStaticContent = () => {
  return getContext<Env>().env.__STATIC_CONTENT;
};

// Utility function to get the entire environment
export const getEnv = (): Env["Bindings"] => {
  return getContext<Env>().env;
};
