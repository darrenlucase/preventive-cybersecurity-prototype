import type {
  IdentityResult,
  ParsedUrl,
  RiskAssessment,
  RiskEvidence,
  RiskLevel,
  SensitiveRequest,
  ThreatResult,
} from "./types";
import { analyseSimilarity } from "./url";

export function assessRisk(
  parsed: ParsedUrl,
  threat: ThreatResult,
  identity: IdentityResult,
  sensitive: SensitiveRequest,
): RiskAssessment {
  const evidence: RiskEvidence[] = [];
  const knownThreat = threat.state === "KNOWN_MALICIOUS" || threat.state === "KNOWN_PHISHING";
  const identityMismatch = identity.state === "DOMAIN_MISMATCH";
  let similaritySignal = false;
  let misleadingSubdomain = false;

  if (knownThreat) {
    evidence.push({
      id: "known-threat",
      kind: "known",
      title: threat.state === "KNOWN_PHISHING" ? "Known phishing signal detected" : "Known malicious signal detected",
      detail: "This address appears in the local fictional threat dataset.",
    });
  } else if (threat.state === "NO_KNOWN_MATCH") {
    evidence.push({
      id: "no-match",
      kind: "unknown",
      title: "No known threat found",
      detail: "No known threat was found in the sources checked. This is not proof that the website is safe.",
    });
  } else {
    evidence.push({
      id: "unknown-reputation",
      kind: "unknown",
      title: "Reputation is unknown",
      detail: "The source checked cannot provide a positive or negative reputation result.",
    });
  }

  if (identity.state === "VERIFIED_MATCH") {
    evidence.push({
      id: "identity-match",
      kind: "known",
      title: "Demo identity record matches",
      detail: `The registrable domain matches ${identity.claimedOrganisation?.name}’s fictional demonstration record. This does not mean the website is safe.`,
    });
  }

  if (identityMismatch) {
    evidence.push({
      id: "identity-mismatch",
      kind: "signal",
      title: "Claimed identity could not be verified",
      detail: `The registrable domain is not listed for ${identity.claimedOrganisation?.name} in this controlled demonstration. A mismatch is a risk signal, not proof of criminality.`,
    });
    const similarity = analyseSimilarity(parsed, identity.claimedOrganisation?.domains ?? []);
    similaritySignal = similarity.similar;
    misleadingSubdomain = similarity.misleadingSubdomain;
    if (misleadingSubdomain) {
      evidence.push({
        id: "misleading-subdomain",
        kind: "signal",
        title: "Misleading subdomain signal",
        detail: `The organisation’s demo domain appears on the left, but ${parsed.registrableDomain} is the domain controlling this address in the current implementation.`,
      });
    } else if (similaritySignal) {
      evidence.push({
        id: "lookalike",
        kind: "signal",
        title: "Domain similarity signal",
        detail: `This domain closely resembles ${similarity.closestDomain}. Similarity is a warning signal, not proof of phishing.`,
      });
    }
  }

  if (parsed.hasPunycode) {
    evidence.push({
      id: "punycode",
      kind: "signal",
      title: "Encoded internationalised domain",
      detail: "The hostname contains punycode. It may be legitimate, but visually confusing characters deserve extra care.",
    });
  }
  if (!parsed.usesHttps) {
    evidence.push({
      id: "http",
      kind: "signal",
      title: "Connection is not encrypted",
      detail: "Information sent over HTTP may be exposed in transit.",
    });
  }
  if (sensitive) {
    evidence.push({
      id: "sensitive",
      kind: "signal",
      title: `Sensitive ${sensitive} request`,
      detail: "This controlled page asks for sensitive information. No value is collected or stored.",
    });
  }
  evidence.push({
    id: "https-limit",
    kind: "limitation",
    title: "HTTPS is not identity proof",
    detail: "HTTPS protects the connection but does not prove the identity or trustworthiness of the website.",
  });

  let level: RiskLevel;
  if (knownThreat && (identityMismatch || Boolean(sensitive))) {
    level = "CRITICAL";
  } else if (knownThreat || (identityMismatch && Boolean(sensitive)) || (misleadingSubdomain && Boolean(sensitive))) {
    level = "HIGH";
  } else if (identityMismatch || Boolean(sensitive) || parsed.hasPunycode || !parsed.usesHttps || similaritySignal) {
    level = "CAUTION";
  } else if (threat.state === "UNKNOWN" || threat.state === "PROVIDER_UNAVAILABLE") {
    level = "UNKNOWN";
  } else {
    level = "LOW_EVIDENCE";
  }

  const recommendation = level === "CRITICAL"
    ? "LEAVE_AND_BLOCK"
    : level === "HIGH"
      ? "LEAVE"
      : level === "CAUTION" || level === "UNKNOWN"
        ? "VERIFY_INDEPENDENTLY"
        : "PROCEED_WITH_CARE";

  return {
    level,
    confidence: knownThreat ? "HIGH" : identity.state !== "NO_CLAIM" ? "MODERATE" : "LIMITED",
    evidence,
    recommendation,
    limitations: [
      "Signals can produce false positives or false negatives.",
      "This prototype does not inspect site content or prove who operates a domain.",
      "An identity match does not guarantee that every action on a website is safe.",
      "Production-grade registrable-domain handling requires a complete, maintained Public Suffix List implementation or equivalent trusted library.",
    ],
  };
}
