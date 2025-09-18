import { Hono } from "hono";
// import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";
import { contextStorage } from "hono/context-storage";
import { Env } from "hono/types";
import { ENDPOINTS } from "./config/routes";
import { helathCheckController } from "./controllers/health";
import { initDBSchemaOrGetStatusController } from "./controllers/init";

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

// init schema
app.get(ENDPOINTS.init, initDBSchemaOrGetStatusController);
// Health check endpoint that tests all databases
app.get(ENDPOINTS.health, helathCheckController);

// queues may be removed from open source version design
// barier of adoption as multiple users have free membership
export default {
  fetch: app.fetch,
  // async queue(batch: any, env: Bindings) {
  //    batch?.messages;
  //   env.D1
  // },
};
