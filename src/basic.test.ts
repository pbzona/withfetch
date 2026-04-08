import { afterEach, describe, expect, it, vi } from "vitest";
import { basic, basicFromEnv } from "./basic.ts";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("basic", () => {
  it("returns a Basic authorization header with base64 encoding", () => {
    const mid = basic("user", "pass");
    const expected = `Basic ${Buffer.from("user:pass", "utf8").toString("base64")}`;
    expect(mid()).toEqual({ Authorization: expected });
  });
});

describe("basicFromEnv", () => {
  it("reads credentials from env vars", () => {
    vi.stubEnv("BASIC_USER", "admin");
    vi.stubEnv("BASIC_PASS", "secret");
    const mid = basicFromEnv("BASIC_USER", "BASIC_PASS");
    const expected = `Basic ${Buffer.from("admin:secret", "utf8").toString("base64")}`;
    expect(mid()).toEqual({ Authorization: expected });
  });

  it("treats empty env vars as missing", () => {
    vi.stubEnv("BASIC_USER", "");
    vi.stubEnv("BASIC_PASS", "secret");
    const mid = basicFromEnv("BASIC_USER", "BASIC_PASS");
    expect(() => mid()).toThrow('"BASIC_USER"');
  });

  it("returns empty when optional and env vars are empty", () => {
    vi.stubEnv("BASIC_USER", "");
    vi.stubEnv("BASIC_PASS", "");
    const mid = basicFromEnv("BASIC_USER", "BASIC_PASS", { optional: true });
    expect(mid()).toEqual({});
  });

  it("throws when username env var is missing", () => {
    vi.stubEnv("BASIC_PASS", "secret");
    const mid = basicFromEnv("MISSING_USER", "BASIC_PASS");
    expect(() => mid()).toThrow('"MISSING_USER"');
  });

  it("throws when both env vars are missing", () => {
    const mid = basicFromEnv("MISSING_USER", "MISSING_PASS");
    expect(() => mid()).toThrow('"MISSING_USER" and "MISSING_PASS"');
  });

  it("returns empty when optional and env vars are missing", () => {
    const mid = basicFromEnv("MISSING_USER", "MISSING_PASS", { optional: true });
    expect(mid()).toEqual({});
  });
});
