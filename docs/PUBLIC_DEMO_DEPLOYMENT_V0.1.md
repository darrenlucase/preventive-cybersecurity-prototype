# Public Teacher Demo Deployment V0.1

## Target

Vercel using its standard HTTPS `vercel.app` address. No database, authentication, analytics, live provider or paid resource is required.

## Environment

The deterministic local threat provider is already the safe application default. `THREAT_INTEL_PROVIDER=local` may be set for deployment clarity, but it is not technically required by V0.1 and no API key should be configured.

`NEXT_PUBLIC_SITE_URL` is optional. When absent, production metadata uses Vercel's deployment host. It can later be set to the canonical HTTPS URL if a stable production alias is selected.

## Vercel settings

- Framework preset: Next.js
- Build command: `npm run build:vercel` (also declared in `vercel.json`)
- Output directory: leave unset; use the Next.js default
- Install command: leave unset; use the package-manager default
- Root directory: repository root

## Required routes

`/en`, `/pt-PT`, `/en/teacher-demo`, `/pt-PT/teacher-demo`, `/en/methodology`, and `/pt-PT/methodology` are handled by the Next.js App Router and support direct navigation and refresh.

## Safety

Only fictional `.test` data is used. Local protection choices remain in browser-local storage. No secrets, personal visitor information, analytics, telemetry, credential processing or external threat-intelligence calls are required.

## Verification

```bash
npm run evaluate
npm run test
npm run typecheck
npm run lint
npm run build
npm run build:vercel
```
