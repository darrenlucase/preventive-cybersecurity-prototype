# Controlled Technical Evaluation Plan V0.1

## Purpose

This evaluation checks whether the feature-frozen prototype behaves as documented against fictional, controlled inputs. It evaluates technical consistency, not community impact or real-world phishing-detection accuracy.

## Frozen boundary

- No product features, live providers, API keys, telemetry, real suspicious sites, users, credentials or malware are introduced.
- The evaluator calls the same URL parsing, identity, reputation-provider, risk and local-storage functions used by the application.
- Expected results are declared before execution. A failed result is recorded before any correction is considered.
- Product code may change only for a documented implementation defect that does not expand scope. No product correction was required in this evaluation.

## Evaluation categories

| Code | Category | Evidence source |
|---|---|---|
| A | URL/domain interpretation | Parsed URL trace |
| B | Threat reputation | Local provider, unavailable-provider placeholder, or declared controlled state |
| C | Identity verification | Fictional organisation registry comparison |
| D | Lookalike/similarity signals | Production similarity analysis |
| E | Misleading subdomains | Parsed registrable domain and subdomain evidence |
| F | Sensitive interaction context | Declared fictional interaction type |
| G | Risk classification | Production deterministic risk engine |
| H | Recommended action | Production recommendation output |
| I | Block/verify state | Production storage functions plus browser-controlled UI dry run |
| J | Language consistency | Critical English/pt-PT pairs and human meaning review |
| K | False-positive resistance | Declared controlled benign subset |
| L | False-negative exposure | Declared controlled expected-danger subset and limitation analysis |
| M | Limitation communication | Engine limitations and HTTPS limitation evidence |

## Evidence-quality categories

- **KNOWN:** a record in the local fictional threat dataset.
- **VERIFIED:** a domain matching a controlled fictional registry entry.
- **SIGNAL:** a structural or similarity observation that may increase suspicion.
- **CONTEXT:** a controlled sensitive-information request.
- **UNKNOWN:** insufficient or absent evidence.
- **LIMITATION:** something the prototype cannot determine or guarantee.

## Objective pass rule

A scenario passes only when all six conditions are true:

1. The provider state matches the predeclared state.
2. The risk result is in the predeclared allowed range.
3. Every mandatory evidence item is present.
4. The recommended action has the expected protective direction.
5. No prohibited claim is produced.
6. Limitation language, including the HTTPS limitation, is present.

No scenario in V0.1 uses a multi-state acceptable range; each has one expected risk result.

## Claim discipline

The evaluator checks that outputs do not make a positive safety claim, infer trust from HTTPS, infer safety from identity alignment, call similarity alone confirmed phishing, describe a site as illegal, state that the user was hacked, imply system-wide blocking, or claim a live provider is connected.

## Metrics and reproduction

- Pass percentage: passed scenarios divided by total scenarios.
- Controlled evaluation false positive: a declared benign scenario classified **HIGH** or **CRITICAL**.
- Controlled evaluation false negative: a declared expected-danger scenario classified **LOW_EVIDENCE** or **UNKNOWN**.
- These definitions are evaluation-specific, not real-world accuracy measures.

Run `npm run evaluate`. The runner writes the actual reasoning trace and summary to `evaluation/results/evaluation-results.json`.
