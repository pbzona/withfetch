import { afterEach, describe, expect, it, vi } from "vitest";
import { vercelOidc } from "./vercel-oidc.ts";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("vercelOidc", () => {
  it("reads VERCEL_OIDC_TOKEN env var by default", async () => {
    vi.stubEnv("VERCEL_OIDC_TOKEN", "oidc-token-123");
    const mid = vercelOidc();
    expect(await mid()).toEqual({ Authorization: "Bearer oidc-token-123" });
  });

  it("throws when VERCEL_OIDC_TOKEN is not set", async () => {
    const mid = vercelOidc();
    await expect(mid()).rejects.toThrow("Vercel OIDC token not available");
  });

  it("uses custom getToken function", async () => {
    const mid = vercelOidc({ getToken: () => "custom-token" });
    expect(await mid()).toEqual({ Authorization: "Bearer custom-token" });
  });

  it("supports async getToken function", async () => {
    const mid = vercelOidc({
      getToken: async () => "async-token",
    });
    expect(await mid()).toEqual({ Authorization: "Bearer async-token" });
  });
});
