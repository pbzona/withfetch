# withfetch

Composable `fetch` instances with preset headers. Create configured fetch functions that automatically apply headers to every request.

## Install

```bash
npm install @pbzona/withfetch
```

## Usage

```typescript
import { createFetch, header, headerFromEnv, bearer } from "@pbzona/withfetch";

const api = createFetch(
  headerFromEnv("X-Api-Key", "API_KEY"),
  bearer("my-token"),
);

// Headers are applied to every request
await api("https://api.example.com/data");
await api("https://api.example.com/data", { method: "POST", body: "..." });
```

The returned function has the same signature as `fetch`. Per-request headers override middleware headers.

## API

### `createFetch(...middleware): fetch`

Creates a new fetch function that applies the given middleware headers to every request.

```typescript
const api = createFetch(
  header("X-Custom", "value"),
  bearerFromEnv("AUTH_TOKEN"),
);
```

### Headers

#### `header(name, value)`

Static header applied to every request.

#### `headerFromEnv(name, envVar, options?)`

Header value read from an environment variable at request time.

```typescript
headerFromEnv("X-Api-Key", "API_KEY");
headerFromEnv("X-Optional", "MAYBE_SET", { optional: true });
```

### Authentication

#### `bearer(token)` / `bearerFromEnv(envVar, options?)`

Sets `Authorization: Bearer <token>`.

```typescript
bearer("my-token");
bearerFromEnv("AUTH_TOKEN");
bearerFromEnv("AUTH_TOKEN", { optional: true });
```

#### `basic(username, password)` / `basicFromEnv(usernameEnv, passwordEnv, options?)`

Sets `Authorization: Basic <base64>`.

```typescript
basic("admin", "secret");
basicFromEnv("BASIC_USER", "BASIC_PASS");
```

### Shortcuts

#### `accept(mimeType)` / `contentType(mimeType)` / `userAgent(value)`

Shorthands for common headers.

```typescript
createFetch(
  accept("application/json"),
  contentType("application/json"),
  userAgent("my-app/1.0"),
);
```

### Vercel OIDC

#### `vercelOidc(options?)`

Reads the `VERCEL_OIDC_TOKEN` environment variable and sets it as a Bearer token. Useful for authenticating between Vercel-hosted services.

```typescript
import { createFetch, vercelOidc } from "@pbzona/withfetch";

// Simple: reads VERCEL_OIDC_TOKEN env var
const api = createFetch(vercelOidc());

// Advanced: use @vercel/oidc for token retrieval in Vercel Functions
import { getVercelOidcToken } from "@vercel/oidc";

const api = createFetch(
  vercelOidc({ getToken: () => getVercelOidcToken() }),
);
```

## Environment Variables

All `*FromEnv` functions resolve environment variables at **request time**, not when the middleware is created. This means:

- Tokens that rotate are picked up automatically
- Environment variables set after middleware creation are still read

By default, a missing environment variable throws an error. Empty strings are also treated as missing. Pass `{ optional: true }` to silently skip the header instead.

## Header Precedence

When the same header is set by multiple sources, the last one wins:

1. Middleware (in order — later middleware overrides earlier)
2. Headers from a `Request` object (if passed as the first argument)
3. Per-request `init.headers`

## License

MIT

## Publishing

This repo includes a GitHub Actions publish workflow at `.github/workflows/publish.yml`.

### One-time setup

1. Add an `NPM_TOKEN` repository secret with publish access to this package.

### Release flow

1. Bump the version in `package.json` and create a tag:

```bash
npm version patch
git push --follow-tags
```

2. The workflow runs on `v*` tags, validates lint/typecheck/tests/build, verifies tag version matches `package.json`, then publishes to npm.

## Agent Skill

This repository ships an installable skill for coding agents at `skills/withfetch-consumer/SKILL.md`.

Install from a local checkout:

```bash
npx skills add /path/to/fetch-with --skill withfetch-consumer -g -y
```

Install from GitHub:

```bash
npx skills add <owner>/fetch-with --skill withfetch-consumer -g -y
```
