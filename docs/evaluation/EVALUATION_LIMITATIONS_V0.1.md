# Controlled Evaluation Limitations V0.1

1. **Designed inputs:** the 25 scenarios test documented rules; they are not a representative internet sample.
2. **Fictional reputation:** known-threat results come from a small local dataset, not a live service.
3. **Fictional identity registry:** a match confirms only alignment with a controlled entry.
4. **Limited public-suffix handling:** the parser uses a documented subset, not a complete maintained Public Suffix List.
5. **Selected signals only:** arbitrary page content, redirects, network behavior, certificates, hosting history and operator identity are not evaluated.
6. **Similarity limits:** edit distance, added words and punycode can miss deceptive domains or flag legitimate resemblance.
7. **Controlled sensitive context:** the interaction type is supplied by the demo; V0.1 does not inspect real forms.
8. **Local state only:** blocking and trust apply only to this prototype's browser storage.
9. **Conflict precedence:** block and trust are independent; the same domain can appear in both. This is the recorded low-severity design warning.
10. **Language method:** automated checks and human review do not constitute professional linguistic certification.
11. **UI coverage:** one canonical state-machine path was dry-run, not every browser and device combination.
12. **No user/community evidence:** usability, behavior change, adoption and impact in Portugal were not measured.
13. **No real-world accuracy:** controlled false-positive and false-negative counts cannot be generalized to real websites.

The evaluation demonstrates repeatable behavior against the current specification only.
