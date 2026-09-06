"use client";

import { useEffect, useState } from "react";
import { analyseUrl, type Analysis } from "../security/analyse";
import { scenarios } from "../security/scenarios";
import type { SensitiveRequest } from "../security/types";
import {
  BLOCK_KEY,
  TRUST_KEY,
  readEntries,
  removeEntry,
  type LocalEntry,
} from "../security/storage";
import { getMessages, type Locale } from "../i18n/messages";
import { Icon } from "./icons";
import { UrlCheckForm } from "./UrlCheckForm";
import { RiskResult } from "./RiskResult";

function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const base = `/${locale}`;
  const other = locale === "en" ? "pt-PT" : "en";
  return (
    <>
      <header className="site-header">
        <a className="prototype-identity" href={base} aria-label={`${t.prototype} — ${t.navCheck}`}>
          <span className="neutral-mark"><Icon name="shield" size={18} /></span>
          <span>{t.prototype}</span>
        </a>
        <nav aria-label={locale === "en" ? "Primary navigation" : "Navegação principal"}>
          <a href={base}>{t.navCheck}</a>
          <a href={`${base}/teacher-demo`}>{t.navTeacher}</a>
          <a href={`${base}/demo`}>{t.navDemo}</a>
          <a href={`${base}/methodology`}>{t.navMethod}</a>
          <a href={`${base}/project`}>{t.navProject}</a>
          <a href={`${base}/settings`}>{t.navSettings}</a>
          <a className="language" href={`/${other}`} aria-label={other === "pt-PT" ? "Mudar para português europeu" : "Switch to English"}>
            {locale === "en" ? "PT" : "EN"}
          </a>
        </nav>
      </header>
      <div className="demo-ribbon" role="note">
        <span>{locale === "en" ? "CONTROLLED DEMO" : "DEMONSTRAÇÃO CONTROLADA"}</span>
        {locale === "en"
          ? "Fictional organisations · Test threat data · No real credentials"
          : "Organizações fictícias · Dados de ameaça de teste · Sem credenciais reais"}
      </div>
    </>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return (
    <footer>
      <p className="footer-title">{t.prototype}</p>
      <p>
        {locale === "en"
          ? "An unnamed, Portugal-first IB Community Project prototype for non-expert internet users."
          : "Um protótipo sem nome, desenvolvido no âmbito de um Projeto Comunitário IB, centrado inicialmente em Portugal e em utilizadores não especialistas."}
      </p>
      <div>
        <a href={`/${locale}/about`}>{t.aboutTitle}</a>
        <a href={`/${locale}/methodology`}>{t.navMethod}</a>
        <a href={`/${locale}/project`}>{t.navProject}</a>
      </div>
    </footer>
  );
}

function Home({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function check(url: string, organisationId: string) {
    setLoading(true);
    try {
      setAnalysis(await analyseUrl(url, organisationId || undefined));
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 20);
    } finally {
      setLoading(false);
    }
  }

  if (analysis) {
    return (
      <main id="result">
        <div className="result-search">
          <UrlCheckForm t={t} compact initialUrl={analysis.parsed.fullUrl} initialOrg={analysis.identity.claimedOrganisation?.id} onCheck={check} />
        </div>
        <RiskResult analysis={analysis} t={t} onReset={() => setAnalysis(null)} />
      </main>
    );
  }

  return (
    <main>
      <section className="hero">
        <div className="eyebrow"><Icon name="shield" size={14} />{t.heroTag}</div>
        <h1>{t.heroTitle}</h1>
        <p className="hero-copy">{t.heroCopy}</p>
        <p className="supporting-copy">{t.designedFor}</p>
        <UrlCheckForm t={t} onCheck={check} />
        {loading && <div className="loading" role="status"><span />{t.checking}</div>}
        <div className="hero-actions">
          <a className="demo-link" href={`/${locale}/teacher-demo`}>{t.startTeacher}<Icon name="arrow" /></a>
          <a className="quiet-link" href={`/${locale}/demo`}>{t.tryDemo}</a>
        </div>
      </section>

      <section className="trust-strip" aria-label={locale === "en" ? "Prototype principles" : "Princípios do protótipo"}>
        <div><Icon name="check" /><strong>{t.local}</strong><small>{t.localCopy}</small></div>
        <div><Icon name="info" /><strong>{t.explainable}</strong><small>{t.explainableCopy}</small></div>
        <div><Icon name="shield" /><strong>{t.private}</strong><small>{t.privateCopy}</small></div>
      </section>

      <section className="how">
        <div>
          <div className="section-label">{t.process}</div>
          <h2>{t.processTitle}</h2>
          <p>{t.processCopy}</p>
        </div>
        <ol>
          <li><span>01</span><div><strong>{t.detect}</strong><p>{t.detectCopy}</p></div></li>
          <li><span>02</span><div><strong>{t.explain}</strong><p>{t.explainCopy}</p></div></li>
          <li><span>03</span><div><strong>{t.act}</strong><p>{t.actCopy}</p></div></li>
        </ol>
      </section>

      <section className="demo-teaser">
        <span className="orb"><Icon name="shield" size={34} /></span>
        <div><div className="section-label">{t.fictional}</div><h2>{t.demoTitle}</h2><p>{t.demoCopy}</p></div>
        <a className="light-button" href={`/${locale}/teacher-demo`}>{t.startTeacher}<Icon name="arrow" /></a>
      </section>
    </main>
  );
}

