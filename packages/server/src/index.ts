import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";

const app = new Hono();

// Create a simple manifest object
const staticManifest = {};

// Cross origin
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both client ports
    credentials: true,
  })
);

//  Serve static assets from the client build
app.use(
  "/assets/*",
  serveStatic({
    root: "./dist/client",
    manifest: staticManifest,
  })
);

app.use(
  "/favicon.ico",
  serveStatic({
    path: "./dist/client/favicon.ico",
    manifest: staticManifest,
  })
);

app.get("/api/hello", (c) => {
  return c.json({
    message: "Hello from Hono API!",
    timestamp: new Date().toISOString(),
  });
});

app.get("*", async (c) => {
  try {
    // Dynamically import the built server entry
    // @ts-ignore - This file is generated during build
    const { render } = await import("../dist/server/entry-server.js");

    const url = new URL(c.req.url);
    const { html, state } = await render(url.pathname, {});

    const template = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hono + React + Vite</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>window.__INITIAL_STATE__ = ${state}</script>
        <script type="module" src="/assets/client.js"></script>
      </body>
    </html>`;

    return c.html(template);
  } catch (e) {
    console.error("SSR Error:", e);
    return c.html("Server Error", 500);
  }
});

export default app;
