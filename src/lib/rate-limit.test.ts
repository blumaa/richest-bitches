import { describe, it, expect, vi, beforeEach } from "vitest";
import { isRateLimited } from "./rate-limit";

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows first request", () => {
    expect(isRateLimited("1.1.1.1")).toBe(false);
  });

  it("allows up to 10 requests per minute", () => {
    for (let i = 0; i < 10; i++) {
      expect(isRateLimited("2.2.2.2")).toBe(false);
    }
  });

  it("blocks 11th request within the window", () => {
    for (let i = 0; i < 10; i++) {
      isRateLimited("3.3.3.3");
    }
    expect(isRateLimited("3.3.3.3")).toBe(true);
  });

  it("resets after window expires", () => {
    for (let i = 0; i < 10; i++) {
      isRateLimited("4.4.4.4");
    }
    expect(isRateLimited("4.4.4.4")).toBe(true);
    vi.advanceTimersByTime(60_001);
    expect(isRateLimited("4.4.4.4")).toBe(false);
  });

  it("tracks IPs independently", () => {
    for (let i = 0; i < 10; i++) {
      isRateLimited("5.5.5.5");
    }
    expect(isRateLimited("5.5.5.5")).toBe(true);
    expect(isRateLimited("6.6.6.6")).toBe(false);
  });
});
