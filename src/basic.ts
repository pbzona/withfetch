import type { FromEnvOptions } from "./header.ts";
import type { HeaderMiddleware } from "./types.ts";

const encode = (username: string, password: string): string => {
  return Buffer.from(`${username}:${password}`, "utf8").toString("base64");
};

export const basic = (username: string, password: string): HeaderMiddleware => {
  return () => ({ Authorization: `Basic ${encode(username, password)}` });
};

export const basicFromEnv = (
  usernameEnv: string,
  passwordEnv: string,
  options?: FromEnvOptions,
): HeaderMiddleware => {
  return (): Record<string, string> => {
    const username = process.env[usernameEnv];
    const password = process.env[passwordEnv];
    if (!username || !password) {
      if (options?.optional) return {};
      const missing = [!username && `"${usernameEnv}"`, !password && `"${passwordEnv}"`].filter(
        Boolean,
      );
      throw new Error(`Environment variable(s) ${missing.join(" and ")} not set`);
    }
    return { Authorization: `Basic ${encode(username, password)}` };
  };
};
