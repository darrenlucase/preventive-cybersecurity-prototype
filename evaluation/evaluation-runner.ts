import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { messages } from "../i18n/messages";
import { verifyIdentity } from "../security/identity";
import { assessRisk } from "../security/risk";
import { BLOCK_KEY, TRUST_KEY, isStored, readEntries, removeEntry, saveEntry } from "../security/storage";
import { LocalThreatIntelProvider, OnlineThreatIntelProviderPlaceholder } from "../security/threat-intel";
import type { ThreatResult } from "../security/types";
import { parseUrl } from "../security/url";
import { evaluationScenarios, type EvaluationScenario } from "./scenarios";

const evaluationDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(evaluationDir, "..");
const outputPath = resolve(evaluationDir, "results/evaluation-results.json");

function controlledThreat(scenario: EvaluationScenario): ThreatResult {
  return {
    state: scenario.threatState,
    providerName: "Controlled evaluation input",
    checkedAt: new Date().toISOString(),
    evidence: ["Threat state supplied by the documented controlled evaluation matrix."],
  };
}

async function threatFor(scenario: EvaluationScenario, hostname: string): Promise<ThreatResult> {
  if (scenario.providerMode === "local") return new LocalThreatIntelProvider().checkDomain(hostname);
  if (scenario.providerMode === "unavailable") return new OnlineThreatIntelProviderPlaceholder().checkDomain(hostname);
  return controlledThreat(scenario);
}

function evidenceCategory(id: string) {
  if (id === "known-threat") return "KNOWN";
  if (id === "identity-match") return "VERIFIED";
  if (["identity-mismatch", "lookalike", "misleading-subdomain", "punycode", "http"].includes(id)) return "SIGNAL";
  if (id === "sensitive") return "CONTEXT";
  if (["no-match", "unknown-reputation"].includes(id)) return "UNKNOWN";
  return "LIMITATION";
}

function claimViolations(text: string) {
  const lower = text.toLowerCase();
  const violations: string[] = [];
  const safetySentences = lower.split(/[.!?]+/).filter((sentence) => sentence.includes("safe"));
  if (safetySentences.some((sentence) => !/(not proof|does not mean|does not guarantee|never labels|not establish)/.test(sentence))) violations.push("positive safety claim");
  if (lower.includes("confirmed phishing")) violations.push("confirmed phishing from similarity alone");
  if (lower.includes("illegal website")) violations.push("illegal website");
  if (lower.includes("you have been hacked")) violations.push("you have been hacked");
  if (lower.includes("system-wide block")) violations.push("system-wide blocking");
  if (lower.includes("live global threat")) violations.push("live provider claim");
  return violations;
}

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

function evaluateStorage() {
  const storage = new MemoryStorage();
  const domain = "evaluation-state.test";
  const checks: Array<{ name: string; passed: boolean; actual: unknown }> = [];
  checks.push({ name:"initially unblocked", passed:!isStored(BLOCK_KEY,domain,storage), actual:isStored(BLOCK_KEY,domain,storage) });
  saveEntry(BLOCK_KEY,{domain,reason:"controlled evaluation",createdAt:new Date().toISOString()},storage);
  checks.push({ name:"block is stored", passed:isStored(BLOCK_KEY,domain,storage), actual:isStored(BLOCK_KEY,domain,storage) });
  checks.push({ name:"recheck observes block", passed:isStored(BLOCK_KEY,domain,storage), actual:isStored(BLOCK_KEY,domain,storage) });
  saveEntry(BLOCK_KEY,{domain,reason:"duplicate",createdAt:new Date().toISOString()},storage);
  checks.push({ name:"duplicate block remains single entry", passed:readEntries(BLOCK_KEY,storage).length===1, actual:readEntries(BLOCK_KEY,storage).length });
  saveEntry(TRUST_KEY,{domain,createdAt:new Date().toISOString()},storage);
  const conflict = isStored(BLOCK_KEY,domain,storage) && isStored(TRUST_KEY,domain,storage);
  checks.push({ name:"trust/block conflict behavior recorded", passed:conflict, actual:"independent lists permit both states" });
  removeEntry(BLOCK_KEY,domain,storage);
  checks.push({ name:"remove clears block", passed:!isStored(BLOCK_KEY,domain,storage), actual:isStored(BLOCK_KEY,domain,storage) });
  checks.push({ name:"post-removal recheck is unblocked", passed:!isStored(BLOCK_KEY,domain,storage), actual:isStored(BLOCK_KEY,domain,storage) });
  removeEntry(TRUST_KEY,domain,storage);
  return { passed:checks.every((check)=>check.passed),checks,warning:"Block and trust are independent lists; the same domain can currently appear in both. This is a documented design limitation, not a silent failure." };
}

