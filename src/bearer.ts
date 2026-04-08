import type { FromEnvOptions } from "./header.ts";
import type { HeaderMiddleware } from "./types.ts";

export const bearer = (token: string): HeaderMiddleware => {
  return () => ({ Authorization: `Bearer ${token}` });
};

export const bearerFromEnv = (envVar: string, options?: FromEnvOptions): HeaderMiddleware => {
  return (): Record<string, string> => {
    const value = process.env[envVar];
    if (!value) {
      if (options?.optional) return {};
      throw new Error(`Environment variable "${envVar}" is not set`);
    }
    return { Authorization: `Bearer ${value}` };
  };
};
