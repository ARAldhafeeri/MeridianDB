import { getContext } from "hono/context-storage";

// Bindings
export type Env = {
  Bindings: {
    readonly D1: D1Database;
    readonly KV: KVNamespace;
    readonly AI: Ai;
    readonly R2_BUCKET: R2Bucket;
    readonly __STATIC_CONTENT?: any;
    readonly VECTORIZE: Vectorize;
    readonly EMBEDDING_MODEL: any;
    readonly ADMIN_EMAIL: string;
    readonly ADMIN_PASSWORD: string;
    readonly JWT_SECRET: string;
  };
  Variables: {
    AGENT_ID: string;
    ORG_ID: string;
  };
};

// used in set operations
export const AppContextKeys = {
  AGENT_ID: "AGENT_ID",
  ORG_ID: "ORG_ID",
  ADMIN_EMAIL: "ADMIN_EMAIL",
  ADMIN_PASSWORD: "ADMIN_PASSWORD",
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

export const getVictorize = () => {
  return getContext<Env>().env.VECTORIZE;
};

export const getAi = () => {
  return getContext<Env>().env.AI;
};

export const getEmbeddingModelName = () => {
  return getContext<Env>().env.EMBEDDING_MODEL;
};

export const getStaticContent = () => {
  return getContext<Env>().env.__STATIC_CONTENT;
};

export const getEnv = (): Env["Bindings"] => {
  return getContext<Env>().env;
};

// jwt
export const getJWTSecret = (): string => {
  return getContext<Env>().env.JWT_SECRET;
};

// app context
export const getAgentId = (): string => {
  return getContext<Env>().var.AGENT_ID;
};

export const getOrgId = (): string => {
  return getContext<Env>().var.ORG_ID;
};

// admin

export const getAdminEmail = (): string => {
  return getContext<Env>().env.ADMIN_EMAIL;
};

export const getAdminPassword = (): string => {
  return getContext<Env>().env.ADMIN_PASSWORD;
};