function evaluateLanguages() {
  const keys = ["sensitiveTitle","block","leave","protection","blockedInPrototype","removed","limits","checked","currentlyBlocked","invalid"] as const;
  const checks = keys.map((key)=>({ key, passed:Boolean(messages.en[key] && messages["pt-PT"][key]), english:messages.en[key], portuguese:messages["pt-PT"][key] }));
  const resultSource = readFileSync(resolve(projectRoot,"components/RiskResult.tsx"),"utf8");
  const requiredPortugueseEvidence = ["Risco crítico","PHISHING CONHECIDO","Reputação desconhecida","Não foi possível verificar a identidade alegada","Saia e bloqueie este domínio no protótipo","HTTPS não prova identidade ou confiança"];
  const evidenceChecks = requiredPortugueseEvidence.map((phrase)=>({ phrase, passed:resultSource.includes(phrase) }));
  return { passed:checks.every((check)=>check.passed)&&evidenceChecks.every((check)=>check.passed),pairChecks:checks,evidenceChecks,meaningReview:"Human-reviewed for equivalent security direction; literal word-for-word translation was not required." };
}

const scenarioResults = [];
for (const scenario of evaluationScenarios) {
  const parsed = parseUrl(scenario.url);
  const threat = await threatFor(scenario,parsed.hostname);
  const identity = verifyIdentity(parsed,scenario.organisationId);
  const risk = assessRisk(parsed,threat,identity,scenario.sensitive);
  const evidenceIds = risk.evidence.map((item)=>item.id);
  const outputText = [...risk.evidence.flatMap((item)=>[item.title,item.detail]),...risk.limitations,risk.level,risk.recommendation,identity.state,threat.providerName].join(". ");
  const violations = claimViolations(outputText);
  const checks = {
    providerState: threat.state === scenario.threatState,
    risk: scenario.expectedRisk.includes(risk.level),
    evidence: scenario.expectedEvidence.every((id)=>evidenceIds.includes(id)),
    action: scenario.expectedAction.includes(risk.recommendation),
    prohibitedClaims: violations.length === 0,
    limitations: risk.limitations.length > 0 && evidenceIds.includes("https-limit"),
  };
  scenarioResults.push({
    id:scenario.id,name:scenario.name,family:scenario.family,passed:Object.values(checks).every(Boolean),checks,
    input:{url:scenario.url,claimedOrganisation:scenario.organisationId??null,threatProviderState:scenario.threatState,sensitiveInteraction:scenario.sensitive},
    expected:{risk:scenario.expectedRisk,evidence:scenario.expectedEvidence,evidenceCategories:[...new Set(scenario.expectedEvidence.map(evidenceCategory))],recommendedAction:scenario.expectedAction,prohibitedOutput:scenario.prohibitedOutput},
    actual:{registrableDomain:parsed.registrableDomain,subdomain:parsed.subdomain,https:parsed.usesHttps,punycode:parsed.hasPunycode,threatState:threat.state,identityState:identity.state,risk:risk.level,confidence:risk.confidence,evidence:evidenceIds,evidenceCategories:[...new Set(evidenceIds.map(evidenceCategory))],recommendedAction:risk.recommendation,limitations:risk.limitations,claimViolations:violations},
    reasoningTrace:{signals:risk.evidence.map(({id,kind,title,detail})=>({id,kind,title,detail})),decision:risk.level,rationale:risk.evidence.map((item)=>item.detail),recommendation:risk.recommendation},
    rationale:scenario.rationale,benign:Boolean(scenario.benign),expectedDanger:Boolean(scenario.expectedDanger),
  });
}

const storage = evaluateStorage();
const languages = evaluateLanguages();
const passed = scenarioResults.filter((result)=>result.passed).length;
const benign = scenarioResults.filter((result)=>result.benign);
const dangerous = scenarioResults.filter((result)=>result.expectedDanger);
const controlledFalsePositives = benign.filter((result)=>["HIGH","CRITICAL"].includes(result.actual.risk)).map((result)=>result.id);
const controlledFalseNegatives = dangerous.filter((result)=>["LOW_EVIDENCE","UNKNOWN"].includes(result.actual.risk)).map((result)=>result.id);
const claimDisciplineChecks = [
  {name:"NO_KNOWN_MATCH is not labelled safe",passed:scenarioResults.filter((r)=>r.input.threatProviderState==="NO_KNOWN_MATCH").every((r)=>r.actual.claimViolations.length===0)},
  {name:"HTTPS alone does not verify identity",passed:scenarioResults.find((r)=>r.id==="EVAL-001")?.actual.identityState==="NO_CLAIM"},
  {name:"Identity match alone remains limited evidence",passed:scenarioResults.find((r)=>r.id==="EVAL-003")?.actual.risk==="LOW_EVIDENCE"},
  {name:"Similarity alone is not confirmed phishing",passed:scenarioResults.find((r)=>r.id==="EVAL-016")?.actual.risk==="CAUTION"},
  {name:"No illegal-site claim",passed:scenarioResults.every((r)=>!r.actual.claimViolations.includes("illegal website"))},
  {name:"No hacked-user claim",passed:scenarioResults.every((r)=>!r.actual.claimViolations.includes("you have been hacked"))},
  {name:"No system-wide blocking claim",passed:scenarioResults.every((r)=>!r.actual.claimViolations.includes("system-wide blocking"))},
  {name:"No live-provider claim",passed:scenarioResults.every((r)=>!r.actual.claimViolations.includes("live provider claim"))},
];

