import { Elysia, t } from "elysia";
import { db, schema } from "./db";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({
    message: "Hello Elysia + Drizzle + MySQL via Bun!",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(schema.users);
      return { success: true, data: allUsers };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to query database. Pastikan MySQL sudah berjalan dan DATABASE_URL valid.",
        error: error.message,
      };
    }
  })
  .post(
    "/users",
    async ({ body, set }) => {
      try {
        const result = await db.insert(schema.users).values({
          name: body.name,
          email: body.email,
        });
        set.status = 201;
        return { success: true, message: "User created", result };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to insert user. Pastikan MySQL sudah berjalan dan DATABASE_URL valid.",
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    }
  )
  .listen(port);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export default app;
