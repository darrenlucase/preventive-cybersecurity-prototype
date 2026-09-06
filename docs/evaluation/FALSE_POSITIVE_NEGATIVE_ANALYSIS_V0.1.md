# False-Positive and False-Negative Analysis V0.1

## Controlled definitions and result

A **controlled evaluation false positive** is a declared benign scenario classified HIGH or CRITICAL. A **controlled evaluation false negative** is a declared expected-danger scenario classified LOW_EVIDENCE or UNKNOWN. These thresholds are evaluation rules, not real-world performance measures.

- Benign subset: 12 scenarios; 0 controlled false positives.
- Expected-danger subset: 5 scenarios; 0 controlled false negatives.

## Potential false-positive exposure

| Trigger | Controlled result | Acceptable? | User consequence | Mitigation | Remaining limitation |
|---|---|---|---|---|---|
| Legitimate HTTP site | CAUTION | Yes | A legitimate interaction may be delayed | Explain transport risk without accusing the operator | HTTP cannot establish intent |
| Verified fictional site requesting credentials | CAUTION | Yes | A normal login receives extra friction | State identity alignment while recommending care | Context cannot determine whether a request is appropriate |
| Added login/security word with identity claim | CAUTION | Yes | A legitimate alternate domain may be questioned | Use similarity-signal language and independent verification | Small registry cannot recognise legitimate alternates |
| Benign partial-word resemblance without a claim | LOW_EVIDENCE | Yes | No strong interruption | Require a relevant claim for identity comparison | Other contextual resemblance may be missed |
| Unfamiliar HTTPS domain | LOW_EVIDENCE | Yes | Limited-evidence language, not reassurance | Preserve the no-known-threat limitation | Reputation absence remains ambiguous |

## Potential false-negative exposure

| Missing signal | Possible consequence | Why V0.1 may not detect it | Future mitigation category |
|---|---|---|---|
| New harmful domain with no record | May remain UNKNOWN or LOW_EVIDENCE | Local reputation covers only declared fictional records | Verified live threat intelligence |
| No claimed organisation | Identity comparison is unavailable | The engine does not invent a claim | Broader identity evidence |
| No obvious spelling similarity | Structural signal may be absent | Transparent similarity rules are intentionally narrow | Richer defensive reputation signals |
| HTTPS enabled | Connection may look reassuring | HTTPS protects transport, not operator identity | Stronger identity evidence and explicit limitation |
| Deceptive content outside declared context | Risk may be understated | V0.1 does not inspect arbitrary page content | Future browser interaction context |
| Harmful behavior after initial check | Later state is not observed | No continuous monitoring exists | Future browser-level monitoring architecture |

No attack procedure or evasion technique is provided. These are defensive coverage limitations.
