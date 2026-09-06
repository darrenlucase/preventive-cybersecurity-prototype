# Privacy and Safety V0.1

## Data practice

No account, analytics, cookies for tracking, browsing-history store, email access, call/SMS access, file access, or server database is used. Checked URLs remain in current UI memory. Blocked and trusted domains are saved only in browser local storage with their creation time and, for blocks, the risk-level reason.

Controlled sensitive forms prevent submission. Values are never read, transmitted, or stored. Users are told never to enter real information.

## Defensive boundary

No exploit code, malware, credential capture, phishing kit, bypass, cracking, intrusion, persistence, or real organisation cloning is included. Every simulated organisation and threat record is fictional.

## Future online provider minimisation

If a future provider is enabled, its adapter must document whether it transmits a full URL, hash prefix, or registrable domain; send the minimum required; expose the provider name and check time; keep keys in environment variables; and return `PROVIDER_UNAVAILABLE` on failure rather than silently degrading.
