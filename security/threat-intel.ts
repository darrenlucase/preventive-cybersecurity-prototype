import type { ThreatResult, ThreatState } from "./types";
import type { ParsedUrl } from "./types";

export interface ThreatIntelProvider {
  providerName: string;
  checkUrl(url: string): Promise<ThreatResult>;
  checkDomain(domain: string): Promise<ThreatResult>;
}

const DEMO_THREATS: Record<string, ThreatState> = {
  "lusitania-bank-login.test": "KNOWN_PHISHING",
  "lusitaniabarnk.test": "KNOWN_MALICIOUS",
  "malicious-demo.test": "KNOWN_MALICIOUS",
};

export class LocalThreatIntelProvider implements ThreatIntelProvider {
  providerName = "Local deterministic demonstration dataset";
  private result(domain: string): ThreatResult {
    const state = DEMO_THREATS[domain] ?? (domain.includes("unknown-new") ? "UNKNOWN" : "NO_KNOWN_MATCH");
    return { state, providerName: this.providerName, checkedAt: new Date().toISOString(), evidence: state.startsWith("KNOWN_") ? [`${domain} is listed in the local fictional test dataset.`] : ["No matching entry exists in the local fictional test dataset."] };
  }
  async checkUrl(url: string) { return this.result(new URL(url).hostname); }
  async checkDomain(domain: string) { return this.result(domain); }
}

export class OnlineThreatIntelProviderPlaceholder implements ThreatIntelProvider {
  providerName = "Online provider (not configured)";
  private unavailable(): ThreatResult { return { state: "PROVIDER_UNAVAILABLE", providerName: this.providerName, checkedAt: new Date().toISOString(), evidence: ["No online provider or API key is configured."] }; }
  async checkUrl(url: string) { void url; return this.unavailable(); }
  async checkDomain(domain: string) { void domain; return this.unavailable(); }
}

export async function checkThreat(parsed: ParsedUrl) {
  const provider: ThreatIntelProvider = new LocalThreatIntelProvider();
  return provider.checkUrl(parsed.fullUrl);
}