function TeacherDemo({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const scenario = scenarios[0];
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function begin() {
    setLoading(true);
    try {
      setAnalysis(await analyseUrl(scenario.url, scenario.organisationId, scenario.sensitive));
      setTimeout(() => document.getElementById("teacher-result")?.scrollIntoView({ behavior: "smooth" }), 20);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="teacher-demo-page">
      <section className="teacher-guide" aria-label={t.navTeacher}>
        <div>
          <div className="section-label">{locale === "en" ? "CANONICAL TEACHER PATH" : "PERCURSO PARA O PROFESSOR"}</div>
          <h1>{t.navTeacher}</h1>
          <p>{t.controlledNotice}</p>
        </div>
        <ol>
          <li className={!analysis ? "current" : "complete"}><span>1</span>{locale === "en" ? "Run controlled phishing analysis" : "Executar a análise de phishing controlada"}</li>
          <li className={analysis ? "current" : ""}><span>2</span>{locale === "en" ? "Explain evidence and limitations" : "Explicar as provas e limitações"}</li>
          <li><span>3</span>{locale === "en" ? "Block and verify" : "Bloquear e verificar"}</li>
          <li><span>4</span>{locale === "en" ? "Remove in Settings" : "Remover nas Definições"}</li>
          <li><span>5</span>{locale === "en" ? "Switch language and finish on Methodology" : "Mudar de idioma e terminar na Metodologia"}</li>
        </ol>
        <div className="teacher-controls">
          <button className="primary-button" onClick={begin} disabled={loading}>{loading ? t.checking : t.run}<Icon name="arrow" /></button>
          <a className="secondary-button" href={`/${locale}/settings`}>{t.navSettings}</a>
          <a className="secondary-button" href={`/${locale === "en" ? "pt-PT" : "en"}/teacher-demo`}>{locale === "en" ? "Português" : "English"}</a>
          <a className="secondary-button" href={`/${locale}/methodology`}>{t.navMethod}</a>
        </div>
      </section>
      {analysis && <div id="teacher-result"><RiskResult analysis={analysis} t={t} onReset={() => setAnalysis(null)} /></div>}
    </main>
  );
}

const scenarioTitles: Record<Locale, Record<string, string>> = {
  en: {
    "clear-phishing": "Known fictional phishing domain",
    "identity-mismatch": "Claimed identity mismatch",
    "unknown-new": "Unknown domain requesting credentials",
    verified: "Verified fictional domain",
    "misleading-subdomain": "Subdomain confusion",
    "legitimate-https": "Legitimate HTTPS website",
    "benign-unfamiliar": "Benign unfamiliar domain",
    "similar-word": "Legitimate domain with a similar word",
    "verified-sensitive": "Verified fictional domain requesting credentials",
  },
  "pt-PT": {
    "clear-phishing": "Domínio de phishing fictício conhecido",
    "identity-mismatch": "Identidade alegada incompatível",
    "unknown-new": "Domínio desconhecido que pede credenciais",
    verified: "Domínio fictício verificado",
    "misleading-subdomain": "Confusão de subdomínio",
    "legitimate-https": "Site HTTPS legítimo",
    "benign-unfamiliar": "Domínio desconhecido benigno",
    "similar-word": "Domínio legítimo com palavra semelhante",
    "verified-sensitive": "Domínio fictício verificado que pede credenciais",
  },
};

function scenarioDescription(id: string, locale: Locale) {
  const pt = locale === "pt-PT";
  const descriptions: Record<string, string> = {
    "clear-phishing": pt ? "Correspondência na lista fictícia, domínio semelhante, identidade incompatível e pedido de palavra-passe." : "Fictional threat-list match, similar domain, identity mismatch and password request.",
    "identity-mismatch": pt ? "Sem ameaça conhecida, mas o domínio não corresponde à identidade alegada." : "No known threat, but the domain does not match the claimed identity.",
    "unknown-new": pt ? "Reputação desconhecida, sem identidade verificada e pedido de credenciais." : "Unknown reputation, no verified identity and a credential request.",
    verified: pt ? "O domínio corresponde ao registo fictício; isto não significa que o site seja seguro." : "The domain matches the fictional identity record; this does not mean the site is safe.",
    "misleading-subdomain": pt ? "O nome do banco aparece à esquerda, mas outro domínio controla o endereço." : "The bank name appears on the left, but another domain controls the address.",
    "legitimate-https": pt ? "HTTPS e nenhuma ameaça conhecida, sem alegação de identidade. Resultado com provas limitadas." : "HTTPS and no known threat, with no identity claim. The result remains limited evidence.",
    "benign-unfamiliar": pt ? "Domínio desconhecido sem pedido sensível. A incerteza não é automaticamente perigo." : "An unfamiliar domain with no sensitive request. Uncertainty is not automatically danger.",
    "similar-word": pt ? "Uma palavra semelhante isolada não deve produzir uma acusação de phishing." : "A similar word alone should not produce a phishing accusation.",
    "verified-sensitive": pt ? "A identidade corresponde, mas o pedido de credenciais continua a exigir cuidado." : "Identity matches, but a credential request still requires care.",
  };
  return descriptions[id] ?? "";
}

function Demo({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState("");

  async function run(scenario: typeof scenarios[number]) {
    setLoading(scenario.id);
    setAnalysis(await analyseUrl(scenario.url, scenario.organisationId, scenario.sensitive));
    setLoading("");
    setTimeout(() => document.getElementById("scenario-result")?.scrollIntoView({ behavior: "smooth" }), 20);
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div className="eyebrow"><Icon name="shield" size={14} />{t.demoMode}</div>
        <h1>{t.demoHeading}</h1>
        <p>{t.demoIntro}</p>
      </div>
      <div className="controlled-notice"><Icon name="info" /><span>{t.controlledNotice}</span></div>
      <div className="scenario-grid">
        {scenarios.map((scenario, index) => (
          <article className="scenario-card" key={scenario.id}>
            <div className="scenario-top"><span>{String(index + 1).padStart(2, "0")}</span><strong className={`risk-pill pill-${scenario.expected.toLowerCase().replace("_", "-")}`}>{t.expected}: {scenario.expected.replace("_", " ")}</strong></div>
            <h2>{scenarioTitles[locale][scenario.id]}</h2>
            <code>{scenario.url}</code>
            <p>{scenarioDescription(scenario.id, locale)}</p>
            <button className="secondary-button full" onClick={() => run(scenario)} disabled={Boolean(loading)}>{loading === scenario.id ? t.checking : t.run}<Icon name="arrow" /></button>
          </article>
        ))}
      </div>
      {analysis && <div id="scenario-result"><RiskResult analysis={analysis} t={t} onReset={() => setAnalysis(null)} /></div>}
    </main>
  );
}

function Methodology({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const pt = locale === "pt-PT";
  const sections = pt ? [
    ["Análise determinística", "O nível de risco resulta de regras documentadas e sinais explícitos, não de IA nem de uma decisão oculta."],
    ["Reputação local de teste", "A V0.1 usa um fornecedor local, determinístico e fictício. Sem correspondência significa apenas que não foi encontrada uma ameaça conhecida nas fontes verificadas."],
    ["Endereço e domínio", "O protótipo separa protocolo, hostname, domínio registável, subdomínio e caminho. A implementação atual usa um subconjunto controlado de sufixos públicos."],
    ["Identidade e semelhança", "A identidade alegada é comparada com registos fictícios. Distância de edição, palavras acrescentadas, punycode e subdomínios são sinais de semelhança, não prova de crime."],
    ["Contexto sensível", "Pedidos controlados de palavra-passe, pagamento, dados pessoais ou permissões aumentam a cautela. Os valores nunca são enviados nem guardados."],
    ["Categorias de provas", "Cada observação é apresentada como conhecida, sinal, desconhecida ou limitação, permitindo distinguir factos de inferências."],
    ["Limitações", "São possíveis falsos positivos e falsos negativos. HTTPS protege a ligação, mas não prova identidade ou confiança. Uma identidade correspondente não torna todo o conteúdo seguro."],
    ["Por que não usar IA?", "A V0.1 privilegia sinais determinísticos e explicáveis, para que o utilizador e o avaliador compreendam por que foi produzido o resultado. A IA não é necessária para o veredito atual."],
  ] : [
    ["Deterministic analysis", "Risk levels come from documented rules and explicit signals, not AI or a hidden decision."],
    ["Local test reputation", "V0.1 uses a local, deterministic and fictional provider. No match means only that no known threat was found in the sources checked."],
    ["Address and domain parsing", "The prototype separates protocol, hostname, registrable domain, subdomain and path. The current implementation uses a controlled public-suffix subset."],
    ["Identity and similarity", "A claimed identity is compared with fictional records. Edit distance, added words, punycode and subdomains are similarity signals—not proof of criminality."],
    ["Sensitive context", "Controlled requests for passwords, payment details, personal information or permissions increase caution. Values are never submitted or stored."],
    ["Evidence categories", "Each observation is presented as known evidence, a signal, an unknown or a limitation, keeping facts distinct from inference."],
    ["Limitations", "False positives and false negatives are possible. HTTPS protects a connection but proves neither identity nor trust. An identity match does not make all content safe."],
    ["Why not use AI?", "V0.1 prioritises deterministic, explainable signals so users and evaluators can understand why a result was produced. AI is not required for the current security verdict."],
  ];

  return (
    <main className="page prose-page">
      <div className="page-heading"><div className="section-label">{pt ? "TRANSPARENTE POR CONCEÇÃO" : "TRANSPARENT BY DESIGN"}</div><h1>{t.methodTitle}</h1><p>{t.methodIntro}</p></div>
      <div className="method-grid">{sections.map((section, index) => <article key={section[0]}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section[0]}</h2><p>{section[1]}</p></article>)}</div>
      <Architecture locale={locale} />
      <section className="formula"><div>{pt ? "DETETAR" : "DETECT"}</div><span>→</span><div>{pt ? "EXPLICAR" : "EXPLAIN"}</div><span>→</span><div>{pt ? "PREVENIR / BLOQUEAR" : "PREVENT / BLOCK"}</div><span>→</span><div>{pt ? "AGIR" : "ACT"}</div><span>→</span><div>{pt ? "VERIFICAR" : "VERIFY"}</div></section>
    </main>
  );
}

function Architecture({ locale }: { locale: Locale }) {
  const pt = locale === "pt-PT";
  return (
    <section className="architecture-section">
      <div className="section-label">{pt ? "ARQUITETURA INDEPENDENTE DO FORNECEDOR" : "PROVIDER-INDEPENDENT ARCHITECTURE"}</div>
      <h2>{pt ? "O mesmo motor, fontes diferentes." : "The same engine, different sources."}</h2>
      <p>{pt ? "O fornecedor local permite uma demonstração segura e repetível. A mesma interface foi concebida para aceitar serviços externos verificados no futuro, sem alterar o motor de risco." : "The local provider enables a safe, repeatable demonstration. The same normalized interface is designed to support verified external services later without replacing the risk engine."}</p>
      <div className="architecture-grid">
        <Flow title={pt ? "DEMONSTRAÇÃO ATUAL" : "CURRENT DEMO"} items={pt ? ["URL", "Fornecedor local determinístico", "Interface normalizada", "Sinais de segurança", "Motor de risco", "Explicação + ação"] : ["URL", "Local deterministic provider", "Normalized interface", "Security signals", "Risk engine", "Explanation + action"]} />
        <Flow title={pt ? "VERSÃO ONLINE FUTURA" : "FUTURE ONLINE VERSION"} items={pt ? ["URL", "Fornecedor externo verificado", "A mesma interface normalizada", "Os mesmos sinais", "O mesmo motor", "Explicação + ação"] : ["URL", "Verified external provider", "Same normalized interface", "Same signals", "Same engine", "Explanation + action"]} />
      </div>
    </section>
  );
}

function Flow({ title, items }: { title: string; items: string[] }) {
  return <div className="flow-card"><strong>{title}</strong>{items.map((item, index) => <div key={item}><span>{item}</span>{index < items.length - 1 && <i>↓</i>}</div>)}</div>;
}

function Project({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const pt = locale === "pt-PT";
  const sections = pt ? [
    ["PROBLEMA", "Utilizadores não especialistas podem encontrar interações digitais enganosas que tentam obter credenciais ou informação pessoal."],
    ["COMUNIDADE", "O Projeto Comunitário IB está inicialmente centrado em Portugal e em utilizadores comuns não especialistas."],
    ["RESPOSTA", "Um protótipo preventivo que identifica sinais selecionados e os converte em ações de proteção compreensíveis."],
    ["CAPACIDADES ATUAIS", "Análise de URL e domínio, reputação local fictícia, comparação de identidade, semelhança, risco determinístico e bloqueio local reversível."],
    ["DEMONSTRAÇÃO CONTROLADA", "As organizações, ameaças e formulários são fictícios. A lógica, a interface, a persistência local e os testes são reais."],
    ["O QUE NÃO É ALEGADO", "Não é antivírus, não usa bases de dados globais em direto, não bloqueia o dispositivo inteiro e não foi validado no mundo real."],
    ["AVALIAÇÃO", "Testes determinísticos verificam resultados esperados, domínio registável, estados desconhecidos, traduções e o fluxo bloquear–verificar–remover."],
    ["LIGAÇÃO FUTURA", "Fornecedores externos verificados poderão usar a interface normalizada existente; nenhum está integrado na V0.1."],
  ] : [
    ["PROBLEM", "Non-expert internet users can encounter deceptive digital interactions that attempt to obtain credentials or personal information."],
    ["COMMUNITY", "The IB Community Project is initially focused on Portugal and ordinary non-expert internet users."],
    ["RESPONSE", "A focused preventive prototype that identifies selected risk signals and converts them into understandable protective actions."],
    ["CURRENT CAPABILITIES", "URL and domain analysis, fictional local reputation, identity comparison, similarity, deterministic risk and reversible local blocking."],
    ["CONTROLLED DEMONSTRATION", "Organisations, threats and forms are fictional. The logic, interface, local persistence and tests are real."],
    ["WHAT IS NOT CLAIMED", "It is not antivirus, does not use live global databases, does not block across a device and is not real-world validated."],
    ["EVALUATION", "Deterministic tests verify expected outcomes, registrable domains, unknown states, translations and the block–verify–remove workflow."],
    ["FUTURE CONNECTION", "Verified external providers could use the existing normalized interface; none is integrated in V0.1."],
  ];

  return (
    <main className="page prose-page">
      <div className="page-heading"><div className="section-label">IB COMMUNITY PROJECT · PORTUGAL FIRST</div><h1>{t.projectTitle}</h1><p>{pt ? "Uma ajuda visual concisa para explicar o problema, a resposta e os limites do protótipo." : "A concise visual aid for explaining the problem, response and boundaries of the prototype."}</p></div>
      <section className="model-band"><span>{pt ? "DETETAR" : "DETECT"}</span><i>→</i><span>{pt ? "EXPLICAR" : "EXPLAIN"}</span><i>→</i><span>{pt ? "PREVENIR / BLOQUEAR" : "PREVENT / BLOCK"}</span><i>→</i><span>{pt ? "AGIR" : "ACT"}</span><i>→</i><span>{pt ? "VERIFICAR" : "VERIFY"}</span></section>
      <div className="project-grid">{sections.map(([title, copy]) => <article key={title}><div className="section-label">{title}</div><p>{copy}</p></article>)}</div>
      <section className="evidence-summary"><div><strong>{pt ? "REAL NA V0.1" : "REAL IN V0.1"}</strong><p>{pt ? "Análise, regras, ações locais, interface bilingue e testes." : "Parsing, rules, local actions, bilingual interface and tests."}</p></div><div><strong>{pt ? "FICTÍCIO / SIMULADO" : "FICTIONAL / SIMULATED"}</strong><p>{pt ? "Reputação, organizações, cenários e formulários sensíveis." : "Reputation data, organisations, scenarios and sensitive forms."}</p></div><div><strong>{pt ? "FUTURO" : "FUTURE"}</strong><p>{pt ? "Inteligência externa, lista real de organizações, extensão e bloqueio real." : "External intelligence, real organisation registry, extension and real-world blocking."}</p></div></section>
      <Architecture locale={locale} />
    </main>
  );
}

function Settings({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const [blocked, setBlocked] = useState<LocalEntry[]>([]);
  const [trusted, setTrusted] = useState<LocalEntry[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlocked(readEntries(BLOCK_KEY, localStorage));
      setTrusted(readEntries(TRUST_KEY, localStorage));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function remove(key: string, domain: string) {
    const next = removeEntry(key, domain, localStorage);
    if (key === BLOCK_KEY) {
      setBlocked(next);
      setNotice(`${t.removed} ${domain}`);
    } else {
      setTrusted(next);
      setNotice(`${t.remove}: ${domain}`);
    }
  }

  function reset() {
    localStorage.removeItem(BLOCK_KEY);
    localStorage.removeItem(TRUST_KEY);
    setBlocked([]);
    setTrusted([]);
    setNotice(t.resetDone);
  }

  return (
    <main className="page settings-page">
      <div className="page-heading"><div className="section-label">{locale === "en" ? "LOCAL PROTECTION" : "PROTEÇÃO LOCAL"}</div><h1>{t.navSettings}</h1><p>{t.settingsIntro}</p></div>
      <div className="settings-grid"><StorageList title={t.blocked} entries={blocked} t={t} onRemove={(domain) => remove(BLOCK_KEY, domain)} /><StorageList title={t.trusted} entries={trusted} t={t} onRemove={(domain) => remove(TRUST_KEY, domain)} /></div>
      <div className="settings-actions"><button className="secondary-button" onClick={reset}><Icon name="trash" />{t.reset}</button></div>
      {notice && <div className="settings-notice" role="status"><Icon name="check" />{notice}</div>}
      <div className="privacy-box"><Icon name="lock" /><div><strong>{t.private}</strong><p>{locale === "en" ? "Only the two prototype-specific lists above are changed. Unrelated browser data is never cleared." : "Apenas as duas listas específicas do protótipo acima são alteradas. Outros dados do navegador nunca são eliminados."}</p></div></div>
    </main>
  );
}

function StorageList({ title, entries, t, onRemove }: { title: string; entries: LocalEntry[]; t: Record<string, string>; onRemove: (domain: string) => void }) {
  return (
    <section className="storage-card">
      <div className="storage-heading"><Icon name="shield" /><h2>{title}</h2><span>{entries.length}</span></div>
      {entries.length === 0 ? <p className="empty">{t.none}</p> : <ul>{entries.map((entry) => <li key={entry.domain}><div><strong>{entry.domain}</strong><small>{new Date(entry.createdAt).toLocaleString()}</small></div><button onClick={() => onRemove(entry.domain)} aria-label={`${t.remove} ${entry.domain}`}><Icon name="trash" />{t.remove}</button></li>)}</ul>}
    </section>
  );
}

function About({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const pt = locale === "pt-PT";
  return (
    <main className="page prose-page">
      <div className="page-heading"><div className="section-label">{pt ? "OBJETIVO E LIMITES" : "PURPOSE & BOUNDARIES"}</div><h1>{t.aboutTitle}</h1><p>{pt ? "O protótipo ajuda uma pessoa a parar, analisar provas e escolher uma ação de proteção antes de uma interação enganosa expor dados pessoais." : "The prototype helps someone pause, inspect evidence and choose a protective action before a deceptive interaction exposes personal data."}</p></div>
      <div className="split-cards"><article><Icon name="check" /><h2>{pt ? "O que é" : "What it is"}</h2><p>{pt ? "Um protótipo educativo local, determinístico, explicável, bilingue e centrado na prevenção." : "A local-first educational prototype: deterministic, explainable, bilingual and focused on prevention."}</p></article><article><Icon name="alert" /><h2>{pt ? "O que não é" : "What it is not"}</h2><p>{pt ? "Não é antivírus, vigilância, ferramenta de intrusão, garantia de segurança ou substituto de resposta profissional a incidentes." : "Not antivirus, surveillance, an intrusion tool, a security guarantee or a replacement for professional incident response."}</p></article></div>
    </main>
  );
}

function DemoSite({ locale, type }: { locale: Locale; type: string }) {
  const t = getMessages(locale);
  const pt = locale === "pt-PT";
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [continued, setContinued] = useState(false);
  const config = type.includes("bank-login")
    ? { url: "https://lusitaniabank.test/account", org: "lusitania-bank", sensitive: "password" as SensitiveRequest }
    : type.includes("suspicious")
      ? { url: "https://lusitania-bank-login.test/secure", org: "lusitania-bank", sensitive: "password" as SensitiveRequest }
      : type.includes("profile")
        ? { url: "https://unknown-new-domain.test/profile", org: "", sensitive: "personal" as SensitiveRequest }
        : { url: "https://unknown-new-domain.test/permissions", org: "", sensitive: "permission" as SensitiveRequest };

  useEffect(() => { analyseUrl(config.url, config.org, config.sensitive).then(setAnalysis); }, [config.url, config.org, config.sensitive]);
  if (!analysis) return <main className="demo-site-shell"><div className="loading" role="status"><span />{t.checking}</div></main>;
  if (!continued && analysis.risk.level !== "LOW_EVIDENCE") {
    return <main className="demo-site-shell"><section className="sensitive-warning"><span className="status-icon"><Icon name="alert" size={33} /></span><div className="section-label">{t.demoMode}</div><h1>{t.sensitiveTitle}</h1><p>{t.sensitiveCopy}</p><div className="mini-domain"><small>{pt ? "Domínio registável real" : "Actual registrable domain"}</small><strong>{analysis.parsed.registrableDomain}</strong></div><div className="action-row"><a href={`/${locale}`} className="primary-button">{t.leave}</a><a href="https://lusitaniabank.test" className="secondary-button">{t.verified}</a><button className="text-button deliberate" onClick={() => setContinued(true)}>{t.continue}</button></div></section></main>;
  }
  return <main className="fake-site"><div className="fake-banner"><Icon name="info" />{t.demoMode} — {pt ? "Este não é um site real. Não é possível enviar valores." : "This is not a real website. Values cannot be submitted."}</div><section className="fake-form"><span className="fictional-entity">{pt ? "ORGANIZAÇÃO FICTÍCIA" : "FICTIONAL ORGANISATION"}</span><h1>{config.sensitive === "password" ? (pt ? "Início de sessão de demonstração" : "Demo account sign-in") : config.sensitive === "personal" ? (pt ? "Perfil de demonstração" : "Demo profile details") : (pt ? "Pedido de permissão de demonstração" : "Demo permission request")}</h1><p>{t.fakeOnly}</p><label>{pt ? "Campo fictício" : "Fictional field"}<input type={config.sensitive === "password" ? "password" : "text"} placeholder={pt ? "APENAS DEMONSTRAÇÃO" : "DEMO ONLY"} autoComplete="off" /></label><button type="button" disabled>{pt ? "Envio desativado por segurança" : "Submission disabled for safety"}</button><a href={`/${locale}/demo`}>{t.back}</a></section></main>;
}

export function AppShell({ locale, slug }: { locale: Locale; slug: string[] }) {
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const route = slug.join("/");
  let page: React.ReactNode;
  if (!route) page = <Home locale={locale} />;
  else if (route === "teacher-demo") page = <TeacherDemo locale={locale} />;
  else if (route === "demo") page = <Demo locale={locale} />;
  else if (route === "methodology") page = <Methodology locale={locale} />;
  else if (route === "project") page = <Project locale={locale} />;
  else if (route === "settings") page = <Settings locale={locale} />;
  else if (route === "about") page = <About locale={locale} />;
  else if (route.startsWith("demo-sites/")) page = <DemoSite locale={locale} type={route} />;
  else page = <Home locale={locale} />;
  return <><Header locale={locale} />{page}{!route.startsWith("demo-sites/") && <Footer locale={locale} />}</>;
}
