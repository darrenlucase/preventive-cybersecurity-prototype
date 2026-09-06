export type ThreatState = "KNOWN_MALICIOUS" | "KNOWN_PHISHING" | "NO_KNOWN_MATCH" | "UNKNOWN" | "PROVIDER_UNAVAILABLE";
export type IdentityState = "VERIFIED_MATCH" | "DOMAIN_MISMATCH" | "UNVERIFIED" | "NO_CLAIM";
export type RiskLevel = "CRITICAL" | "HIGH" | "CAUTION" | "LOW_EVIDENCE" | "UNKNOWN";
export type SensitiveRequest = "password" | "payment" | "personal" | "permission" | null;

export type ParsedUrl = {
  fullUrl: string;
  protocol: string;
  hostname: string;
  unicodeHostname: string;
  registrableDomain: string;
  subdomain: string;
  path: string;
  usesHttps: boolean;
  hasPunycode: boolean;
};

export type ThreatResult = {
  state: ThreatState;
  providerName: string;
  checkedAt: string;
  evidence: string[];
};

export type Organisation = {
  id: string;
  name: string;
  domains: string[];
  fictional: true;
};

export type IdentityResult = {
  state: IdentityState;
  claimedOrganisation?: Organisation;
  matchedDomain?: string;
};

export type RiskEvidence = {
  id: string;
  kind: "known" | "likely" | "signal" | "unknown" | "limitation";
  title: string;
  detail: string;
};

export type RiskAssessment = {
  level: RiskLevel;
  confidence: "HIGH" | "MODERATE" | "LIMITED";
  evidence: RiskEvidence[];
  recommendation: "LEAVE_AND_BLOCK" | "LEAVE" | "VERIFY_INDEPENDENTLY" | "PROCEED_WITH_CARE";
  limitations: string[];
};
