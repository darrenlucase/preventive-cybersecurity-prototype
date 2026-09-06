# Security Model V0.1

## Defensive workflow

1. **Detect:** parse the submitted address and gather local reputation, claimed identity, similarity, transport, and controlled interaction signals.
2. **Explain:** label each item as known evidence, a signal, an unknown, or a limitation.
3. **Prevent / block:** recommend pausing or leaving before sensitive data is entered.
4. **Act:** offer leave, local block, local trust, or independently opened verified-demo destination actions.
5. **Verify:** read browser-local state back and state exactly which domain is blocked.

## Trust boundaries

The browser is trusted only to keep local user choices. URL input is treated as untrusted and parsed with the platform URL parser. Only HTTP and HTTPS addresses are accepted. No submitted URL is transmitted in local mode. `.test` identities and threat entries are fictional.

## Threats considered

Impersonation, typo/lookalike domains, misleading subdomains, encoded hostnames, insecure transport, known fictional threat matches, and requests for sensitive information in controlled pages.

## Explicit non-capabilities

The app does not fetch or execute a checked website, scan devices, inspect traffic, capture credentials, test vulnerabilities, or claim comprehensive phishing prevention.
