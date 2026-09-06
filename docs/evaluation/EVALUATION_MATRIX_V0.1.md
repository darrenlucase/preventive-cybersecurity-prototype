# Controlled Evaluation Matrix V0.1

All addresses use the reserved `.test` space and all organisation/reputation data is fictional. Expected results were declared before the completed evaluation run.

| ID | Family | Controlled condition | Expected risk | Mandatory evidence | Expected action |
|---|---|---|---|---|---|
| EVAL-001 | Benign | HTTPS unfamiliar domain | LOW_EVIDENCE | no-match, HTTPS limitation | Proceed with care |
| EVAL-002 | Benign | HTTP unfamiliar domain | CAUTION | no-match, HTTP, limitation | Verify independently |
| EVAL-003 | Benign | Verified fictional domain | LOW_EVIDENCE | no-match, identity match, limitation | Proceed with care |
| EVAL-004 | Benign | Verified domain + login request | CAUTION | identity match, sensitive context, limitation | Verify independently |
| EVAL-005 | Benign | Common-word partial similarity | LOW_EVIDENCE | no-match, limitation | Proceed with care |
| EVAL-006 | Reputation | Known fictional phishing + mismatch | CRITICAL | known threat, mismatch, similarity, limitation | Leave and block |
| EVAL-007 | Reputation | Known fictional malicious domain | HIGH | known threat, limitation | Leave |
| EVAL-008 | Reputation | No known reputation match | LOW_EVIDENCE | no-match, limitation | Proceed with care |
| EVAL-009 | Reputation | Provider unavailable | UNKNOWN | unknown reputation, limitation | Verify independently |
| EVAL-010 | Reputation | Provider returns unknown | UNKNOWN | unknown reputation, limitation | Verify independently |
| EVAL-011 | Identity | Exact fictional parcel-domain claim | LOW_EVIDENCE | identity match, no-match, limitation | Proceed with care |
| EVAL-012 | Identity | Claim on unrelated domain | CAUTION | mismatch, no-match, limitation | Verify independently |
| EVAL-013 | Identity | Claim on lookalike domain | CAUTION | mismatch, similarity, limitation | Verify independently |
| EVAL-014 | Identity | No organisation claim | LOW_EVIDENCE | no-match, limitation | Proceed with care |
| EVAL-015 | Similarity | One-character typo + malicious record | CRITICAL | known threat, mismatch, similarity, limitation | Leave and block |
| EVAL-016 | Similarity | Added login word, no known match | CAUTION | mismatch, similarity, no-match, limitation | Verify independently |
| EVAL-017 | Similarity | Valid fictional punycode address | CAUTION | mismatch, similarity, punycode, limitation | Verify independently |
| EVAL-018 | Similarity | Benign partial-word resemblance | LOW_EVIDENCE | no-match, limitation | Proceed with care |
| EVAL-019 | Subdomain | Organisation text before another domain | CAUTION | mismatch, misleading subdomain, limitation | Verify independently |
| EVAL-020 | Subdomain | Nested benign subdomains | LOW_EVIDENCE | no-match, limitation | Proceed with care |
| EVAL-021 | Sensitive | Unknown site requests credentials | CAUTION | unknown reputation, context, limitation | Verify independently |
| EVAL-022 | Sensitive | Verified domain requests credentials | CAUTION | identity match, context, limitation | Verify independently |
| EVAL-023 | Sensitive | Mismatched identity requests credentials | HIGH | mismatch, context, limitation | Leave |
| EVAL-024 | Sensitive | Known phishing + mismatch + credentials | CRITICAL | known threat, mismatch, similarity, context, limitation | Leave and block |
| EVAL-025 | Sensitive | Unknown site, no sensitive request | UNKNOWN | unknown reputation, limitation | Verify independently |

## Prohibited output

Every scenario prohibits a positive safety claim, “confirmed phishing” from similarity alone, “illegal website,” “you have been hacked,” system-wide blocking claims, and live-provider claims. Full predeclared inputs and rationales are in `evaluation/scenarios.ts`; actual output is stored separately so expectations are not rewritten after execution.
