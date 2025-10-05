import { AgentRequestContext } from "@/entities/domain/agent";
import { getContext } from "hono/context-storage";

// Bindings
export type Env = {
  Bindings: {
    readonly D1: D1Database;
    readonly KV: KVNamespace;
    readonly AI: Ai;
    readonly R2_BUCKET: R2Bucket;
    readonly __STATIC_CONTENT?: any;
    // vectorize & ai
    readonly VECTORIZE: Vectorize;
    readonly EMBEDDING_MODEL: any;
    readonly TOPK: number;
    // admin , access
    readonly ADMIN_EMAIL: string;
    readonly ADMIN_PASSWORD: string;
    readonly JWT_SECRET: string;
    readonly SUPER_ADMIN_INIT_TOKEN: string;
    // queues
    TEMPORAL_QUEUE_URL: string;
    TEMPORAL_QUEUE_API_KEY: string;
    BEHAVIORAL_QUEUE_URL: string;
    BEHAVIORAL_QUEUE_API_KEY: string;
  };
  Variables: {
    AGENT_ID: string;
    ORG_ID: string;
    AGENT_REQUEST_CONTEXT: AgentRequestContext;
  };
};

// used in set operations
export const AppContextKeys = {
  AGENT_ID: "AGENT_ID",
  ORG_ID: "ORG_ID",
  ADMIN_ID: "ADMIN_ID",
  ADMIN_EMAIL: "ADMIN_EMAIL",
  ADMIN_PASSWORD: "ADMIN_PASSWORD",
  AGENT_REQUEST_CONTEXT: "AGENT_REQUEST_CONTEXT",
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

export const getTopK = () => {
  return getContext<Env>().env.TOPK;
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

export const getSuperAdminToken = (): string => {
  return getContext<Env>().env.SUPER_ADMIN_INIT_TOKEN;
};

// agent
export const getAgentRequestContext = (): AgentRequestContext => {
  return getContext<Env>().var.AGENT_REQUEST_CONTEXT;
};

// queues
interface QueuesEnvVars {
  temporalQueueURL: string;
  temporalQueueApiKey: string;
  behavioralQueueURL: string;
  behavioralQueueApiKey: string;
}

export const getQueuesEnvVariables = (): QueuesEnvVars => {
  const context = getContext<Env>().env;

  return {
    temporalQueueURL: context.TEMPORAL_QUEUE_URL,
    temporalQueueApiKey: context.TEMPORAL_QUEUE_API_KEY,
    behavioralQueueURL: context.BEHAVIORAL_QUEUE_URL,
    behavioralQueueApiKey: context.BEHAVIORAL_QUEUE_API_KEY,
  };
};
