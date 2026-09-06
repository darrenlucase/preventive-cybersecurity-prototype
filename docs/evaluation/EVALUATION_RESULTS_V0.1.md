# Controlled Technical Evaluation Results V0.1

## Executive summary

The completed run produced the expected risk classification, mandatory evidence and protective action in **25 of 25 controlled scenarios (100%)**. This demonstrates correct behavior against the declared V0.1 criteria. It does not establish real-world phishing-detection accuracy.

## Scope and method

The runner used fictional `.test` domains, the local deterministic provider, the unavailable-provider placeholder and explicitly declared controlled provider states. It called production parsing, identity, risk and storage functions directly; it did not reproduce the product's decision logic.

## Results

| Measure | Result |
|---|---:|
| Controlled scenarios | 25 |
| Passed | 25 |
| Failed | 0 |
| Pass percentage | 100% |
| Declared benign scenarios | 12/12 passed |
| Declared expected-danger scenarios | 5/5 passed |
| Claim-discipline checks | 8/8 passed |
| English/pt-PT automated checks | 16/16 passed |
| Automated block/verify state checks | Passed |
| Browser-controlled UI checkpoints | 7/7 passed |
| Controlled evaluation false positives | 0 |
| Controlled evaluation false negatives | 0 |

## Scenario matrix outcome

| IDs | Result | Actual behavior |
|---|---|---|
| EVAL-001–005 | PASS | Benign baselines remained LOW_EVIDENCE or CAUTION as declared. |
| EVAL-006–010 | PASS | Known threats strongly affected severity; unavailable/unknown remained UNKNOWN. |
| EVAL-011–014 | PASS | Match verified only claim/domain alignment; mismatches remained signals. |
| EVAL-015–018 | PASS | Typo, added-word and punycode signals were transparent; benign resemblance did not escalate. |
| EVAL-019–020 | PASS | Controlling registrable domains were identified; benign nesting did not escalate. |
| EVAL-021–025 | PASS | Sensitive context increased caution only under documented conditions. |

Every scenario's actual input, parsed domain, signals, decision, recommendation, limitations and expected-versus-actual checks are in `evaluation/results/evaluation-results.json`.

## Failures and warnings

- **Completed scenario failures:** none.
- **TEST_EXPECTATION_ERROR, pre-execution:** the first synthetic punycode fixture was not a valid URL. It was replaced with the repository's existing validated fictional punycode fixture before scenario execution. No product behavior changed.
- **IMPLEMENTATION_DEFECT, evaluation harness:** the first language-presence check included a redundant comparison between disjoint TypeScript literal unions. The comparison was removed; the non-empty bilingual pair check is unchanged. No product behavior changed.
- **DESIGN_LIMITATION, low severity:** block and trust are independent lists, so the same domain can exist in both. The behavior is deterministic and documented, but a future version should define precedence. It does not block the teacher demonstration.

### V0.1 evaluation corrections

| File | Reason | Before | After | Affected check | Scope expansion |
|---|---|---|---|---|---|
| `evaluation/scenarios.ts` | Invalid synthetic punycode fixture | URL construction stopped before execution | Existing validated fictional fixture is used | EVAL-017 | None |
| `evaluation/evaluation-runner.ts` | Redundant literal-union comparison failed typecheck | Language presence expression was not type-valid | Both localized values are checked for presence | Language consistency | None |

No production application or security-engine file was modified.

## Claim discipline

All 8 checks passed. `NO_KNOWN_MATCH`, HTTPS and identity alignment did not produce a safety verdict; similarity alone did not produce confirmed-phishing language; no illegal-site, hacked-user, system-wide-blocking or live-provider claim appeared.

## Block/verify results

The automated storage evaluation passed initial-unblocked, block, recheck, duplicate safety, conflict recording, remove and post-removal recheck conditions. A browser-controlled dry run separately confirmed:

1. Settings began empty.
2. Blocking produced “Protection updated” and explicit domain verification.
3. Browser refresh did not erase saved state.
4. Re-running analysis produced the blocking interstitial.
5. Settings displayed the saved entry.
6. Removal produced explicit confirmation and cleared the entry.
7. A later analysis returned to the normal result with the block action available.

Blocking remained explicitly scoped to this prototype and browser.

## Bilingual consistency

Ten critical message pairs and six Portuguese result/evidence phrases passed automated presence checks. A human meaning review found no material difference in security direction between English and European Portuguese. Literal word-for-word translation was not required.

## False positives, false negatives and conclusion

There were zero controlled evaluation false positives and zero controlled evaluation false negatives under the declared thresholds. These values describe only this designed matrix. The evaluation cannot measure live threat coverage, public-suffix completeness, deceptive page content, adoption, comprehension or community impact. Within its defined scope, V0.1 behaved as intended; real-world effectiveness remains unestablished.
