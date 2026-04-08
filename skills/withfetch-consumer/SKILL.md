---
name: withfetch-consumer
description: Integrate withfetch into Node or server-side TypeScript projects by creating reusable fetch clients with env-driven headers and auth middleware.
---

# withfetch Consumer

Use this skill to wire `withfetch` into an existing codebase so application code uses configured `fetch` clients instead of repeating headers and auth logic.

## When To Use This Skill

Use when the user asks to:

- Set default headers for many HTTP calls
- Centralize bearer/basic auth setup
- Read request headers or tokens from environment variables
- Create service-specific API clients
- Standardize `fetch` usage across a Node/server codebase

## Core Behaviors

1. Install the library with the project's package manager.
2. Create a shared fetch client module (for example `src/lib/fetch-client.ts`).
3. Compose middleware with `createFetch(...)` and the smallest useful set of helpers.
4. Keep call-site overrides possible via per-request `init.headers`.
5. Add or update tests for the new client behavior.

## Recommended Integration Pattern

Default to this pattern unless the repository already has a stronger convention:

```ts
import { bearerFromEnv, createFetch, headerFromEnv } from "withfetch";

export const apiFetch = createFetch(
  headerFromEnv("X-Api-Key", "API_KEY"),
  bearerFromEnv("API_TOKEN", { optional: true }),
);
```

Then consume it in app code:

```ts
const res = await apiFetch("https://api.example.com/users", {
  headers: { "X-Request-Id": requestId },
});
```

## Middleware Selection Guide

- `header(name, value)`: static values
- `headerFromEnv(name, envVar, options?)`: dynamic env-sourced headers
- `bearer(token)` / `bearerFromEnv(envVar, options?)`: bearer auth
- `basic(username, password)` / `basicFromEnv(userEnv, passEnv, options?)`: basic auth
- `accept(...)`, `contentType(...)`, `userAgent(...)`: common header shortcuts
- `vercelOidc(options?)`: Vercel service-to-service auth

## Important Semantics

- Env-based helpers resolve values at request time.
- Empty env var values are treated as missing.
- Pass `{ optional: true }` to skip a header when env vars are missing/empty.
- Header precedence (last wins): middleware order, then `Request` headers, then per-request `init.headers`.

## Implementation Checklist

- Identify where shared HTTP clients live in this codebase.
- Add or update a fetch client module using `createFetch`.
- Migrate at least one representative call site to use the client.
- Ensure tests cover auth/header behavior and overrides.
- Run lint, typecheck, and tests before finishing.

## Commands

```bash
# Install dependency in target project
pnpm add withfetch

# If the project uses npm
npm install withfetch
```

```bash
# Validate changes
pnpm lint && pnpm typecheck && pnpm test
```

## Templates

- Reusable templates are available in `skills/withfetch-consumer/examples/`.
- Start from the closest template (Next.js, Express, or scheduled jobs) and adapt env var names and endpoints.
