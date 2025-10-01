import { getD1, getKV, getR2 } from "@/config/context";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import { Context } from "hono";

export const helathCheckController: any = async (c: Context) => {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      kv: { status: "unknown", latency: 0, error: "" },
      r2: { status: "unknown", latency: 0, error: "" },
      d1: { status: "unknown", latency: 0, error: "" },
    },
    container: false,
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

    // helath check container
    try {
      const container = createContainer(getD1WithDrizzle(getD1()));
      await container.organizationService.list({}, {});
      healthCheck.container = true;
    } catch {
      // handle container failure
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
};
