# Deployment Readiness V0.1

V0.1 is prepared for deployment but is intentionally not deployed.

## Environment

Copy `.env.example` to `.env.local`. Local mode requires no secret. Any future provider key must be configured in the hosting environment and never committed.

## Release checklist

1. Run `npm ci` on Node.js 22.13 or newer.
2. Run `npm run check`.
3. Manually verify `/en`, `/pt-PT`, both demo pages, settings reversal, and a mobile viewport.
4. Confirm the provider remains `local` unless a reviewed data-sharing statement and secret are configured.
5. Confirm metadata, HTTPS hosting, security headers, and the no-real-world-validation disclaimer.

For Vercel, import the repository and use the standard Next.js build. The included Sites configuration provides a second compatible build path. Do not add production keys to the repository.
