"use client";

import { useEffect, useState } from "react";
import type { Analysis } from "../security/analyse";
import { BLOCK_KEY, TRUST_KEY, isStored, removeEntry, saveEntry } from "../security/storage";
import { Icon } from "./icons";

export function RiskResult({ analysis, t, onReset }: { analysis: Analysis; t: Record<string, string>; onReset: () => void }) {
  const { parsed, risk, identity, threat, sensitive } = analysis;
  const [notice, setNotice] = useState("");
  const [blocked, setBlocked] = useState(false);
  const pt = t.navCheck === "Verificar";

  useEffect(() => {
    const timer = setTimeout(() => setBlocked(isStored(BLOCK_KEY, parsed.registrableDomain, localStorage)), 0);
    return () => clearTimeout(timer);
  }, [parsed.registrableDomain]);

  function save(kind: "block" | "trust") {
    if (kind === "block") {
      saveEntry(BLOCK_KEY, { domain: parsed.registrableDomain, reason: risk.level, createdAt: new Date().toISOString() }, localStorage);
      setBlocked(true);
    } else {
      saveEntry(TRUST_KEY, { domain: parsed.registrableDomain, createdAt: new Date().toISOString() }, localStorage);
      setNotice(`${t.protection} ${parsed.registrableDomain}`);
    }
  }

  if (blocked) {
    return (
      <section className="interstitial" aria-live="assertive">
        <div className="status-icon"><Icon name="shield" size={34} /></div>
        <div className="kicker">{t.protection}</div>
        <h1>{t.blockedTitle}</h1>
        <p>{t.blockedCopy}</p>
        <div className="verification"><Icon name="check" /><span><strong>{t.blockedInPrototype}</strong> {parsed.registrableDomain}</span></div>
        <div className="action-row">
          <a className="primary-button" href={`/${pt ? "pt-PT" : "en"}/settings`}>{t.navSettings}</a>
          <button className="secondary-button" onClick={() => { removeEntry(BLOCK_KEY, parsed.registrableDomain, localStorage); setBlocked(false); }}>{t.remove}</button>
          <button className="text-button deliberate" onClick={onReset}>{t.leave}</button>
        </div>
      </section>
    );
  }

  const levelCopy: Record<string, { label: string; note: string }> = pt ? {
    CRITICAL: { label: "Risco crítico", note: "Há provas fortes de que deve sair antes de introduzir informação." },
    HIGH: { label: "Risco elevado", note: "Vários sinais documentados exigem atenção imediata." },
    CAUTION: { label: "Cuidado", note: "Foram encontrados sinais de alerta ou incerteza importantes." },
    LOW_EVIDENCE: { label: "Provas de risco limitadas", note: "Não foi encontrada nenhuma ameaça conhecida nas fontes verificadas." },
    UNKNOWN: { label: "Desconhecido", note: "Não existem provas suficientes para uma conclusão segura." },
  } : {
    CRITICAL: { label: "Critical risk", note: "Strong evidence indicates that you should leave before entering information." },
    HIGH: { label: "High risk", note: "Multiple documented warning signals need immediate attention." },
    CAUTION: { label: "Caution", note: "Important uncertainty or warning signals were found." },
    LOW_EVIDENCE: { label: "Limited risk evidence", note: "No known threat was found in the sources checked." },
    UNKNOWN: { label: "Unknown", note: "There is not enough evidence to reach a confident conclusion." },
  };

  const evidencePt: Record<string, [string, string]> = {
    "known-threat": ["Sinal de phishing conhecido detetado", "Este endereço consta do conjunto local e fictício de ameaças."],
    "no-match": ["Nenhuma ameaça conhecida encontrada", "Não foi encontrada nenhuma ameaça conhecida nas fontes verificadas. Isto não prova que o site seja seguro."],
    "unknown-reputation": ["Reputação desconhecida", "A fonte verificada não fornece um resultado positivo nem negativo."],
    "identity-match": ["O registo de identidade de demonstração corresponde", `O domínio registável corresponde ao registo fictício de ${identity.claimedOrganisation?.name}. Isto não significa que o site seja seguro.`],
    "identity-mismatch": ["Não foi possível verificar a identidade alegada", `O domínio registável não está listado para ${identity.claimedOrganisation?.name}. A incompatibilidade é um sinal de risco, não prova de atividade criminosa.`],
    "misleading-subdomain": ["Sinal de subdomínio enganador", `O domínio da organização aparece à esquerda, mas ${parsed.registrableDomain} é o domínio que controla este endereço na implementação atual.`],
    lookalike: ["Sinal de semelhança do domínio", "Este domínio parece-se com o domínio de demonstração selecionado. A semelhança é um sinal, não prova de phishing."],
    punycode: ["Domínio internacionalizado codificado", "O endereço contém punycode. Pode ser legítimo, mas caracteres visualmente confusos exigem cuidado."],
    http: ["Ligação não encriptada", "A informação enviada por HTTP pode ficar exposta durante a transmissão."],
    sensitive: ["Pedido de informação sensível", "Esta página controlada pede informação sensível. Nenhum valor é recolhido ou guardado."],
    "https-limit": ["HTTPS não prova identidade ou confiança", "HTTPS protege a ligação, mas não prova a identidade ou a fiabilidade do site."],
  };
  const limitationsPt = [
    "Os sinais podem produzir falsos positivos ou falsos negativos.",
    "Este protótipo não analisa o conteúdo do site nem prova quem controla um domínio.",
    "Uma correspondência de identidade não garante que todas as ações de um site sejam seguras.",
    "A utilização em produção exigiria uma Lista de Sufixos Públicos completa e mantida, ou uma biblioteca de confiança equivalente.",
  ];
  const copy = levelCopy[risk.level];
  const official = identity.claimedOrganisation?.domains[0];
  const confidenceLabel = pt ? ({ HIGH: "ALTA", MODERATE: "MODERADA", LIMITED: "LIMITADA" }[risk.confidence]) : risk.confidence;
  const reputationLabel = pt ? ({
    KNOWN_MALICIOUS: "MALICIOSO CONHECIDO",
    KNOWN_PHISHING: "PHISHING CONHECIDO",
    NO_KNOWN_MATCH: "NENHUMA CORRESPONDÊNCIA CONHECIDA",
    UNKNOWN: "DESCONHECIDA",
    PROVIDER_UNAVAILABLE: "FONTE INDISPONÍVEL",
  }[threat.state] ?? threat.state.replaceAll("_", " ")) : threat.state.replaceAll("_", " ");
  const sensitiveLabel = pt && sensitive ? ({ password: "palavra-passe", payment: "dados de pagamento", personal: "informação pessoal", permission: "permissão" }[sensitive] ?? sensitive) : sensitive ?? (pt ? "Nenhum" : "None");
  const providerLabel = pt && threat.providerName === "Local deterministic demonstration dataset"
    ? "Conjunto local determinístico de dados de demonstração"
    : threat.providerName;
  const recommendation = pt
    ? risk.recommendation === "LEAVE_AND_BLOCK" ? "Saia e bloqueie este domínio no protótipo" : risk.recommendation === "LEAVE" ? "Saia deste site" : risk.recommendation === "VERIFY_INDEPENDENTLY" ? "Verifique de forma independente" : "Prossiga com cuidado"
    : risk.recommendation === "LEAVE_AND_BLOCK" ? "Leave and block this domain in the prototype" : risk.recommendation === "LEAVE" ? "Leave this website" : risk.recommendation === "VERIFY_INDEPENDENTLY" ? "Verify independently" : "Proceed with care";

  return (
    <div className="result-layout" aria-live="polite">
      <section className={`risk-hero risk-${risk.level.toLowerCase().replace("_", "-")}`}>
        <div className="risk-top"><span className="risk-symbol"><Icon name={risk.level === "LOW_EVIDENCE" ? "check" : "alert"} size={27} /></span><div><div className="kicker">{t.result} · {pt ? "QUALIDADE DAS PROVAS" : "EVIDENCE QUALITY"}: {confidenceLabel}</div><h1>{copy.label}</h1><p>{copy.note}</p></div></div>
        <div className="signal-summary">
          <span><small>{pt ? "DOMÍNIO REAL" : "ACTUAL DOMAIN"}</small><strong>{parsed.registrableDomain}</strong></span>
          <span><small>{pt ? "IDENTIDADE ALEGADA" : "CLAIMED IDENTITY"}</small><strong>{identity.claimedOrganisation?.name ?? (pt ? "Nenhuma" : "None")}</strong></span>
          <span><small>{pt ? "REPUTAÇÃO" : "REPUTATION"}</small><strong>{reputationLabel}</strong></span>
          <span><small>{pt ? "PEDIDO SENSÍVEL" : "SENSITIVE REQUEST"}</small><strong>{sensitiveLabel}</strong></span>
        </div>
        <div className="checked-line"><Icon name="info" size={16} />{t.checked} · {providerLabel}</div>
      </section>

      <div className="result-main">
        <aside className="action-panel">
          <div className="kicker">{t.actions}</div>
          <h2>{recommendation}</h2>
          <p>{pt ? "Não introduza informação sensível sem confirmar o endereço através de uma fonte independente." : "Do not enter sensitive information unless you can confirm the address through an independent source."}</p>
          <button className="primary-button full" onClick={() => save("block")}><Icon name="shield" />{t.block}</button>
          <button className="secondary-button full" onClick={onReset}><Icon name="arrow" />{t.leave}</button>
          {official && <a className="secondary-button full" href={`https://${official}`} target="_blank" rel="noreferrer"><Icon name="globe" />{t.verified}</a>}
          <button className="text-button deliberate" onClick={() => save("trust")}>{t.trust}</button>
          <p className="scope-note"><Icon name="info" size={14} />{pt ? "O bloqueio aplica-se apenas a este protótipo, neste navegador." : "Blocking applies only inside this prototype, in this browser."}</p>
          {notice && <div className="save-notice" role="status"><Icon name="check" />{notice}</div>}
        </aside>

        <div className="result-content">
          <section className="panel"><div className="panel-title"><span>01</span><h2>{t.why}</h2></div><div className="evidence-list">{risk.evidence.map((item) => { const translated = pt ? evidencePt[item.id] : undefined; return <article key={item.id} className={`evidence evidence-${item.kind}`}><span><Icon name={item.kind === "known" ? "check" : item.kind === "limitation" ? "info" : "alert"} /></span><div><div className="evidence-kind">{pt ? ({ known: "conhecido", likely: "provável", signal: "sinal", unknown: "desconhecido", limitation: "limitação" }[item.kind]) : item.kind}</div><h3>{translated?.[0] ?? item.title}</h3><p>{translated?.[1] ?? item.detail}</p></div></article>; })}</div></section>
          <section className="panel"><div className="panel-title"><span>02</span><h2>{t.details}</h2></div><dl className="domain-grid"><div><dt>URL</dt><dd>{parsed.fullUrl}</dd></div><div><dt>{pt ? "Protocolo" : "Protocol"}</dt><dd>{parsed.protocol.toUpperCase()} {parsed.usesHttps ? (pt ? "· ligação encriptada" : "· encrypted connection") : (pt ? "· não encriptada" : "· not encrypted")}</dd></div><div><dt>Hostname</dt><dd>{parsed.hostname}</dd></div><div><dt>{pt ? "Domínio registável" : "Registrable domain"}</dt><dd className="domain-emphasis">{parsed.registrableDomain}</dd></div><div><dt>{pt ? "Subdomínio" : "Subdomain"}</dt><dd>{parsed.subdomain || "—"}</dd></div><div><dt>{pt ? "Caminho" : "Path"}</dt><dd>{parsed.path || "/"}</dd></div>{parsed.hasPunycode && <div><dt>IDN / punycode</dt><dd>{parsed.hostname}</dd></div>}</dl><div className="https-note"><Icon name="info" />{pt ? "HTTPS protege a ligação, mas não prova a identidade ou a fiabilidade do site." : "HTTPS protects the connection but does not prove the identity or trustworthiness of the website."}</div></section>
          <section className="panel limitation-panel"><div className="panel-title"><span>03</span><h2>{t.limits}</h2></div><ul>{(pt ? limitationsPt : risk.limitations).map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
      </div>
    </div>
  );
}
