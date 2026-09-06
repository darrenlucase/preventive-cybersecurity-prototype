import type { IdentityResult, Organisation } from "./types";
import type { ParsedUrl } from "./types";

export const organisations: Organisation[] = [
  { id: "lusitania-bank", name: "Lusitania Bank Demo", domains: ["lusitaniabank.test"], fictional: true },
  { id: "atlantic-parcel", name: "Atlantic Parcel Demo", domains: ["atlanticparcel.test"], fictional: true },
  { id: "portuguese-services", name: "Portuguese Services Demo", domains: ["servicesportugal.test"], fictional: true },
];

export function verifyIdentity(parsed: ParsedUrl, organisationId?: string): IdentityResult {
  if (!organisationId) return { state: "NO_CLAIM" };
  const organisation = organisations.find((item) => item.id === organisationId);
  if (!organisation) return { state: "UNVERIFIED" };
  const matchedDomain = organisation.domains.find((domain) => parsed.registrableDomain === domain);
  return matchedDomain
    ? { state: "VERIFIED_MATCH", claimedOrganisation: organisation, matchedDomain }
    : { state: "DOMAIN_MISMATCH", claimedOrganisation: organisation };
}
