import { describe, expect, it } from "vitest";
import { accept, contentType, userAgent } from "./shortcuts.ts";

describe("shortcuts", () => {
  it("accept returns Accept header middleware", () => {
    const mid = accept("application/json");
    expect(mid()).toEqual({ Accept: "application/json" });
  });

  it("contentType returns Content-Type header middleware", () => {
    const mid = contentType("application/json");
    expect(mid()).toEqual({ "Content-Type": "application/json" });
  });

  it("userAgent returns User-Agent header middleware", () => {
    const mid = userAgent("withfetch-tests/1.0");
    expect(mid()).toEqual({ "User-Agent": "withfetch-tests/1.0" });
  });
});
