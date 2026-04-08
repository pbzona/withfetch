import type { HeaderMiddleware } from "./types.ts";

export interface VercelOidcOptions {
  getToken?: () => string | Promise<string>;
}

export const vercelOidc = (options?: VercelOidcOptions): HeaderMiddleware => {
  return async () => {
    const token = options?.getToken ? await options.getToken() : process.env.VERCEL_OIDC_TOKEN;

    if (!token) {
      throw new Error(
        "Vercel OIDC token not available. Ensure VERCEL_OIDC_TOKEN is set or provide a getToken function.",
      );
    }

    return { Authorization: `Bearer ${token}` };
  };
};
