import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({
    message: "Hello Elysia + Drizzle + MySQL via Bun!",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .use(usersRoute)
  .listen(port);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export default app;
