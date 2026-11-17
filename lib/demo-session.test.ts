import { afterEach, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./demo-session";

const SECRET = "test-session-secret-32chars!!";

afterEach(() => {
  delete process.env.DEMO_SESSION_SECRET;
  delete process.env.AUTH_SECRET;
  delete process.env.DEMO_PASSWORD;
});

describe("demo session tokens", () => {
  it("rejects the former fixed cookie sentinel", async () => {
    expect(await verifySessionToken("ok", SECRET)).toBe(false);
  });

  it("accepts a freshly issued signed token", async () => {
    const token = await createSessionToken(SECRET);
    expect(token).not.toBe("ok");
    expect(await verifySessionToken(token, SECRET)).toBe(true);
  });

  it("rejects a tampered payload", async () => {
    const token = await createSessionToken(SECRET);
    const [id, exp, sig] = token.split(".");
    const tampered = `${id}.${Number(exp) + 1}.${sig}`;
    expect(await verifySessionToken(tampered, SECRET)).toBe(false);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken(SECRET);
    expect(await verifySessionToken(token, "other-session-secret-32ch!!")).toBe(false);
  });

  it("rejects an expired token", async () => {
    const token = await createSessionToken(SECRET, -10);
    expect(await verifySessionToken(token, SECRET)).toBe(false);
  });

  it("issues distinct random tokens", async () => {
    const a = await createSessionToken(SECRET);
    const b = await createSessionToken(SECRET);
    expect(a).not.toBe(b);
  });
});
