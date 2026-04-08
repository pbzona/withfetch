export { basic, basicFromEnv } from "./basic.ts";
export { bearer, bearerFromEnv } from "./bearer.ts";
export { createFetch } from "./create-fetch.ts";
export type { FromEnvOptions } from "./header.ts";
export { header, headerFromEnv } from "./header.ts";
export { accept, contentType, userAgent } from "./shortcuts.ts";
export type { HeaderMiddleware } from "./types.ts";
export type { VercelOidcOptions } from "./vercel-oidc.ts";
export { vercelOidc } from "./vercel-oidc.ts";
