import type { HeaderMiddleware } from "./types.ts";

export const accept = (mimeType: string): HeaderMiddleware => {
  return () => ({ Accept: mimeType });
};

export const contentType = (mimeType: string): HeaderMiddleware => {
  return () => ({ "Content-Type": mimeType });
};

export const userAgent = (value: string): HeaderMiddleware => {
  return () => ({ "User-Agent": value });
};