const report = {
  schemaVersion:"1.0",evaluation:"Controlled Technical Evaluation V0.1",executedAt:new Date().toISOString(),scope:"Fictional .test domains and local deterministic inputs only",
  summary:{totalScenarios:scenarioResults.length,passed,failed:scenarioResults.length-passed,passPercentage:Number(((passed/scenarioResults.length)*100).toFixed(1)),warnings:1,benignBaselinePasses:benign.filter((r)=>r.passed).length,benignBaselineTotal:benign.length,highRiskPasses:dangerous.filter((r)=>r.passed).length,highRiskTotal:dangerous.length,controlledFalsePositives:controlledFalsePositives.length,controlledFalseNegatives:controlledFalseNegatives.length,claimDisciplinePassed:claimDisciplineChecks.filter((c)=>c.passed).length,claimDisciplineTotal:claimDisciplineChecks.length,languageChecksPassed:languages.pairChecks.filter((c)=>c.passed).length+languages.evidenceChecks.filter((c)=>c.passed).length,languageChecksTotal:languages.pairChecks.length+languages.evidenceChecks.length,blockVerifyPassed:storage.passed},
  evidenceQualityDefinitions:{KNOWN:"Known local fictional threat-reputation record.",VERIFIED:"Domain matches a controlled fictional registry entry.",SIGNAL:"Similarity or structural observation that may increase suspicion.",CONTEXT:"Sensitive-information request or interaction context.",UNKNOWN:"Insufficient or absent evidence.",LIMITATION:"A condition the prototype cannot determine or guarantee."},
  passRule:"Risk is in the predeclared range; mandatory evidence is present; action direction matches; prohibited claims are absent; limitation language is present.",
  scenarios:scenarioResults,claimDiscipline:{passed:claimDisciplineChecks.every((c)=>c.passed),checks:claimDisciplineChecks},blockVerify:storage,languageConsistency:languages,
  warnings:[{classification:"DESIGN_LIMITATION",severity:"LOW",teacherDemoBlocking:false,description:storage.warning}],
  preExecutionCorrections:[
    {classification:"TEST_EXPECTATION_ERROR",file:"evaluation/scenarios.ts",description:"The initial synthetic punycode fixture was not a valid URL and was replaced with the repository's existing validated fictional punycode fixture before scenario execution.",productBehaviorChanged:false},
    {classification:"IMPLEMENTATION_DEFECT",file:"evaluation/evaluation-runner.ts",description:"The language-presence check compared disjoint TypeScript literal unions. The redundant inequality comparison was removed while preserving the non-empty pair check.",productBehaviorChanged:false},
  ],
  corrections:[],
};

mkdirSync(dirname(outputPath),{recursive:true});
writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,"utf8");

console.log("CONTROLLED TECHNICAL EVALUATION V0.1");
console.log(`Scenarios: ${report.summary.passed}/${report.summary.totalScenarios} passed (${report.summary.passPercentage}%)`);
console.log(`Controlled false positives: ${report.summary.controlledFalsePositives}`);
console.log(`Controlled false negatives: ${report.summary.controlledFalseNegatives}`);
console.log(`Claim discipline: ${report.summary.claimDisciplinePassed}/${report.summary.claimDisciplineTotal}`);
console.log(`Language checks: ${report.summary.languageChecksPassed}/${report.summary.languageChecksTotal}`);
console.log(`Block/verify state machine: ${report.summary.blockVerifyPassed ? "PASS" : "FAIL"}`);
console.log(`Warnings: ${report.summary.warnings}`);
console.log(`Results: ${outputPath}`);
if (report.summary.failed > 0 || !report.claimDiscipline.passed || !report.blockVerify.passed || !report.languageConsistency.passed) process.exitCode = 1;
