# withfetch consumer templates

These examples are copy-paste starters for common server-side integration patterns.

- `nextjs-route-handler.ts`: Next.js App Router route that calls an upstream API
- `express-service.ts`: Express endpoint that proxies to an upstream service
- `scheduled-job.ts`: background job that posts JSON to an internal endpoint

Notes:

- Env-driven middleware resolves at request time.
- Empty env values are treated as missing.
- Use `{ optional: true }` when a missing header should be skipped.
- Per-request `init.headers` overrides middleware headers.
