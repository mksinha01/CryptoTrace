import { useEffect, useMemo, useState } from "react";
import { mockApi, type IntakeInput } from "./services/mockApi";
import type {
  ApiEnvelope,
  AuditEvent,
  Case,
  Chain,
  CryptoAlert,
  CrossChainLink,
  EvidenceItem,
  EvidenceManifest,
  GraphEdge,
  GraphNode,
  InvestigativeRecommendation,
  PatternFinding,
  PreservationRequest,
  RecoveryEstimate,
  ReportView,
  RiskAssessment,
  Role,
  SystemStatus,
  TraceLimits,
  TraceResult,
  Transaction,
  VASPCluster,
  Wallet,
  AttributionAssessment
} from "./types";

type Route =
  | "overview"
  | "cases"
  | "investigations"
  | "transactions"
  | "wallets"
  | "typologies"
  | "vasp"
  | "cross-chain"
  | "evidence"
  | "reports"
  | "alerts"
  | "supervisor"
  | "system";

type Drawer =
  | { kind: "tx"; tx: Transaction }
  | { kind: "node"; node: GraphNode }
  | { kind: "edge"; edge: GraphEdge; tx?: Transaction }
  | { kind: "finding"; finding: PatternFinding }
  | { kind: "vasp"; candidate: VASPCluster }
  | { kind: "evidence"; item: EvidenceItem }
  | null;

const routes: Array<{ id: Route; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "cases", label: "Cases" },
  { id: "alerts", label: "Alerts" },
  { id: "investigations", label: "Investigations" },
  { id: "transactions", label: "Transactions" },
  { id: "wallets", label: "Wallets" },
  { id: "typologies", label: "Typologies" },
  { id: "vasp", label: "VASP Intelligence" },
  { id: "cross-chain", label: "Cross-Chain" },
  { id: "evidence", label: "Evidence" },
  { id: "reports", label: "Reports" },
  { id: "supervisor", label: "Supervisor" },
  { id: "system", label: "System Status" }
];

const defaultLimits: TraceLimits = {
  max_hops: 5,
  time_window_hours: 72,
  minimum_value_inr: 5000,
  max_outflows: 10,
  max_nodes: 100,
  timeout_seconds: 15
};

