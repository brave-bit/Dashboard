import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./auth-token";

describe("auth token", () => {
  it("creates and verifies a session token", async () => {
    const token = await createSessionToken("admin");
    expect(await verifySessionToken(token)).toBe(true);
  });

  it("rejects tampered tokens", async () => {
    const token = await createSessionToken("admin");
    expect(await verifySessionToken(`${token}x`)).toBe(false);
  });
});
