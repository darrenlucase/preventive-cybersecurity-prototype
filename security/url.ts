import type { ParsedUrl } from "./types";

const MULTI_PART_SUFFIXES = new Set(["co.uk", "org.uk", "com.pt", "org.pt", "gov.pt", "edu.pt", "co.jp", "com.au"]);

export function getRegistrableDomain(hostname: string): string {
  const clean = hostname.toLowerCase().replace(/\.$/, "");
  if (clean === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(clean)) return clean;
  const labels = clean.split(".").filter(Boolean);
  if (labels.length <= 2) return clean;
  const lastTwo = labels.slice(-2).join(".");
  return MULTI_PART_SUFFIXES.has(lastTwo) ? labels.slice(-3).join(".") : lastTwo;
}

export function parseUrl(input: string): ParsedUrl {
  const normalized = /^[a-z][a-z\d+.-]*:\/\//i.test(input.trim()) ? input.trim() : `https://${input.trim()}`;
  const url = new URL(normalized);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Only HTTP and HTTPS website addresses can be checked.");
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  const registrableDomain = getRegistrableDomain(hostname);
  const subdomain = hostname === registrableDomain ? "" : hostname.slice(0, -(registrableDomain.length + 1));
  let unicodeHostname = hostname;
  try { unicodeHostname = new URL(`https://${hostname}`).hostname; } catch { /* keep ASCII form */ }
  return {
    fullUrl: url.toString(), protocol: url.protocol.replace(":", ""), hostname, unicodeHostname,
    registrableDomain, subdomain, path: `${url.pathname}${url.search}${url.hash}`, usesHttps: url.protocol === "https:",
    hasPunycode: hostname.split(".").some((label) => label.startsWith("xn--")),
  };
}

export function levenshtein(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) rows[i][0] = i;
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return rows[a.length][b.length];
}

export function analyseSimilarity(actual: ParsedUrl, officialDomains: string[]) {
  const result = { similar: false, misleadingSubdomain: false, punycode: actual.hasPunycode, closestDomain: "", distance: Infinity };
  for (const official of officialDomains) {
    if (actual.hostname.endsWith(`.${official}`) || actual.hostname === official) continue;
    const misleading = actual.hostname.includes(`${official}.`) || actual.subdomain.split(".").includes(official);
    const actualLabel = actual.registrableDomain.split(".")[0].replace(/[-_]/g, "");
    const officialLabel = official.split(".")[0].replace(/[-_]/g, "");
    const distance = levenshtein(actualLabel, officialLabel);
    const addedWords = actualLabel.includes(officialLabel) || officialLabel.includes(actualLabel);
    if (distance < result.distance) { result.distance = distance; result.closestDomain = official; }
    result.misleadingSubdomain ||= misleading;
    result.similar ||= misleading || addedWords || (distance > 0 && distance <= 2) || actual.hasPunycode;
  }
  return result;
}