function useApi<T>(loader: () => Promise<ApiEnvelope<T>>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loader()
      .then((response) => {
        if (!active) return;
        if (response.success) setData(response.data);
        else setError(response.error?.message ?? "Fixture service failed.");
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Unknown fixture service error.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
}

export function App() {
  const [route, setRoute] = useState<Route>("overview");
  const [role, setRole] = useState<Role>("INVESTIGATOR");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [auditRefresh, setAuditRefresh] = useState(0);

  const caseResult = useApi(() => mockApi.getCase(), []);
  useEffect(() => {
    if (caseResult.data) setActiveCase(caseResult.data);
  }, [caseResult.data]);

  const openTransaction = async (txHash: string) => {
    const response = await mockApi.getTransaction(txHash);
    setDrawer({ kind: "tx", tx: response.data });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CT</div>
          <div>
            <strong>CryptoTrace LEA</strong>
            <span>SIH 26183 Demo</span>
          </div>
        </div>
        <nav>
          {routes.map((item) => (
            <button key={item.id} className={route === item.id ? "nav active" : "nav"} onClick={() => setRoute(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Investigator Workstation</p>
            <h1>{routes.find((item) => item.id === route)?.label}</h1>
          </div>
          <div className="topbar-actions">
            <Badge tone="fixture">FIXTURE REPLAY</Badge>
            <Badge tone="fixture">DEMO DATA</Badge>
            <span className="case-chip">{activeCase?.case_id ?? "Loading case"}</span>
            <button className="role-switch" onClick={() => setRole(role === "INVESTIGATOR" ? "SUPERVISOR" : "INVESTIGATOR")}>
              Role: {role}
            </button>
          </div>
        </header>

        <div className="mode-banner">
          <strong>FIXTURE REPLAY · DEMO DATA</strong>
          <span>All intelligence shown here is synthetic fixture-backed demo output. It is not live blockchain, NCRP, SAHYOG, VASP, legal, or ownership proof.</span>
        </div>

        {activeCase && (
          <Router
            route={route}
            setRoute={setRoute}
            activeCase={activeCase}
            setActiveCase={setActiveCase}
            role={role}
            setDrawer={setDrawer}
            openTransaction={openTransaction}
            auditRefresh={auditRefresh}
            setAuditRefresh={setAuditRefresh}
          />
        )}
      </main>

      <DrawerPanel drawer={drawer} onClose={() => setDrawer(null)} openTransaction={openTransaction} />
    </div>
  );
}

function Router(props: {
  route: Route;
  setRoute: (route: Route) => void;
  activeCase: Case;
  setActiveCase: (caseItem: Case) => void;
  role: Role;
  setDrawer: (drawer: Drawer) => void;
  openTransaction: (txHash: string) => Promise<void>;
  auditRefresh: number;
  setAuditRefresh: (value: number) => void;
}) {
  switch (props.route) {
    case "overview":
      return <Overview {...props} />;
    case "cases":
      return <Cases {...props} />;
    case "alerts":
      return <Alerts setRoute={props.setRoute} openTransaction={props.openTransaction} />;
    case "investigations":
      return <Investigation {...props} />;
    case "transactions":
      return <Transactions openTransaction={props.openTransaction} />;
    case "wallets":
      return <Wallets activeCase={props.activeCase} openTransaction={props.openTransaction} />;
    case "typologies":
      return <Typologies setDrawer={props.setDrawer} openTransaction={props.openTransaction} />;
    case "vasp":
      return <Vasp setDrawer={props.setDrawer} />;
    case "cross-chain":
      return <CrossChain />;
    case "evidence":
      return <Evidence setDrawer={props.setDrawer} />;
    case "reports":
      return <Reports />;
    case "supervisor":
      return <Supervisor role={props.role} auditRefresh={props.auditRefresh} setAuditRefresh={props.setAuditRefresh} />;
    case "system":
      return <SystemStatusView />;
  }
}

function Overview({ setRoute, openTransaction }: { setRoute: (route: Route) => void; openTransaction: (txHash: string) => Promise<void> }) {
  const cases = useApi(() => mockApi.getCases(), []);
  const txs = useApi(() => mockApi.getTransactions({ limit: 6 }), []);
  const alerts = useApi(() => mockApi.getAlerts(), []);
  const status = useApi(() => mockApi.getSystemStatus(), []);
  const typologies = useApi(() => mockApi.getTypologies(), []);

  return (
    <section className="page-grid">
      <Panel title="Operational Queue" subtitle="Active investigations and fixture-mode intelligence state" className="span-2">
        <div className="metric-row">
          <Metric label="Active cases" value={String(cases.data?.length ?? 0)} accent="blue" />
          <Metric label="Open alerts" value={String(alerts.data?.length ?? 0)} accent="red" />
          <Metric label="Findings" value={String(typologies.data?.length ?? 0)} accent="amber" />
          <Metric label="Mode" value="FIXTURE" accent="yellow" />
        </div>
        <button className="primary" onClick={() => setRoute("investigations")}>Open Investigation Workstation</button>
      </Panel>
      <Panel title="Simulated Chain Status" subtitle="Provider state is fixture-backed, not live connectivity">
        <StatusGrid status={status.data} />
      </Panel>
      <Panel title="Recent Alerts" subtitle="Click through to the investigation context">
        <ListState loading={alerts.loading} error={alerts.error}>
          {alerts.data?.slice(0, 5).map((alert) => <AlertRow key={alert.alert_id} alert={alert} onClick={() => setRoute("investigations")} />)}
        </ListState>
      </Panel>
      <Panel title="Rapid Transaction Activity" subtitle="Newest fixture rows replayed at the top" className="span-2">
        <TransactionTable rows={txs.data ?? []} onOpen={openTransaction} compact />
      </Panel>
      <Panel title="Novel Demo Contributions" subtitle="Open with these for SIH judging">
        <div className="stack">
          <Callout title="MULE_NETWORK" text="India-specific behavioral typology with capped MEDIUM confidence and evidence references." />
          <Callout title="AdaptiveVASPScorer" text="Policy-versioned attribution scoring trace with modifiers and normalized weights." />
          <Callout title="Heuristic Recovery Estimate" text="Victim-impact urgency indicator with action window and non-probability disclaimer." />
        </div>
      </Panel>
    </section>
  );
}

function Cases({ activeCase, setActiveCase, setRoute }: { activeCase: Case; setActiveCase: (caseItem: Case) => void; setRoute: (route: Route) => void }) {
  const [source, setSource] = useState<"NCRP_INTAKE" | "SAHYOG" | "MANUAL">("NCRP_INTAKE");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cases = useApi(() => mockApi.getCases(), [message]);
  const [form, setForm] = useState<IntakeInput>({
    source: "NCRP_INTAKE",
    complaint_id: "NCRP-2026-184721",
    fraud_type: "INVESTMENT_FRAUD",
    fraud_amount_inr: 200000,
    incident_datetime: "2026-09-16T14:32",
    state: "Chhattisgarh",
    chain: "ethereum",
    wallet: activeCase.reported_wallet
  });

  const submit = async () => {
    setBusy(true);
    setMessage("VALIDATE → INDEX → NORMALIZE → TRACE QUEUED");
    const response = await mockApi.createCase({ ...form, source });
    setBusy(false);
    if (!response.success || !response.data) {
      setMessage(response.error?.message ?? "Validation failed.");
      return;
    }
    const caseResponse = await mockApi.getCase(response.data.case_id);
    setActiveCase(caseResponse.data);
    setMessage(`${response.data.confirmation} DEMO DATA response created.`);
    setRoute("investigations");
  };

  return (
    <section className="page-grid">
      <Panel title="Case Intake" subtitle="NCRP, SAHYOG and manual entry remain mock boundaries" className="span-2">
        <div className="segmented">
          {(["NCRP_INTAKE", "SAHYOG", "MANUAL"] as const).map((item) => (
            <button key={item} className={source === item ? "selected" : ""} onClick={() => setSource(item)}>
              {item === "NCRP_INTAKE" ? "NCRP" : item}
            </button>
          ))}
        </div>
        <div className="form-grid">
          <label>Complaint / Bulletin ID<input value={form.complaint_id} onChange={(e) => setForm({ ...form, complaint_id: e.target.value })} /></label>
          <label>Fraud Type<input value={form.fraud_type} onChange={(e) => setForm({ ...form, fraud_type: e.target.value })} /></label>
          <label>Reported Amount INR<input type="number" value={form.fraud_amount_inr} onChange={(e) => setForm({ ...form, fraud_amount_inr: Number(e.target.value) })} /></label>
          <label>Incident Time<input type="datetime-local" value={form.incident_datetime} onChange={(e) => setForm({ ...form, incident_datetime: e.target.value })} /></label>
          <label>Indian State<input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></label>
          <label>Chain<select value={form.chain} onChange={(e) => setForm({ ...form, chain: e.target.value as Chain })}><option value="ethereum">Ethereum</option><option value="polygon">Polygon</option><option value="tron">Tron</option><option value="bitcoin">Bitcoin</option></select></label>
          <label className="span-2">Suspect Wallet<input className="mono" value={form.wallet} onChange={(e) => setForm({ ...form, wallet: e.target.value })} /></label>
        </div>
        <div className="actions">
          <button className="primary" disabled={busy} onClick={submit}>{busy ? "Processing fixture intake..." : "Validate and Create Demo Case"}</button>
          <button onClick={() => setForm({ ...form, wallet: activeCase.reported_wallet, fraud_amount_inr: 200000 })}>Load Demo Fixture</button>
        </div>
        {message && <div className="notice">{message}</div>}
      </Panel>
      <Panel title="Case Queue" subtitle="Searchable active cases">
        <ListState loading={cases.loading} error={cases.error}>
          {cases.data?.map((caseItem) => (
            <button className="case-row" key={caseItem.case_id} onClick={() => { setActiveCase(caseItem); setRoute("investigations"); }}>
              <span className="mono">{caseItem.case_id}</span>
              <Badge tone={caseItem.source_badge.toLowerCase()}>{caseItem.source_badge}</Badge>
              <span>{caseItem.primary_chain}</span>
              <strong>₹{caseItem.fraud_amount_inr.toLocaleString("en-IN")}</strong>
              <Badge tone="partial">{caseItem.data_coverage}</Badge>
            </button>
          ))}
        </ListState>
      </Panel>
    </section>
  );
}

function Investigation({
  activeCase,
  setDrawer,
  openTransaction
}: {
  activeCase: Case;
  setDrawer: (drawer: Drawer) => void;
  openTransaction: (txHash: string) => Promise<void>;
}) {
  const trace = useApi(() => mockApi.getTrace(), []);
  const graph = useApi(() => mockApi.getGraph(), []);
  const typologies = useApi(() => mockApi.getTypologies(), []);
  const vasps = useApi(() => mockApi.getVaspCandidates(), []);
  const risk = useApi(() => mockApi.getRisk(), []);
  const recovery = useApi(() => mockApi.getRecovery(), []);
  const recommendations = useApi(() => mockApi.getRecommendations(), []);
  const transactions = useApi(() => mockApi.getTransactions({ limit: 9 }), []);
  const [limits, setLimits] = useState<TraceLimits>(defaultLimits);
  const [runningStage, setRunningStage] = useState<string>("READY");
  const [hopFilter, setHopFilter] = useState(6);
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);
  const [selectedGraphItem, setSelectedGraphItem] = useState<string>("E1");
  const [flowIndex, setFlowIndex] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const [revealedEdgeCount, setRevealedEdgeCount] = useState<number | null>(null);

  const visibleEdges = (graph.data?.edges ?? []).filter((edge) => edge.hop <= hopFilter);
  const displayedGraphEdges = revealedEdgeCount === null ? visibleEdges : visibleEdges.slice(0, revealedEdgeCount);
  const replayRows = transactions.data ?? [];
  const activeFlowTx = replayRows.length ? replayRows[flowIndex % replayRows.length] : null;
  const activeFlowEdge = activeFlowTx
    ? visibleEdges.find((edge) => activeFlowTx.tx_hash.includes(edge.tx_hash.replace("...", "").slice(0, 5)) || edge.tx_hash.includes(activeFlowTx.tx_hash.slice(0, 5)))
    : undefined;
  const activeTraceEdge = revealedEdgeCount ? visibleEdges[Math.max(0, revealedEdgeCount - 1)] : undefined;

  useEffect(() => {
    if (!replayRows.length) return;
    const timer = window.setInterval(() => setFlowIndex((current) => (current + 1) % replayRows.length), 1600);
    return () => window.clearInterval(timer);
  }, [replayRows.length]);

  const runTrace = async () => {
    setIsTracing(true);
    setTraceResult(null);
    setRevealedEdgeCount(0);
    setSelectedGraphItem("W1");
    const stages = ["FETCH", "VALIDATE", "EXTRACT", "NORMALIZE", "DEDUPLICATE", "PERSIST", "COMMIT", "ADVANCE"];
    for (let index = 0; index < visibleEdges.length; index += 1) {
      const stage = stages[index % stages.length];
      setRunningStage(`${stage} → graph expansion ${index + 1}/${visibleEdges.length}`);
      setRevealedEdgeCount(index + 1);
      setSelectedGraphItem(visibleEdges[index].id);
      await new Promise((resolve) => window.setTimeout(resolve, 280));
    }
    setRunningStage("ADVANCE → intelligence panels updated");
    const response = await mockApi.runTrace(limits);
    setTraceResult(response.data);
    setRevealedEdgeCount(null);
    setIsTracing(false);
    setRunningStage("READY · PARTIAL COVERAGE");
  };

  return (
    <section className="workspace">
      <div className="case-header">
        <div>
          <p className="eyebrow">Case Context</p>
          <h2>{activeCase.case_id} · {activeCase.fraud_type}</h2>
          <p><span className="mono">{activeCase.reported_wallet}</span></p>
        </div>
        <div className="header-badges">
          <Badge tone="ncrp">{activeCase.source_badge}</Badge>
          <Badge tone="partial">{activeCase.data_coverage}</Badge>
          <Badge tone="fixture">DEMO DATA</Badge>
        </div>
      </div>

      <div className="metric-row">
        <RecoveryCard recovery={recovery.data} />
        <Metric label="Attribution" value={vasps.data?.[0]?.confidence_band ?? "HIGH"} accent="green" />
        <Metric label="Risk" value={`${risk.data?.risk_tier ?? "HIGH"} ${risk.data?.risk_score ?? 78}`} accent="red" />
        <Metric label="Trace Coverage" value={traceResult?.coverage ?? trace.data?.coverage ?? "PARTIAL"} accent="amber" />
      </div>

      <RapidFlowStrip rows={replayRows} activeIndex={flowIndex} onOpen={openTransaction} />

      <div className="investigation-grid">
        <Panel title="Bounded Trace Controls" subtitle={`Stage: ${runningStage}`}>
          <TraceControls limits={limits} setLimits={setLimits} />
          <div className="actions">
            <button className="primary" disabled={isTracing} onClick={runTrace}>{isTracing ? "Tracing graph..." : "Run Trace"}</button>
            <label>Hop Filter<input type="range" min={1} max={6} value={hopFilter} onChange={(e) => setHopFilter(Number(e.target.value))} /></label>
            <span className="mono">≤ {hopFilter} hops</span>
          </div>
          <TraceGraphProgress total={visibleEdges.length} revealed={revealedEdgeCount ?? visibleEdges.length} isTracing={isTracing} />
          <TraceSummary trace={traceResult ?? trace.data} />
        </Panel>

        <Panel title="Fund-Flow Graph" subtitle="Solid edges are confirmed; dashed edges are heuristic mixer leads" className="graph-panel">
          <FundFlowGraph
            nodes={graph.data?.nodes ?? []}
            edges={displayedGraphEdges}
            selectedId={selectedGraphItem}
            activeEdgeId={(isTracing ? activeTraceEdge : activeFlowEdge)?.id}
            onNode={(node) => {
              setSelectedGraphItem(node.id);
              setDrawer({ kind: "node", node });
            }}
            onEdge={async (edge) => {
              setSelectedGraphItem(edge.id);
              const tx = edge.tx_hash.startsWith("HEURISTIC") ? undefined : (await mockApi.getTransaction(edge.tx_hash)).data;
              setDrawer({ kind: "edge", edge, tx });
            }}
          />
          <GraphInspector
            nodes={graph.data?.nodes ?? []}
            edges={displayedGraphEdges}
            selectedId={selectedGraphItem}
            activeEdgeId={(isTracing ? activeTraceEdge : activeFlowEdge)?.id}
            onNode={(node) => {
              setSelectedGraphItem(node.id);
              setDrawer({ kind: "node", node });
            }}
            onEdge={async (edge) => {
              setSelectedGraphItem(edge.id);
              const tx = edge.tx_hash.startsWith("HEURISTIC") ? undefined : (await mockApi.getTransaction(edge.tx_hash)).data;
              setDrawer({ kind: "edge", edge, tx });
            }}
          />
        </Panel>

        <Panel title="Typology Findings" subtitle="Confidence, evidence and uncertainty are explicit">
          <div className="card-list">
            {typologies.data?.slice(0, 5).map((finding) => (
              <FindingCard key={finding.finding_id} finding={finding} onClick={() => setDrawer({ kind: "finding", finding })} />
            ))}
          </div>
        </Panel>

        <Panel title="VASP Intelligence" subtitle="Candidates are not ownership proof">
          <div className="card-list">
            {vasps.data?.map((candidate) => <VaspRow key={candidate.candidate_id} candidate={candidate} onClick={() => setDrawer({ kind: "vasp", candidate })} />)}
          </div>
        </Panel>

        <Panel title="Recommendations" subtitle="Advisory only; no automatic legal action">
          <div className="stack">
            {recommendations.data?.map((rec) => <Recommendation key={rec.recommendation_id} rec={rec} onOpenEvidence={openTransaction} />)}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Transactions({ openTransaction }: { openTransaction: (txHash: string) => Promise<void> }) {
  const [chain, setChain] = useState<Chain | "all">("all");
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const txs = useApi(() => mockApi.getTransactions({ chain, query }), [chain, query, paused]);
  const stages = ["FETCH", "VALIDATE", "EXTRACT", "NORMALIZE", "DEDUPLICATE", "PERSIST", "COMMIT", "ADVANCE"];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % stages.length);
      setActiveIndex((current) => (txs.data?.length ? (current + 1) % txs.data.length : 0));
    }, 1100);
    return () => window.clearInterval(timer);
  }, [paused, txs.data?.length]);

  return (
    <Panel title="Live Transaction Intelligence" subtitle="Simulated stream: FETCHING → NORMALIZING → READY" full>
      <div className="toolbar">
        <select value={chain} onChange={(e) => setChain(e.target.value as Chain | "all")}>
          <option value="all">All chains</option><option value="ethereum">Ethereum</option><option value="polygon">Polygon</option><option value="tron">Tron</option><option value="bitcoin">Bitcoin</option>
        </select>
        <input placeholder="Search hash, address, provider" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={() => setPaused(!paused)}>{paused ? "Resume fixture replay" : "Pause fixture replay"}</button>
        <Badge tone="fixture">DEMO DATA</Badge>
      </div>
      <StreamPipeline stages={stages} activeStage={stage} paused={paused} />
      <RapidFlowStrip rows={txs.data ?? []} activeIndex={activeIndex} onOpen={openTransaction} large />
      <TransactionTable rows={txs.data ?? []} onOpen={openTransaction} activeHash={txs.data?.[activeIndex]?.tx_hash} />
    </Panel>
  );
}

function Wallets({ activeCase, openTransaction }: { activeCase: Case; openTransaction: (txHash: string) => Promise<void> }) {
  const wallet = useApi(() => mockApi.getWallet(activeCase.reported_wallet), [activeCase.reported_wallet]);
  const txs = useApi(() => mockApi.getTransactions({ query: activeCase.reported_wallet.slice(0, 8) }), [activeCase.reported_wallet]);
  return (
    <section className="page-grid">
      <Panel title="Wallet Investigation" subtitle="Reported wallet profile and behavior summary">
        {wallet.data && (
          <div className="identity-block">
            <Badge tone="red">{wallet.data.risk_tier}</Badge>
            <h2 className="mono">{wallet.data.address}</h2>
            <dl>
              <dt>Chain</dt><dd>{wallet.data.chain}</dd>
              <dt>Classification</dt><dd>{wallet.data.type}</dd>
              <dt>Status</dt><dd>{wallet.data.status}</dd>
              <dt>Coverage</dt><dd><Badge tone="partial">{wallet.data.coverage}</Badge></dd>
            </dl>
          </div>
        )}
      </Panel>
      <Panel title="Behavior Tabs" subtitle="Overview | Transactions | Fund Flow | Behavior | Counterparties | Evidence" className="span-2">
        <div className="metric-row">
          <Metric label="First seen" value="2026-09-14" accent="blue" />
          <Metric label="Last activity" value="2026-09-16" accent="amber" />
          <Metric label="Inbound INR" value="₹2.31L" accent="green" />
          <Metric label="Outbound INR" value="₹2.17L" accent="red" />
        </div>
        <TransactionTable rows={txs.data ?? []} onOpen={openTransaction} compact />
      </Panel>
    </section>
  );
}

function Typologies({ setDrawer, openTransaction }: { setDrawer: (drawer: Drawer) => void; openTransaction: (txHash: string) => Promise<void> }) {
  const typologies = useApi(() => mockApi.getTypologies(), []);
  return (
    <Panel title="Typology Intelligence" subtitle="Deterministic fixture findings with rule versions, evidence and uncertainty" full>
      <div className="finding-grid">
        {typologies.data?.map((finding) => (
          <FindingDetailCard key={finding.finding_id} finding={finding} onOpen={() => setDrawer({ kind: "finding", finding })} openTransaction={openTransaction} />
        ))}
      </div>
    </Panel>
  );
}

function Vasp({ setDrawer }: { setDrawer: (drawer: Drawer) => void }) {
  const candidates = useApi(() => mockApi.getVaspCandidates(), []);
  const attribution = useApi(() => mockApi.getAttribution(), []);
  return (
    <section className="page-grid">
      <Panel title="VASP Candidates" subtitle="VERIFIED, INFERRED and UNRESOLVED are visually distinct">
        <div className="card-list">
          {candidates.data?.map((candidate) => <VaspRow key={candidate.candidate_id} candidate={candidate} onClick={() => setDrawer({ kind: "vasp", candidate })} />)}
        </div>
        <div className="warning">Inferred clustering is not confirmed ownership or illicit conduct.</div>
      </Panel>
      <Panel title="AdaptiveVASPScorer" subtitle="Policy-versioned, deterministic scoring trace" className="span-2">
        {attribution.data && <AttributionTrace attribution={attribution.data} />}
      </Panel>
    </section>
  );
}

function CrossChain() {
  const links = useApi(() => mockApi.getCrossChain(), []);
  const risk = useApi(() => mockApi.getRisk(), []);
  const recovery = useApi(() => mockApi.getRecovery(), []);
  return (
    <section className="page-grid">
      <Panel title="Cross-Chain Analysis" subtitle="Direct bridge evidence is separate from heuristic correlation" className="span-2">
        <div className="card-list">
          {links.data?.map((link) => <CrossChainCard key={link.link_id} link={link} />)}
        </div>
      </Panel>
      <Panel title="Risk Assessment" subtitle="Risk is independent from attribution confidence">
        {risk.data && <RiskPanel risk={risk.data} />}
      </Panel>
      <Panel title="Heuristic Recovery Estimate" subtitle="Recovery Probability (not a statistical probability)" className="span-2">
        <RecoveryDetails recovery={recovery.data} />
      </Panel>
    </section>
  );
}

function Alerts({ setRoute }: { setRoute: (route: Route) => void; openTransaction: (txHash: string) => Promise<void> }) {
  const alerts = useApi(() => mockApi.getAlerts(), []);
  return (
    <Panel title="Alert Triage" subtitle="Clicking an alert opens the related investigation context" full>
      <div className="table">
        <div className="thead grid-alert"><span>Severity</span><span>Type</span><span>Case</span><span>Wallet</span><span>Status</span></div>
        {alerts.data?.map((alert) => (
          <button className="trow grid-alert" key={alert.alert_id} onClick={() => setRoute("investigations")}>
            <Badge tone={alert.severity === "HIGH" ? "red" : alert.severity === "MEDIUM" ? "amber" : "partial"}>{alert.severity}</Badge>
            <span>{alert.type}</span>
            <span className="mono">{alert.case_id}</span>
            <span className="mono">{alert.wallet}</span>
            <span>{alert.status}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function Evidence({ setDrawer }: { setDrawer: (drawer: Drawer) => void }) {
  const evidence = useApi(() => mockApi.getEvidence(), []);
  return (
    <Panel title="Evidence Manifest" subtitle="Hash-linked fixture registry with provenance and immutable state" full>
      {evidence.data && (
        <>
          <div className="summary-strip">
            <Badge tone="green">{evidence.data.integrity_status}</Badge>
            <span className="mono">{evidence.data.manifest_id}</span>
            <span>{evidence.data.hash_algorithm}</span>
            <Badge tone="fixture">DEMO DATA</Badge>
          </div>
          <EvidenceTable evidence={evidence.data} onOpen={(item) => setDrawer({ kind: "evidence", item })} />
        </>
      )}
    </Panel>
  );
}

function Reports() {
  const report = useApi(() => mockApi.getReport(), []);
  return (
    <Panel title="Investigation Report Preview" subtitle="Assembled from the same fixture-backed service data used across the UI" full>
      {report.data && <Report report={report.data} />}
    </Panel>
  );
}

function Supervisor({ role, auditRefresh, setAuditRefresh }: { role: Role; auditRefresh: number; setAuditRefresh: (value: number) => void }) {
  const requests = useApi(() => mockApi.getSupervisorRequests(), [auditRefresh]);
  const audit = useApi(() => mockApi.getAudit(), [auditRefresh]);
  const [note, setNote] = useState("");
  const request = requests.data?.[0];

  const decide = async (decision: "APPROVED" | "REJECTED") => {
    if (role !== "SUPERVISOR") {
      setNote("Approval is supervisor-gated. Switch role to SUPERVISOR to review.");
      return;
    }
    await mockApi.approvePreservationRequest(decision, "Demo Supervisor");
    setNote(`Request ${decision}. This is not an automatic freeze or legal filing.`);
    setAuditRefresh(auditRefresh + 1);
  };

  const draft = async () => {
    await mockApi.createPreservationRequest();
    setNote("Preservation request drafted and submitted for supervisor review.");
    setAuditRefresh(auditRefresh + 1);
  };

  return (
    <section className="page-grid">
      <Panel title="Preservation Request Workflow" subtitle="Draft → Pending Supervisor → Approved / Rejected" className="span-2">
        {request && (
          <div className="request-card">
            <div className="summary-strip">
              <Badge tone={request.status === "APPROVED" ? "green" : request.status === "REJECTED" ? "red" : "amber"}>{request.status}</Badge>
              <span className="mono">{request.request_id}</span>
              <span>{request.recipient}</span>
              <span className="mono">{request.evidence_manifest_id}</span>
            </div>
            <p>{request.purpose}</p>
            <div className="warning">Supervisor approval creates an audit entry only. It does not freeze funds, file legal action, or contact a live VASP.</div>
            <div className="actions">
              <button onClick={draft}>Draft / Submit Request</button>
              <button className="approve" onClick={() => decide("APPROVED")}>Approve as Supervisor</button>
              <button className="danger" onClick={() => decide("REJECTED")}>Reject as Supervisor</button>
            </div>
          </div>
        )}
        {note && <div className="notice">{note}</div>}
      </Panel>
      <Panel title="Audit Timeline" subtitle="Material UI actions append fixture audit entries">
        <AuditTimeline events={audit.data ?? []} />
      </Panel>
    </section>
  );
}

function SystemStatusView() {
  const status = useApi(() => mockApi.getSystemStatus(), []);
  return (
    <section className="page-grid">
      <Panel title="System / Integration Status" subtitle="Simulated status for intended ingestion and intelligence stack" className="span-2">
        <StatusGrid status={status.data} />
      </Panel>
      <Panel title="Eight-Stage Pipeline" subtitle="UI simulation only; no production backend is running">
        <div className="pipeline">
          {status.data && Object.entries(status.data.pipeline).map(([stage, value]) => (
            <div key={stage}><span>{stage.toUpperCase()}</span><Badge tone={value === "SIMULATED" ? "fixture" : "green"}>{value}</Badge></div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Panel({ title, subtitle, children, className = "", full = false }: { title: string; subtitle?: string; children: React.ReactNode; className?: string; full?: boolean }) {
  return (
    <section className={`panel ${full ? "full" : ""} ${className}`}>
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return <div className={`metric ${accent}`}><span>{label}</span><strong>{value}</strong></div>;
}

function ListState({ loading, error, children }: { loading?: boolean; error?: string | null; children: React.ReactNode }) {
  if (loading) return <div className="skeleton">Loading fixture service response...</div>;
  if (error) return <div className="warning">{error}</div>;
  return <>{children}</>;
}

function AlertRow({ alert, onClick }: { alert: CryptoAlert; onClick: () => void }) {
  return (
    <button className="alert-row" onClick={onClick}>
      <Badge tone={alert.severity === "HIGH" ? "red" : "amber"}>{alert.severity}</Badge>
      <span>{alert.title}</span>
      <span className="mono">{alert.wallet}</span>
    </button>
  );
}

function Callout({ title, text }: { title: string; text: string }) {
  return <div className="callout"><strong>{title}</strong><span>{text}</span></div>;
}

function StatusGrid({ status }: { status: SystemStatus | null }) {
  if (!status) return <div className="skeleton">Loading simulated status...</div>;
  return (
    <div className="status-grid">
      {Object.entries(status.chains).map(([chain, item]) => (
        <div className="status-card" key={chain}>
          <span>{chain}</span>
          <Badge tone="green">{item.status}</Badge>
          <strong className="mono">{item.last_block}</strong>
        </div>
      ))}
    </div>
  );
}

function TransactionTable({ rows, onOpen, compact = false, activeHash }: { rows: Transaction[]; onOpen: (txHash: string) => Promise<void>; compact?: boolean; activeHash?: string }) {
  return (
    <div className={compact ? "table compact" : "table"}>
      <div className="thead grid-tx"><span>Time</span><span>Chain</span><span>Hash</span><span>From → To</span><span>Asset</span><span>Value</span><span>Finality</span></div>
      {rows.map((tx) => (
        <button className={activeHash === tx.tx_hash ? "trow grid-tx active-stream-row" : "trow grid-tx"} key={tx.tx_hash} onClick={() => onOpen(tx.tx_hash)}>
          <span>{formatTime(tx.timestamp)}</span>
          <Badge tone={tx.chain_id}>{tx.chain_id}</Badge>
          <span className="mono">{short(tx.tx_hash)}</span>
          <span className="mono">{tx.from_address} → {tx.to_address}</span>
          <span>{tx.amount_native} {tx.asset}</span>
          <strong>₹{tx.value_inr.toLocaleString("en-IN")}</strong>
          <Badge tone="green">{tx.finality}</Badge>
        </button>
      ))}
    </div>
  );
}

function RapidFlowStrip({ rows, activeIndex, onOpen, large = false }: { rows: Transaction[]; activeIndex: number; onOpen: (txHash: string) => Promise<void>; large?: boolean }) {
  const visible = rows.slice(0, large ? 8 : 6);
  const active = rows.length ? rows[activeIndex % rows.length] : null;
  const chains = (["ethereum", "polygon", "tron", "bitcoin"] as Chain[]).map((chain) => ({
    chain,
    rows: rows.filter((row) => row.chain_id === chain),
    value: rows.filter((row) => row.chain_id === chain).reduce((sum, row) => sum + row.value_inr, 0)
  }));
  const maxChainValue = Math.max(1, ...chains.map((item) => item.value));
  return (
    <section className={large ? "rapid-flow large" : "rapid-flow"}>
      <div className="flow-head">
        <div>
          <p className="eyebrow">Rapid Transaction Flow</p>
          <strong>{active ? `${active.chain_id.toUpperCase()} ${short(active.tx_hash)} · ₹${active.value_inr.toLocaleString("en-IN")}` : "Waiting for fixture replay"}</strong>
        </div>
        <Badge tone="fixture">FIXTURE REPLAY</Badge>
      </div>
      <div className="flow-lane" aria-label="Rapid fixture transaction replay lane">
        {visible.map((tx, index) => {
          const isActive = active?.tx_hash === tx.tx_hash;
          return (
            <button key={tx.tx_hash} className={isActive ? "flow-chip active" : "flow-chip"} onClick={() => onOpen(tx.tx_hash)}>
              <span className="flow-dot" />
              <span className="mono">{short(tx.tx_hash)}</span>
              <b>{tx.asset}</b>
              <small>hop {tx.hop}</small>
              {index < visible.length - 1 && <i />}
            </button>
          );
        })}
      </div>
      <div className="flow-visual-grid">
        {chains.map((item) => (
          <button key={item.chain} className={active?.chain_id === item.chain ? "chain-flow active" : "chain-flow"} onClick={() => item.rows[0] && onOpen(item.rows[0].tx_hash)}>
            <span><Badge tone={item.chain}>{item.chain}</Badge><b>{item.rows.length}</b></span>
            <div className="chain-bar"><i style={{ width: `${Math.max(8, (item.value / maxChainValue) * 100)}%` }} /></div>
            <small>₹{item.value.toLocaleString("en-IN")}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function StreamPipeline({ stages, activeStage, paused }: { stages: string[]; activeStage: number; paused: boolean }) {
  return (
    <div className="stream-pipeline" aria-label="Simulated transaction processing pipeline">
      {stages.map((stage, index) => (
        <div key={stage} className={index === activeStage && !paused ? "pipeline-stage active" : index < activeStage ? "pipeline-stage done" : "pipeline-stage"}>
          <span>{stage}</span>
        </div>
      ))}
    </div>
  );
}

function TraceControls({ limits, setLimits }: { limits: TraceLimits; setLimits: (limits: TraceLimits) => void }) {
  const fields: Array<[keyof TraceLimits, string]> = [
    ["max_hops", "Max hops"],
    ["time_window_hours", "Time window hours"],
    ["minimum_value_inr", "Minimum INR"],
    ["max_outflows", "Max outflows"],
    ["max_nodes", "Max nodes"],
    ["timeout_seconds", "Timeout seconds"]
  ];
  return (
    <div className="limits-grid">
      {fields.map(([key, label]) => (
        <label key={key}>{label}<input type="number" value={limits[key]} onChange={(e) => setLimits({ ...limits, [key]: Number(e.target.value) })} /></label>
      ))}
    </div>
  );
}

function TraceSummary({ trace }: { trace: TraceResult | null }) {
  if (!trace) return <div className="skeleton">Trace result pending...</div>;
  return (
    <div className="trace-summary">
      <span>Root <b className="mono">{trace.root_wallet}</b></span>
      <span>Nodes <b>{trace.node_count}</b></span>
      <span>Edges <b>{trace.edge_count}</b></span>
      <span>Depth <b>{trace.max_depth_reached}</b></span>
      <span>Termination <b>{trace.termination_reason}</b></span>
      <Badge tone="partial">{trace.coverage}</Badge>
    </div>
  );
}

function TraceGraphProgress({ total, revealed, isTracing }: { total: number; revealed: number; isTracing: boolean }) {
  return (
    <div className="trace-graph-progress">
      <div>
        <strong>{isTracing ? "Graph trace running" : "Graph trace ready"}</strong>
        <span>{Math.min(revealed, total)} of {total} fund-flow edges visible</span>
      </div>
      <meter min={0} max={Math.max(1, total)} value={Math.min(revealed, total)} />
    </div>
  );
}

function FundFlowGraph({
  nodes,
  edges,
  selectedId,
  activeEdgeId,
  onNode,
  onEdge
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId?: string;
  activeEdgeId?: string;
  onNode: (node: GraphNode) => void;
  onEdge: (edge: GraphEdge) => void;
}) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const totalValue = edges.reduce((sum, edge) => sum + edge.value_inr, 0);
  const graphNodes = nodes.filter((node) => edges.some((edge) => edge.source === node.id || edge.target === node.id));
  const positions = computeCircularPositions(graphNodes, edges);
  const [fullScreen, setFullScreen] = useState(false);
  const center = { x: 560, y: 360 };

  return (
    <div className={fullScreen ? "graph-shell graph-fullscreen" : "graph-shell"}>
      <div className="graph-toolbar">
        <Badge tone="blue">Circular Network Graph</Badge>
        <span>GNN-style radial fund flow · click nodes or edges for details</span>
        <strong>₹{totalValue.toLocaleString("en-IN")} traced</strong>
        <button className="ghost graph-fullscreen-toggle" onClick={() => setFullScreen((value) => !value)}>
          {fullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </div>
      <svg className="circular-graph" viewBox="0 0 1120 720" role="img" aria-label="Circular node and edge fund flow graph">
        <defs>
          <marker id="arrow-confirmed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5da9ff" />
          </marker>
          <marker id="arrow-heuristic" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f5b84b" />
          </marker>
          <radialGradient id="network-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#25435f" stopOpacity=".72" />
            <stop offset="66%" stopColor="#102131" stopOpacity=".28" />
            <stop offset="100%" stopColor="#0b1118" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="network-glow" cx={center.x} cy={center.y} r="310" />
        <circle className="network-ring" cx={center.x} cy={center.y} r="105" />
        <circle className="network-ring" cx={center.x} cy={center.y} r="205" />
        <circle className="network-ring outer" cx={center.x} cy={center.y} r="305" />
        {edges.map((edge) => {
          const source = positions[edge.source];
          const target = positions[edge.target];
          if (!source || !target) return null;
          const selected = selectedId === edge.id || activeEdgeId === edge.id;
          const bend = getArcBend(source, target, center, edge.hop);
          const mid = getQuadraticPoint(source, bend, target, 0.5);
          return (
            <g key={edge.id} className={selected ? "flow-edge selected" : "flow-edge"} onClick={() => onEdge(edge)}>
              <path
                d={`M ${source.x} ${source.y} Q ${bend.x} ${bend.y} ${target.x} ${target.y}`}
                className={`${edge.style === "DASHED" ? "dashed" : ""}${activeEdgeId === edge.id ? " pulse" : ""}`}
                markerEnd={edge.style === "DASHED" ? "url(#arrow-heuristic)" : "url(#arrow-confirmed)"}
              />
              <foreignObject x={mid.x - 58} y={mid.y - 19} width="116" height="38">
                <button className={edge.style === "DASHED" ? "edge-pill heuristic" : "edge-pill"} onClick={(event) => { event.stopPropagation(); onEdge(edge); }}>
                  <span>{edge.asset}</span>
                  <b>₹{Math.round(edge.value_inr / 1000)}k</b>
                </button>
              </foreignObject>
            </g>
          );
        })}
        {graphNodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const radius = node.type === "AGGREGATION_WALLET" ? 48 : node.type.includes("VASP") ? 42 : 36;
          return (
            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} className={selectedId === node.id ? "flow-node selected" : "flow-node"} onClick={() => onNode(node)}>
              <circle r={radius} className={node.type.toLowerCase()} />
              <text y="-5">{node.label}</text>
              <text y="14" className="mono">{node.id} · {node.chain}</text>
              <text y={radius + 20} className="node-type">{node.type.replaceAll("_", " ")}</text>
            </g>
          );
        })}
      </svg>
      <div className="fund-flow-table">
        <div className="thead grid-flow"><span>Hop</span><span>From</span><span>To</span><span>Evidence</span><span>Asset</span><span>Value</span></div>
        {edges.map((edge) => (
          <button key={edge.id} className={selectedId === edge.id || activeEdgeId === edge.id ? "trow grid-flow active-stream-row" : "trow grid-flow"} onClick={() => onEdge(edge)}>
            <span>H{edge.hop}</span>
            <span>{nodeById.get(edge.source)?.label ?? edge.source}</span>
            <span>{nodeById.get(edge.target)?.label ?? edge.target}</span>
            <Badge tone={edge.evidence_type === "HEURISTIC" ? "heuristic" : "green"}>{edge.evidence_type}</Badge>
            <span>{edge.asset}</span>
            <strong>₹{edge.value_inr.toLocaleString("en-IN")}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function computeCircularPositions(nodes: GraphNode[], edges: GraphEdge[]) {
  const depth = new Map<string, number>();
  nodes.forEach((node) => depth.set(node.id, node.id === "W1" ? 0 : 1));
  for (let pass = 0; pass < 8; pass += 1) {
    edges.forEach((edge) => {
      const nextDepth = Math.max(depth.get(edge.target) ?? 0, (depth.get(edge.source) ?? 0) + 1);
      depth.set(edge.target, Math.min(6, nextDepth));
    });
  }

  const center = { x: 560, y: 360 };
  const positions: Record<string, { x: number; y: number }> = {};
  const centerNode = nodes.find((node) => node.type === "AGGREGATION_WALLET") ?? nodes.find((node) => node.id === "W5");
  if (centerNode) positions[centerNode.id] = center;

  const orbitNodes = nodes
    .filter((node) => node.id !== centerNode?.id)
    .sort((a, b) => (depth.get(a.id) ?? 0) - (depth.get(b.id) ?? 0) || a.id.localeCompare(b.id));

  const radiusByType: Record<string, number> = {
    REPORTED_WALLET: 245,
    INTERMEDIARY_WALLET: 205,
    BRIDGE_CONTRACT: 150,
    DEX_POOL: 178,
    MIXER_BOUNDARY: 262,
    HEURISTIC_EXIT: 300,
    VASP_CANDIDATE: 284,
    VASP_DEPOSIT: 304,
    CROSS_CHAIN_DESTINATION: 240
  };

  orbitNodes.forEach((node, index) => {
    const count = orbitNodes.length || 1;
    const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / count;
    const radius = radiusByType[node.type] ?? Math.min(305, 150 + (depth.get(node.id) ?? 1) * 42);
    positions[node.id] = {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    };
  });
  return positions;
}

function getArcBend(source: { x: number; y: number }, target: { x: number; y: number }, center: { x: number; y: number }, hop: number) {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const dx = midX - center.x;
  const dy = midY - center.y;
  const length = Math.hypot(dx, dy) || 1;
  const pull = hop % 2 === 0 ? 46 : -34;
  return {
    x: midX + (dy / length) * pull,
    y: midY - (dx / length) * pull
  };
}

function getQuadraticPoint(source: { x: number; y: number }, bend: { x: number; y: number }, target: { x: number; y: number }, t: number) {
  const mt = 1 - t;
  return {
    x: mt * mt * source.x + 2 * mt * t * bend.x + t * t * target.x,
    y: mt * mt * source.y + 2 * mt * t * bend.y + t * t * target.y
  };
}

function GraphInspector({
  nodes,
  edges,
  selectedId,
  activeEdgeId,
  onNode,
  onEdge
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId?: string;
  activeEdgeId?: string;
  onNode: (node: GraphNode) => void;
  onEdge: (edge: GraphEdge) => void;
}) {
  return (
    <div className="graph-inspector">
      <div>
        <strong>Control Flow Graph Inspector</strong>
        <span>Click a node or edge below, or click directly on the graph.</span>
      </div>
      <div className="graph-action-grid">
        {nodes.slice(0, 6).map((node) => (
          <button key={node.id} className={selectedId === node.id ? "selected" : ""} onClick={() => onNode(node)}>
            <span>{node.label}</span>
            <small className="mono">{node.id}</small>
          </button>
        ))}
      </div>
      <div className="edge-action-list">
        {edges.map((edge) => (
          <button key={edge.id} className={selectedId === edge.id || activeEdgeId === edge.id ? "selected" : ""} onClick={() => onEdge(edge)}>
            <Badge tone={edge.evidence_type === "HEURISTIC" ? "heuristic" : edge.evidence_type === "BRIDGE_PROVEN" ? "green" : "blue"}>{edge.style === "DASHED" ? "HEURISTIC" : `HOP ${edge.hop}`}</Badge>
            <span className="mono">{edge.source} → {edge.target}</span>
            <strong>₹{edge.value_inr.toLocaleString("en-IN")}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function FindingCard({ finding, onClick }: { finding: PatternFinding; onClick: () => void }) {
  return (
    <button className="mini-card" onClick={onClick}>
      <div><strong>{finding.pattern_type}</strong>{finding.india_specific && <Badge tone="india">India Fraud Pattern</Badge>}</div>
      <span>Confidence: {finding.confidence}</span>
      <span className="mono">{finding.rule_version}</span>
      <Badge tone={finding.data_coverage === "PARTIAL" ? "partial" : "green"}>{finding.data_coverage}</Badge>
    </button>
  );
}

function FindingDetailCard({ finding, onOpen, openTransaction }: { finding: PatternFinding; onOpen: () => void; openTransaction: (txHash: string) => Promise<void> }) {
  return (
    <article className="finding-card">
      <div className="summary-strip">
        <strong>{finding.pattern_type}</strong>
        {finding.india_specific && <Badge tone="india">India Fraud Pattern</Badge>}
        <Badge tone={finding.confidence === "HIGH" ? "red" : "amber"}>{finding.confidence}</Badge>
      </div>
      <p className="mono">{finding.rule_version}</p>
      {finding.pattern_type === "MULE_NETWORK" && (
        <dl>
          <dt>Victim wallets</dt><dd>{finding.victim_wallet_count}</dd>
          <dt>Aggregation address</dt><dd className="mono">{finding.aggregation_address}</dd>
          <dt>Aggregated USD</dt><dd>${finding.total_value_aggregated_usd}</dd>
        </dl>
      )}
      <div className="evidence-links">
        {finding.evidence_references.map((ref) => <button key={ref} onClick={() => openTransaction(ref)} className="mono">{ref}</button>)}
      </div>
      <p className="uncertainty">{finding.uncertainty_note ?? "Finding is deterministic fixture output with evidence references and data-coverage limits."}</p>
      <button onClick={onOpen}>Open Detail</button>
    </article>
  );
}

function VaspRow({ candidate, onClick }: { candidate: VASPCluster; onClick: () => void }) {
  return (
    <button className="vasp-row" onClick={onClick}>
      <div>
        <strong>{candidate.name}</strong>
        <span className="mono">{candidate.address}</span>
      </div>
      <Badge tone={candidate.label_status.toLowerCase()}>{candidate.label_status}</Badge>
      <span>{Math.round(candidate.confidence * 100)}%</span>
      <span>hop {candidate.hop_distance}</span>
    </button>
  );
}

function AttributionTrace({ attribution }: { attribution: AttributionAssessment }) {
  const sum = Object.values(attribution.final_weights).reduce((acc, item) => acc + item, 0);
  return (
    <div className="attribution">
      <div className="summary-strip">
        <Badge tone="green">{attribution.confidence_band}</Badge>
        <span className="mono">{attribution.policy_version}</span>
        <strong>Score {attribution.score.toFixed(2)}</strong>
        <span>Final weights sum {sum.toFixed(2)}</span>
      </div>
      <div className="weights">
        {Object.entries(attribution.final_weights).map(([name, value]) => (
          <div key={name}><span>{name}</span><meter min={0} max={1} value={value} /><b>{value.toFixed(2)}</b></div>
        ))}
      </div>
      <details open>
        <summary>Scoring trace</summary>
        <ol>
          {attribution.scoring_metadata.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p>Fired modifiers: {attribution.fired_modifiers.join(", ")}. path_contains_bridge = {String(attribution.scoring_metadata.path_contains_bridge)}.</p>
      </details>
    </div>
  );
}

function RiskPanel({ risk }: { risk: RiskAssessment }) {
  return (
    <div className="stack">
      <Metric label="Risk tier" value={`${risk.risk_tier} ${risk.risk_score}`} accent="red" />
      <span className="mono">{risk.rule_version}</span>
      {risk.factors.map((factor) => (
        <div className="factor" key={factor.name}><strong>{factor.name}</strong><meter min={0} max={1} value={factor.weight} /><span>{factor.evidence.join(", ")}</span></div>
      ))}
    </div>
  );
}

function RecoveryCard({ recovery }: { recovery: RecoveryEstimate | null }) {
  if (!recovery?.eligible) return <Metric label="Heuristic Recovery Estimate" value="Insufficient attribution" accent="amber" />;
  return <Metric label="Heuristic Recovery Estimate" value={`${Math.round(recovery.recovery_score * 100)}% · ${recovery.action_window_hours}h`} accent="amber" />;
}

function RecoveryDetails({ recovery }: { recovery: RecoveryEstimate | null }) {
  if (!recovery) return <div className="skeleton">Loading recovery fixture...</div>;
  return (
    <div className="recovery-detail">
      <div className="summary-strip">
        <Badge tone="amber">{recovery.display_tier}</Badge>
        <strong>{recovery.label}</strong>
        <span>{recovery.disclaimer}</span>
      </div>
      <div className="metric-row">
        <Metric label="Score" value={recovery.recovery_score.toFixed(2)} accent="amber" />
        <Metric label="Action window" value={`${recovery.action_window_hours}h`} accent="red" />
        <Metric label="Top attribution" value={recovery.top_candidate_confidence.toFixed(2)} accent="green" />
      </div>
      <div className="weights">
        {(["value_ratio", "exchange_cooperation", "time_urgency", "path_clarity"] as const).map((key) => (
          <div key={key}><span>{key}</span><meter min={0} max={1} value={recovery[key]} /><b>{recovery[key].toFixed(2)}</b></div>
        ))}
      </div>
      <div className="warning">Exchange cooperation value: {recovery.exchange_cooperation} — administrator estimate, last reviewed {recovery.cooperation_last_reviewed}. Not a statistical probability.</div>
    </div>
  );
}

function CrossChainCard({ link }: { link: CrossChainLink }) {
  return (
    <article className="cross-card">
      <div className="summary-strip">
        <Badge tone={link.relationship === "PROVEN_BRIDGE" ? "green" : "heuristic"}>{link.relationship === "PROVEN_BRIDGE" ? "PROVEN BRIDGE" : "HEURISTIC CORRELATION"}</Badge>
        <span>{link.from_chain} → {link.to_chain}</span>
        <span>Δ {link.timestamp_delta_minutes}m</span>
      </div>
      <p className="mono">{link.from_address} → {link.to_address}</p>
      <p>Value correlation {link.value_correlation}. Evidence strength: {link.evidence_strength}. Uncertainty: {String(link.uncertainty)}.</p>
    </article>
  );
}

function Recommendation({ rec, onOpenEvidence }: { rec: InvestigativeRecommendation; onOpenEvidence: (txHash: string) => Promise<void> }) {
  return (
    <article className="recommendation">
      <div className="summary-strip"><Badge tone={rec.priority === "HIGH" ? "red" : "amber"}>{rec.priority}</Badge><strong>{rec.title}</strong></div>
      <p>{rec.reason}</p>
      <p className="uncertainty">{rec.uncertainty}</p>
      <div className="evidence-links">{rec.evidence_references.map((ref) => <button key={ref} className="mono" onClick={() => onOpenEvidence(ref)}>{ref}</button>)}</div>
    </article>
  );
}

function EvidenceTable({ evidence, onOpen }: { evidence: EvidenceManifest; onOpen: (item: EvidenceItem) => void }) {
  return (
    <div className="table">
      <div className="thead grid-ev"><span>ID</span><span>Type</span><span>Source</span><span>Reference</span><span>Hash</span><span>Immutable</span></div>
      {evidence.items.map((item) => (
        <button className="trow grid-ev" key={item.evidence_id} onClick={() => onOpen(item)}>
          <span className="mono">{item.evidence_id}</span>
          <span>{item.type}</span>
          <span>{item.source}</span>
          <span className="mono">{item.reference}</span>
          <span className="mono">{item.payload_hash}</span>
          <Badge tone="green">{String(item.immutable)}</Badge>
        </button>
      ))}
    </div>
  );
}

function Report({ report }: { report: ReportView }) {
  return (
    <div className="report">
      <div className="report-section"><h3>Case Information</h3><p>{report.case.case_id} · {report.case.source_badge} · {report.case.fraud_type} · ₹{report.case.fraud_amount_inr.toLocaleString("en-IN")}</p></div>
      <div className="report-section"><h3>Trace Summary</h3><p>{report.trace.node_count} nodes, {report.trace.edge_count} edges, termination {report.trace.termination_reason}, coverage {report.trace.coverage}.</p></div>
      <div className="report-section"><h3>Typologies</h3><p>{report.typologies.map((item) => item.pattern_type).join(", ")}</p></div>
      <div className="report-section"><h3>VASP Candidates</h3><p>{report.vasps.map((item) => `${item.name} (${item.label_status})`).join(", ")}</p></div>
      <div className="report-section"><h3>Risk / Attribution / Recovery</h3><p>Risk {report.risk.risk_tier} {report.risk.risk_score}. Attribution {report.attribution.score}. {report.recovery.label}: {report.recovery.recovery_score} ({report.recovery.disclaimer}).</p></div>
      <div className="report-section"><h3>Recommendations</h3><ul>{report.recommendations.map((rec) => <li key={rec.recommendation_id}>{rec.title}: {rec.reason}</li>)}</ul></div>
      <div className="report-section"><h3>Evidence Manifest</h3><p>{report.evidence.manifest_id} · {report.evidence.integrity_status} · {report.evidence.items.length} fixture evidence items.</p></div>
      <div className="actions"><button onClick={() => window.print()}>Print / Save Report</button><button onClick={() => downloadJson("cryptotrace-report.json", report)}>Export JSON</button></div>
    </div>
  );
}

function AuditTimeline({ events }: { events: AuditEvent[] }) {
  return (
    <div className="timeline">
      {events.map((event) => (
        <div key={event.audit_id} className="timeline-item">
          <Badge tone={event.actor_role === "SUPERVISOR" ? "green" : event.actor_role === "SYSTEM" ? "fixture" : "blue"}>{event.actor_role}</Badge>
          <strong>{event.action}</strong>
          <span className="mono">{event.target_id}</span>
          <small>{formatTime(event.timestamp)} · {event.integrity_hash}</small>
        </div>
      ))}
    </div>
  );
}

function DrawerPanel({ drawer, onClose, openTransaction }: { drawer: Drawer; onClose: () => void; openTransaction: (txHash: string) => Promise<void> }) {
  if (!drawer) return null;
  return (
    <aside className="drawer">
      <button className="close" onClick={onClose}>Close</button>
      {drawer.kind === "tx" && <TxDetail tx={drawer.tx} />}
      {drawer.kind === "node" && <NodeDetail node={drawer.node} />}
      {drawer.kind === "edge" && <EdgeDetail edge={drawer.edge} tx={drawer.tx} />}
      {drawer.kind === "finding" && <FindingDrawer finding={drawer.finding} openTransaction={openTransaction} />}
      {drawer.kind === "vasp" && <VaspDrawer candidate={drawer.candidate} />}
      {drawer.kind === "evidence" && <EvidenceDrawer item={drawer.item} />}
    </aside>
  );
}

function TxDetail({ tx }: { tx: Transaction }) {
  return (
    <div className="drawer-content">
      <p className="eyebrow">Transaction Detail</p>
      <h2 className="mono">{tx.tx_hash}</h2>
      <dl>
        <dt>Chain / block</dt><dd>{tx.chain_id} · <span className="mono">{tx.block_height}</span></dd>
        <dt>Timestamp</dt><dd>{tx.timestamp}</dd>
        <dt>From</dt><dd className="mono">{tx.from_address}</dd>
        <dt>To</dt><dd className="mono">{tx.to_address}</dd>
        <dt>Asset / amount</dt><dd>{tx.amount_native} {tx.asset}</dd>
        <dt>Value</dt><dd>₹{tx.value_inr.toLocaleString("en-IN")}</dd>
        <dt>Finality</dt><dd><Badge tone="green">{tx.finality}</Badge></dd>
        <dt>Provider / provenance</dt><dd>{tx.provider} · <span className="mono">{tx.provenance_id}</span></dd>
      </dl>
      <Badge tone="fixture">DEMO DATA</Badge>
    </div>
  );
}

function NodeDetail({ node }: { node: GraphNode }) {
  return <div className="drawer-content"><p className="eyebrow">Wallet / Entity Node</p><h2>{node.label}</h2><p className="mono">{node.address}</p><Badge tone={node.type.includes("HEURISTIC") ? "heuristic" : "green"}>{node.type}</Badge><p>Chain: {node.chain}. This node is fixture-backed and does not establish ownership.</p></div>;
}

function EdgeDetail({ edge, tx }: { edge: GraphEdge; tx?: Transaction }) {
  return <div className="drawer-content"><p className="eyebrow">Graph Edge</p><h2>{edge.style === "DASHED" ? "Possible Exit — Heuristic Only" : "Confirmed Transfer"}</h2><p className="mono">{edge.source} → {edge.target}</p><Badge tone={edge.evidence_type === "HEURISTIC" ? "heuristic" : "green"}>{edge.evidence_type}</Badge>{tx ? <TxDetail tx={tx} /> : <p className="uncertainty">Heuristic mixer-boundary relationship. Not cryptographic proof of connection to the suspect wallet.</p>}</div>;
}

function FindingDrawer({ finding, openTransaction }: { finding: PatternFinding; openTransaction: (txHash: string) => Promise<void> }) {
  return <div className="drawer-content"><p className="eyebrow">Finding Detail</p><h2>{finding.pattern_type}</h2>{finding.india_specific && <Badge tone="india">India Fraud Pattern</Badge>}<p>Confidence: {finding.confidence}. Rule: <span className="mono">{finding.rule_version}</span>. Coverage: {finding.data_coverage}.</p><p className="uncertainty">{finding.uncertainty_note ?? "Evidence-backed deterministic finding; confidence is not legal certainty."}</p><div className="evidence-links">{finding.evidence_references.map((ref) => <button key={ref} className="mono" onClick={() => openTransaction(ref)}>{ref}</button>)}</div></div>;
}

function VaspDrawer({ candidate }: { candidate: VASPCluster }) {
  return <div className="drawer-content"><p className="eyebrow">VASP Candidate</p><h2>{candidate.name}</h2><p className="mono">{candidate.address}</p><Badge tone={candidate.label_status.toLowerCase()}>{candidate.label_status}</Badge><p>Confidence {candidate.confidence}; band {candidate.confidence_band}; hop distance {candidate.hop_distance}; source {candidate.label_source}.</p><div className="warning">This VASP label or inferred cluster is candidate intelligence only. It is not wallet ownership proof or criminal-liability proof.</div></div>;
}

function EvidenceDrawer({ item }: { item: EvidenceItem }) {
  return <div className="drawer-content"><p className="eyebrow">Evidence Detail</p><h2 className="mono">{item.evidence_id}</h2><dl><dt>Type</dt><dd>{item.type}</dd><dt>Source</dt><dd>{item.source}</dd><dt>Reference</dt><dd className="mono">{item.reference}</dd><dt>Payload hash</dt><dd className="mono">{item.payload_hash}</dd><dt>Immutable</dt><dd>{String(item.immutable)}</dd></dl><Badge tone="fixture">FIXTURE REPLAY</Badge></div>;
}

function short(value: string) {
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function formatTime(value: string) {
  return value.replace("T", " ").slice(0, 16);
}

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
