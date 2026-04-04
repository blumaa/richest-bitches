import { describe, it, expect } from "vitest";
import { parseSocialHandle } from "./social";

describe("parseSocialHandle", () => {
  it("returns null for empty string", () => {
    expect(parseSocialHandle("")).toBeNull();
    expect(parseSocialHandle("  ")).toBeNull();
  });

  it("returns null for just @", () => {
    expect(parseSocialHandle("@")).toBeNull();
  });

  it("parses @handle as X/Twitter", () => {
    const result = parseSocialHandle("@richguy");
    expect(result).toEqual({ url: "https://x.com/richguy", platform: "x" });
  });

  it("parses bare handle as X/Twitter", () => {
    const result = parseSocialHandle("richguy");
    expect(result).toEqual({ url: "https://x.com/richguy", platform: "x" });
  });

  it("detects twitter.com URL", () => {
    const result = parseSocialHandle("https://twitter.com/richguy");
    expect(result).toEqual({ url: "https://twitter.com/richguy", platform: "x" });
  });

  it("detects x.com URL", () => {
    const result = parseSocialHandle("https://x.com/richguy");
    expect(result).toEqual({ url: "https://x.com/richguy", platform: "x" });
  });

  it("detects instagram.com URL", () => {
    const result = parseSocialHandle("https://instagram.com/richguy");
    expect(result).toEqual({ url: "https://instagram.com/richguy", platform: "instagram" });
  });

  it("detects tiktok.com URL", () => {
    const result = parseSocialHandle("https://tiktok.com/@richguy");
    expect(result).toEqual({ url: "https://tiktok.com/@richguy", platform: "tiktok" });
  });

  it("handles other URLs", () => {
    const result = parseSocialHandle("https://mysite.com");
    expect(result).toEqual({ url: "https://mysite.com", platform: "other" });
  });

  it("trims whitespace", () => {
    const result = parseSocialHandle("  @richguy  ");
    expect(result).toEqual({ url: "https://x.com/richguy", platform: "x" });
  });
});
