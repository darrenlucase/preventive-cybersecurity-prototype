export type LocalEntry = { domain: string; reason?: string; createdAt: string };
export const BLOCK_KEY = "preventive-cybersecurity-prototype.blocked.v01";
export const TRUST_KEY = "preventive-cybersecurity-prototype.trusted.v01";

export function readEntries(key: string, storage?: Pick<Storage, "getItem">): LocalEntry[] {
  if (!storage) return [];
  try { const value = JSON.parse(storage.getItem(key) ?? "[]"); return Array.isArray(value) ? value.filter((item) => item && typeof item.domain === "string") : []; } catch { return []; }
}
export function saveEntry(key: string, entry: LocalEntry, storage: Pick<Storage, "getItem" | "setItem">) {
  const next = [entry, ...readEntries(key, storage).filter((item) => item.domain !== entry.domain)]; storage.setItem(key, JSON.stringify(next)); return next;
}
export function removeEntry(key: string, domain: string, storage: Pick<Storage, "getItem" | "setItem">) {
  const next = readEntries(key, storage).filter((item) => item.domain !== domain); storage.setItem(key, JSON.stringify(next)); return next;
}
export function isStored(key: string, domain: string, storage: Pick<Storage, "getItem">) { return readEntries(key, storage).some((item) => item.domain === domain); }
