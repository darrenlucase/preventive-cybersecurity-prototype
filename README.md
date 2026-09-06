# Preventive Cybersecurity Prototype

A bilingual English / European Portuguese demonstration prototype developed for an IB Community Project focused initially on non-expert internet users in Portugal.

The prototype demonstrates:

**Detect → Explain → Prevent / Block → Act → Verify**

It is intentionally unnamed. Descriptive phrases in the interface are not a product or project brand.

## Current capabilities

- URL, protocol, hostname, path, subdomain and registrable-domain analysis.
- HTTPS and punycode detection.
- Provider-independent threat-intelligence interface with deterministic local test data.
- Claimed-organisation comparison using clearly fictional demonstration entities.
- Transparent lookalike and misleading-subdomain similarity signals.
- Deterministic, documented risk classification and evidence categories.
- Reversible browser-local block and trust lists with saved-state verification.
- Controlled sensitive-interaction warnings that never submit or store values.
- English and European Portuguese interface.
- Automated security and scenario tests.

## Controlled demonstration

The canonical presentation route is `/en/teacher-demo`, with a Portuguese equivalent at `/pt-PT/teacher-demo`. Organisations, threat reputation and deceptive scenarios are fictional. URL/domain logic, the risk engine, UI, local persistence, bilingual implementation and automated tests are functional code.

No real credentials, private information, browsing history or live threat-service data are collected.

## Run locally

Node.js 22.13 or newer is required.

```bash
npm install
npm run dev
```

Open the local address printed by the development server. See [the teacher demonstration runbook](docs/TEACHER_DEMO_RUNBOOK_V0.1.md) for the exact 3–5 minute sequence.

## Quality checks

```bash
npm run evaluate
npm run test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

`npm run evaluate` executes the controlled 25-scenario technical evaluation and writes a machine-readable reasoning log to `evaluation/results/evaluation-results.json`. It does not contact live websites or external threat-intelligence services.

## Architecture

- `app/` — App Router entry, localized route, metadata and visual foundation.
- `components/` — URL form, results, actions, controlled scenarios, teacher route and settings.
- `security/` — parsing, identity, provider abstraction, deterministic risk logic and local persistence.
- `i18n/` — English and European Portuguese interface copy.
- `evaluation/` — controlled scenario definitions, runner and machine-readable result evidence.
- `tests/` — unit tests and deterministic scenario matrix.
- `docs/` — scope, methodology, safety, deployment readiness, runbook and freeze record.

The local provider implements the same normalized contract intended for future verified external threat-intelligence services. No external provider is currently integrated, and no credentials are committed.

## Limitations

No result means “safe.” A missing reputation match means only that no known threat was found in the sources checked. HTTPS does not prove identity or trustworthiness. A domain match does not guarantee safe content. Similarity signals can produce false positives or false negatives.

Registrable-domain handling uses a controlled public-suffix subset for the V0.1 scenarios. Production use would require a complete, maintained Public Suffix List implementation or equivalent trusted library. Local blocks apply only inside this prototype, not across the browser or device.

## Future online integration

A reviewed future version could replace the local provider with verified external providers while preserving the normalized interface, security signals, risk engine and explanation workflow. This is architecture only, not a current capability.

The prototype is feature-frozen for local teacher demonstration. It has not been deployed or validated in real-world use.
