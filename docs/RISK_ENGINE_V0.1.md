# Risk Engine V0.1

The engine is deterministic. It uses explicit documented conditions, not AI, hidden scoring or arbitrary numerical weights.

- `CRITICAL`: a known fictional threat match combined with either an identity mismatch or a controlled sensitive-information request.
- `HIGH`: a known fictional threat match by itself, or an identity mismatch combined with a controlled sensitive request.
- `CAUTION`: an identity mismatch, sensitive request, punycode signal, insecure HTTP or explicit similarity signal without the stronger combinations above.
- `UNKNOWN`: the reputation provider is unknown/unavailable and no stronger signal applies.
- `LOW_EVIDENCE`: no stronger signal applies. This is never presented as safe.

Evidence quality is high for a known local dataset match, moderate when an explicit identity comparison exists, and limited otherwise. Every result includes limitations and the HTTPS identity caveat.
