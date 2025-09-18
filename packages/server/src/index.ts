import { Hono } from "hono";
// import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";
import { contextStorage } from "hono/context-storage";
import { Env } from "hono/types";
import { getD1, getKV, getR2 } from "./config/context";

// main app
const app = new Hono<{ Bindings: Env }>();

// production serving react app.
// app.use('/static/*', serveStatic({ root: './frontend/dist' }));
// app.get('/', serveStatic({ path: './frontend/dist/index.html' }));

// Cross origin
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both client ports
    credentials: true,
  })
);

// use context storage propagate context through async calls
app.use(contextStorage());
// usage getContext
// Health check endpoint that tests all databases
app.get("/api/health", async (c) => {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      kv: { status: "unknown", latency: 0, error: "" },
      r2: { status: "unknown", latency: 0, error: "" },
      d1: { status: "unknown", latency: 0, error: "" },
    },
  };

  try {
    // Test KV
    const kvStart = Date.now();
    try {
      await getKV().put("healthcheck", "test", { expirationTtl: 60 });
      await getKV().get("healthcheck");
      await getKV().delete("healthcheck");
      healthCheck.services.kv.status = "healthy";
      healthCheck.services.kv.latency = Date.now() - kvStart;
    } catch (error: any) {
      healthCheck.services.kv.status = "unhealthy";
      healthCheck.services.kv.error = error.message;
    }

    // Test R2
    const r2Start = Date.now();
    try {
      // Try to list buckets to test connectivity
      await getR2().list({ limit: 1 });
      healthCheck.services.r2.status = "healthy";
      healthCheck.services.r2.latency = Date.now() - r2Start;
    } catch (error: any) {
      healthCheck.services.r2.status = "unhealthy";
      healthCheck.services.r2.error = error.message;
    }

    // Test D1
    const d1Start = Date.now();
    try {
      // Simple query to test connectivity
      const result = await getD1().prepare("SELECT 1 as test").first();
      if (result && result.test === 1) {
        healthCheck.services.d1.status = "healthy";
      } else {
        healthCheck.services.d1.status = "unhealthy";
        healthCheck.services.d1.error = "Unexpected query result";
      }
      healthCheck.services.d1.latency = Date.now() - d1Start;
    } catch (error: any) {
      healthCheck.services.d1.status = "unhealthy";
      healthCheck.services.d1.error = error.message;
    }

    // Check if any service is unhealthy
    const unhealthyServices = Object.values(healthCheck.services).filter(
      (service) => service.status === "unhealthy"
    );

    if (unhealthyServices.length > 0) {
      healthCheck.status = "degraded";
    }

    return c.json(healthCheck);
  } catch (error: any) {
    // Global error handling
    return c.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        details: error.message,
      },
      500
    );
  }
});

// queues may be removed from open source version design
// barier of adoption as multiple users have free membership
export default {
  fetch: app.fetch,
  // async queue(batch: any, env: Bindings) {
  //    batch?.messages;
  //   env.D1
  // },
};
