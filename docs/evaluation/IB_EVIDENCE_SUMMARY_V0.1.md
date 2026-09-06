# IB Evidence Summary V0.1

## What I evaluated

The feature-frozen prototype's technical behavior across URL interpretation, fictional reputation, identity matching, similarity, subdomain interpretation, sensitive context, risk classification, recommended actions, local protection state and bilingual security meaning.

## How I evaluated it

A predeclared matrix of 25 fictional `.test` scenarios was executed through the production security modules. Expected risk, mandatory evidence, action direction, prohibited claims and limitations were compared with actual output. The local block workflow was also dry-run through the interface.

## Why controlled testing was used

Controlled inputs make the evaluation deterministic, repeatable and safe. They avoid real suspicious websites, victims, credentials, malware and unsupported claims of real-world validation.

## What worked

- 25/25 scenarios passed.
- Strong, weak and unknown evidence remained distinguishable.
- HTTPS and no-known-match results did not become safety claims.
- Identity, lookalike and misleading-subdomain behavior matched documented rules.
- Block, verify, refresh/recheck and unblock behavior passed.
- English and European Portuguese critical meaning checks passed.

## What did not work or required attention

- An initial synthetic punycode input was invalid and was corrected before the completed run. This was an evaluation-input error, not a product defect.
- The type checker found a redundant literal comparison in the evaluation harness. It was corrected without changing the language criteria or product behavior.
- Block and trust lists can contain the same domain. This is documented as a low-severity design limitation.

## What I learned

**STUDENT REFLECTION PROMPT:** What surprised you most when comparing expected and actual results?

**STUDENT REFLECTION PROMPT:** Which limitation most changed how you would describe the prototype's value?

**STUDENT REFLECTION PROMPT:** Why is preserving UNKNOWN more honest than forcing every website into safe/dangerous categories?

## What limitations remain

The data and organisations are fictional, domain-suffix handling is limited, arbitrary content is not inspected, local blocking is not system-wide, and controlled results do not establish real-world effectiveness or user impact.

## How the evaluation could inform future improvement

After the current project stage—not as part of V0.1—the findings could guide evaluation of a maintained public-suffix implementation, explicit block/trust precedence, verified external reputation sources and carefully scoped browser interaction context.

**STUDENT REFLECTION PROMPT:** Which future improvement would you prioritise, and what evidence from this evaluation supports that choice?
