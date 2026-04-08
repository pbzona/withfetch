import type { HeaderMiddleware } from "./types.ts";

const toEntries = (headers: HeadersInit | undefined): [string, string][] => {
  if (!headers) return [];
  if (headers instanceof Headers) {
    return [...headers.entries()];
  }
  if (Array.isArray(headers)) return headers;
  return Object.entries(headers);
};

export const createFetch = (...middlewares: HeaderMiddleware[]): typeof globalThis.fetch => {
  return async (input, init) => {
    const resolvedHeaders = await Promise.all(middlewares.map((m) => m()));

    const merged = new Headers();

    for (const headers of resolvedHeaders) {
      for (const [key, value] of Object.entries(headers)) {
        merged.set(key, value);
      }
    }

    if (input instanceof Request) {
      for (const [key, value] of toEntries(input.headers)) {
        merged.set(key, value);
      }
    }

    for (const [key, value] of toEntries(init?.headers)) {
      merged.set(key, value);
    }

    return globalThis.fetch(input, {
      ...init,
      headers: merged,
    });
  };
};
