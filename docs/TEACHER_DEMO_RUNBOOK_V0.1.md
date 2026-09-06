# Teacher Demonstration Runbook V0.1

## Preparation

1. Use a current desktop browser at approximately 1280×800 or larger.
2. Run `npm install`, then `npm run dev`.
3. Open `/en/settings` and select **Reset demo data**. This clears only the prototype block and trust lists.
4. Confirm `/en` loads and the language switch shows `/pt-PT`.
5. Open `/en/teacher-demo` and confirm **Run analysis** is available.

## Demonstration sequence — approximately 3–5 minutes

1. **Homepage — 30 seconds.** Explain the audience: non-expert users in Portugal. Point to the preventive purpose and the Detect → Explain → Prevent / Block → Act → Verify workflow.
2. **Teacher route — 20 seconds.** Open `/en/teacher-demo`. Read the controlled-demo notice: organisations and reputation are fictional; the working analysis and action workflow are real.
3. **Analysis — 40 seconds.** Select **Run analysis**. Show the actual registrable domain, claimed fictional identity, known fictional phishing signal, password request and critical risk state.
4. **Explanation — 45 seconds.** Use the evidence categories to distinguish known test data, similarity signals, unknowns and limitations. Emphasize that HTTPS does not prove identity.
5. **Protect and verify — 30 seconds.** Select **Block in this prototype**. Read **Protection updated** and **Blocked in this prototype**. Explain that the block is local to this browser and prototype.
6. **Reversibility — 30 seconds.** Open **Settings**, show the saved domain, then remove it. Read the confirmation that it was removed from the local block list.
7. **Language — 20 seconds.** Switch to European Portuguese and show that warnings, actions and accessibility labels remain localized.
8. **Methodology — 45 seconds.** Finish on `/pt-PT/methodology` or `/en/methodology`. Explain deterministic rules, false positives/negatives, the controlled Public Suffix List limitation and why AI is not required.
9. **Future connection — 20 seconds.** Show the current-local versus future-online architecture. State clearly that no external provider is integrated today.

## Backup

- If saved state is unexpected, open Settings and select **Reset demo data**.
- If the canonical result does not appear, open `/en/demo` and run **Known fictional phishing domain**.
- Direct routes: `/en`, `/en/teacher-demo`, `/en/demo`, `/en/settings`, `/en/methodology`.
- A browser-console reset is not required and should not be used during the presentation.
- Do not replace a failed working demonstration with screenshots; restart the local server and use the alternate scenario.
