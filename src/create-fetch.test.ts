import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFetch } from "./create-fetch.ts";
import type { HeaderMiddleware } from "./types.ts";

const mockFetch = vi.fn<typeof globalThis.fetch>(() => Promise.resolve(new Response("ok")));

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const capturedHeaders = (): Record<string, string> => {
  const [, init] = mockFetch.mock.calls[0];
  const headers = init?.headers;
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  return (headers as Record<string, string>) ?? {};
};

describe("createFetch", () => {
  it("calls fetch with no extra headers when no middleware is provided", async () => {
    const f = createFetch();
    await f("https://example.com");

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(capturedHeaders()).toEqual({});
  });

  it("applies middleware headers", async () => {
    const mid: HeaderMiddleware = () => ({ "X-Custom": "value" });
    const f = createFetch(mid);
    await f("https://example.com");

    expect(capturedHeaders()["x-custom"]).toBe("value");
  });

  it("merges multiple middleware in order (later wins)", async () => {
    const first: HeaderMiddleware = () => ({ "X-Key": "first", "X-Only-First": "a" });
    const second: HeaderMiddleware = () => ({ "X-Key": "second", "X-Only-Second": "b" });
    const f = createFetch(first, second);
    await f("https://example.com");

    const h = capturedHeaders();
    expect(h["x-key"]).toBe("second");
    expect(h["x-only-first"]).toBe("a");
    expect(h["x-only-second"]).toBe("b");
  });

  it("per-request headers override middleware headers", async () => {
    const mid: HeaderMiddleware = () => ({ "X-Key": "from-middleware" });
    const f = createFetch(mid);
    await f("https://example.com", { headers: { "X-Key": "from-request" } });

    expect(capturedHeaders()["x-key"]).toBe("from-request");
  });

  it("handles Headers instance in init", async () => {
    const mid: HeaderMiddleware = () => ({ "X-Key": "middleware" });
    const f = createFetch(mid);
    const headers = new Headers({ "X-Key": "from-headers-obj" });
    await f("https://example.com", { headers });

    expect(capturedHeaders()["x-key"]).toBe("from-headers-obj");
  });

  it("handles tuple array headers in init", async () => {
    const mid: HeaderMiddleware = () => ({ "X-Key": "middleware" });
    const f = createFetch(mid);
    await f("https://example.com", { headers: [["X-Key", "from-tuple"]] });

    expect(capturedHeaders()["x-key"]).toBe("from-tuple");
  });

  it("handles Request object input and merges its headers", async () => {
    const mid: HeaderMiddleware = () => ({ "X-Mid": "yes" });
    const f = createFetch(mid);
    const req = new Request("https://example.com", {
      headers: { "X-Req": "from-request-obj" },
    });
    await f(req);

    const h = capturedHeaders();
    expect(h["x-mid"]).toBe("yes");
    expect(h["x-req"]).toBe("from-request-obj");
  });

  it("supports async middleware", async () => {
    const asyncMid: HeaderMiddleware = async () => {
      return { "X-Async": "resolved" };
    };
    const f = createFetch(asyncMid);
    await f("https://example.com");

    expect(capturedHeaders()["x-async"]).toBe("resolved");
  });

  it("forwards all fetch arguments", async () => {
    const f = createFetch();
    await f("https://example.com/path", {
      method: "POST",
      body: "data",
    });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://example.com/path");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe("data");
  });
});
