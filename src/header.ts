import type { HeaderMiddleware } from "./types.ts";

export interface FromEnvOptions {
  optional?: boolean;
}

export const header = (name: string, value: string): HeaderMiddleware => {
  return () => ({ [name]: value });
};

export const headerFromEnv = (
  name: string,
  envVar: string,
  options?: FromEnvOptions,
): HeaderMiddleware => {
  return () => {
    const value = process.env[envVar];
    if (!value) {
      if (options?.optional) return {};
      throw new Error(`Environment variable "${envVar}" is not set`);
    }
    return { [name]: value };
  };
};
