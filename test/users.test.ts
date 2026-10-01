import { describe, expect, it } from "bun:test";
import bcrypt from "bcrypt";
import app from "../src/index";

describe("User Registration Feature", () => {
  it("should hash password with bcrypt correctly", async () => {
    const rawPassword = "rahasia";
    const hashed = await bcrypt.hash(rawPassword, 10);
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(rawPassword);

    const match = await bcrypt.compare(rawPassword, hashed);
    expect(match).toBe(true);

    const falseMatch = await bcrypt.compare("wrong-password", hashed);
    expect(falseMatch).toBe(false);
  });

  it("should reject POST /api/users when required fields are missing", async () => {
    const res = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "jaman",
          // email & password missing
        }),
      })
    );

    expect(res.status).toBe(422);
  });

  it("should respond with 200 on health check", async () => {
    const res = await app.handle(new Request("http://localhost:3000/"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});
