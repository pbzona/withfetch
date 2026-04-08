import { afterEach, describe, expect, it, vi } from "vitest";
import { header, headerFromEnv } from "./header.ts";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("header", () => {
  it("returns a static header", () => {
    const mid = header("X-Custom", "value");
    expect(mid()).toEqual({ "X-Custom": "value" });
  });
});

describe("headerFromEnv", () => {
  it("reads the env var at call time", () => {
    vi.stubEnv("TEST_KEY", "test-value");
    const mid = headerFromEnv("X-Key", "TEST_KEY");
    expect(mid()).toEqual({ "X-Key": "test-value" });
  });

  it("resolves lazily (picks up env changes after creation)", () => {
    const mid = headerFromEnv("X-Key", "LAZY_KEY");
    vi.stubEnv("LAZY_KEY", "late-value");
    expect(mid()).toEqual({ "X-Key": "late-value" });
  });

  it("throws when env var is missing", () => {
    const mid = headerFromEnv("X-Key", "MISSING_VAR");
    expect(() => mid()).toThrow('Environment variable "MISSING_VAR" is not set');
  });

  it("treats empty env var as missing", () => {
    vi.stubEnv("EMPTY_VAR", "");
    const mid = headerFromEnv("X-Key", "EMPTY_VAR");
    expect(() => mid()).toThrow('Environment variable "EMPTY_VAR" is not set');
  });

  it("returns empty when optional and env var is missing", () => {
    const mid = headerFromEnv("X-Key", "MISSING_VAR", { optional: true });
    expect(mid()).toEqual({});
  });

  it("returns empty when optional and env var is empty", () => {
    vi.stubEnv("EMPTY_VAR", "");
    const mid = headerFromEnv("X-Key", "EMPTY_VAR", { optional: true });
    expect(mid()).toEqual({});
  });
});
