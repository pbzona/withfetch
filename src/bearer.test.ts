import { afterEach, describe, expect, it, vi } from "vitest";
import { bearer, bearerFromEnv } from "./bearer.ts";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("bearer", () => {
  it("returns a Bearer authorization header", () => {
    const mid = bearer("my-token");
    expect(mid()).toEqual({ Authorization: "Bearer my-token" });
  });
});

describe("bearerFromEnv", () => {
  it("reads the token from an env var", () => {
    vi.stubEnv("AUTH_TOKEN", "env-token");
    const mid = bearerFromEnv("AUTH_TOKEN");
    expect(mid()).toEqual({ Authorization: "Bearer env-token" });
  });

  it("throws when env var is missing", () => {
    const mid = bearerFromEnv("MISSING_TOKEN");
    expect(() => mid()).toThrow('Environment variable "MISSING_TOKEN" is not set');
  });

  it("treats empty env var as missing", () => {
    vi.stubEnv("EMPTY_TOKEN", "");
    const mid = bearerFromEnv("EMPTY_TOKEN");
    expect(() => mid()).toThrow('Environment variable "EMPTY_TOKEN" is not set');
  });

  it("returns empty when optional and env var is missing", () => {
    const mid = bearerFromEnv("MISSING_TOKEN", { optional: true });
    expect(mid()).toEqual({});
  });

  it("returns empty when optional and env var is empty", () => {
    vi.stubEnv("EMPTY_TOKEN", "");
    const mid = bearerFromEnv("EMPTY_TOKEN", { optional: true });
    expect(mid()).toEqual({});
  });
});
