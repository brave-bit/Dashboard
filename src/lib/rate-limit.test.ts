import { describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Date.now()}`;
    expect(checkRateLimit(key).allowed).toBe(true);
    expect(checkRateLimit(key).allowed).toBe(true);
    resetRateLimit(key);
  });

  it("blocks after max attempts", () => {
    const key = `block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key);
    }
    const blocked = checkRateLimit(key);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    resetRateLimit(key);
  });
});
