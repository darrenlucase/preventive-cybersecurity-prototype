import { verifyIdentity } from "./identity";
import { assessRisk } from "./risk";
import { checkThreat } from "./threat-intel";
import type { SensitiveRequest } from "./types";
import { parseUrl } from "./url";

export async function analyseUrl(url: string, organisationId?: string, sensitive: SensitiveRequest = null) {
  const parsed = parseUrl(url);
  const threat = await checkThreat(parsed);
  const identity = verifyIdentity(parsed, organisationId);
  const risk = assessRisk(parsed, threat, identity, sensitive);
  return { parsed, threat, identity, risk, sensitive };
}

export type Analysis = Awaited<ReturnType<typeof analyseUrl>>;
