import React, { useState, useEffect } from "react";
import type {
  Case,
  GraphEdge,
  GraphNode,
  PatternFinding,
  TraceLimits,
  TraceResult,
  Transaction,
  VASPCluster
} from "../types";
import type { DrawerState } from "../components/layout/DrawerPanel";
import { mockApi } from "../services/mockApi";
import { Badge } from "../components/common/Badge";
import { KpiBanner } from "../components/common/KpiBanner";
import { FundFlowGraph } from "../components/graph/FundFlowGraph";
import { GraphInspector } from "../components/graph/GraphInspector";
import { RapidFlowStrip } from "../components/graph/RapidFlowStrip";
import { SkeletonLoader, ErrorNotice } from "../components/common/StateFeedback";

interface InvestigationViewProps {
  activeCase: Case;
  setDrawer: (drawer: any) => void;
  openTransaction: (txHash: string) => Promise<void>;
}

const defaultLimits: TraceLimits = {
  max_hops: 5,
  time_window_hours: 72,
  minimum_value_inr: 5000,
  max_outflows: 10,
  max_nodes: 100,
  timeout_seconds: 15
};

export function InvestigationView({ activeCase, setDrawer, openTransaction }: InvestigationViewProps) {
  const [limits, setLimits] = useState<TraceLimits>(defaultLimits);
  const [runningStage, setRunningStage] = useState<string>("READY");
  const [hopFilter, setHopFilter] = useState(6);
  const [isTracing, setIsTracing] = useState(false);
  const [revealedEdgeCount, setRevealedEdgeCount] = useState<number | null>(null);
  const [selectedGraphItem, setSelectedGraphItem] = useState<string>("E1");
  const [flowIndex, setFlowIndex] = useState(0);

  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  const [typologies, setTypologies] = useState<PatternFinding[]>([]);
  const [vasps, setVasps] = useState<VASPCluster[]>([]);
  const [risk, setRisk] = useState<any>(null);
  const [recovery, setRecovery] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      mockApi.getTrace(),
      mockApi.getGraph(),
      mockApi.getTypologies(),
      mockApi.getVaspCandidates(),
      mockApi.getRisk(),
      mockApi.getRecovery(),
      mockApi.getRecommendations(),
      mockApi.getTransactions({ limit: 9 })
    ])
      .then(([tRes, gRes, typRes, vRes, rRes, recRes, recmRes, txRes]) => {
        if (!active) return;
        setTrace(tRes.data);
        setGraph(gRes.data);
        setTypologies(typRes.data);
        setVasps(vRes.data);
        setRisk(rRes.data);
        setRecovery(recRes.data);
        setRecommendations(recmRes.data);
        setTransactions(txRes.data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load investigation dataset.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [activeCase.case_id]);

  const visibleEdges = (graph?.edges ?? []).filter((e) => e.hop <= hopFilter);
  const displayedEdges = revealedEdgeCount === null ? visibleEdges : visibleEdges.slice(0, revealedEdgeCount);

  // Live transaction playback loop
  useEffect(() => {
    if (!transactions.length) return;
    const timer = window.setInterval(() => {
      setFlowIndex((curr) => (curr + 1) % transactions.length);
    }, 1600);
    return () => window.clearInterval(timer);
  }, [transactions.length]);

  const activeFlowTx = transactions.length ? transactions[flowIndex % transactions.length] : null;
  const activeFlowEdge = activeFlowTx
    ? visibleEdges.find(
        (edge) =>
          activeFlowTx.tx_hash.includes(edge.tx_hash.replace("...", "").slice(0, 5)) ||
          edge.tx_hash.includes(activeFlowTx.tx_hash.slice(0, 5))
      )
    : undefined;

  const runTrace = async () => {
    setIsTracing(true);
    setRevealedEdgeCount(0);
    setSelectedGraphItem("W1");

    const stages = ["FETCH", "VALIDATE", "EXTRACT", "NORMALIZE", "DEDUPLICATE", "PERSIST", "COMMIT", "ADVANCE"];
    for (let i = 0; i < visibleEdges.length; i += 1) {
      const stage = stages[i % stages.length];
      setRunningStage(`${stage} → Graph node discovery ${i + 1}/${visibleEdges.length}`);
      setRevealedEdgeCount(i + 1);
      setSelectedGraphItem(visibleEdges[i].id);
      await new Promise((resolve) => window.setTimeout(resolve, 260));
    }

    setRunningStage("ADVANCE → Synchronizing VASP & Typology intelligence");
    const response = await mockApi.runTrace(limits);
    setTrace(response.data);
    setRevealedEdgeCount(null);
    setIsTracing(false);
    setRunningStage("READY · PARTIAL COVERAGE");
  };

  if (loading) return <SkeletonLoader text="Initializing bounded graph and typology intelligence..." />;
  if (error) return <ErrorNotice message={error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Case Header Ribbon */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        borderRadius: "var(--r-lg)",
        background: "var(--elev-1)",
        border: "1px solid var(--line)"
      }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-2)" }}>
            Investigation Workstation
          </span>
          <h2 style={{ margin: "4px 0 0", fontSize: "20px", color: "var(--text)" }}>
            {activeCase.case_id} · <span style={{ color: "var(--text-2)" }}>{activeCase.fraud_type}</span>
          </h2>
          <p className="mono" style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--accent-2)" }}>
            Reported Wallet: {activeCase.reported_wallet}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge tone={activeCase.source_badge}>{activeCase.source_badge}</Badge>
          <Badge tone="partial">{activeCase.data_coverage}</Badge>
          <span className="badge neutral">Deterministic Target</span>
        </div>
      </div>

      {/* Signature Kestrel Points / KPI Banner */}
      <KpiBanner
        reportedWallet={activeCase.reported_wallet}
        caseId={activeCase.case_id}
        recovery={recovery}
        risk={risk}
        attributionBand={vasps[0]?.confidence_band || "HIGH"}
        traceCoverage={trace?.coverage || "PARTIAL"}
      />

      {/* Streaming Flow Strip */}
      <RapidFlowStrip
        rows={transactions}
        activeIndex={flowIndex}
        onOpen={openTransaction}
      />

      {/* Bounded Trace Scope & Graph Area */}
      <div className="kestrel-grid-3">
        {/* Left Controls */}
        <div>
          <div className="kestrel-panel" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="kestrel-panel-head">
              <div>
                <h2>Bounded Trace Scope</h2>
                <p>Stage: {runningStage}</p>
              </div>
              <Badge tone={isTracing ? "amber" : "green"}>{isTracing ? "TRACING" : "READY"}</Badge>
            </div>

            {/* Trace Limits Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label className="form-label">
                Max Hops
                <input
                  type="number"
                  className="form-input"
                  value={limits.max_hops}
                  onChange={(e) => setLimits({ ...limits, max_hops: Number(e.target.value) })}
                />
              </label>

              <label className="form-label">
                Window Hours
                <input
                  type="number"
                  className="form-input"
                  value={limits.time_window_hours}
                  onChange={(e) => setLimits({ ...limits, time_window_hours: Number(e.target.value) })}
                />
              </label>

              <label className="form-label">
                Min INR Floor
                <input
                  type="number"
                  className="form-input"
                  value={limits.minimum_value_inr}
                  onChange={(e) => setLimits({ ...limits, minimum_value_inr: Number(e.target.value) })}
                />
              </label>

              <label className="form-label">
                Max Outflows
                <input
                  type="number"
                  className="form-input"
                  value={limits.max_outflows}
                  onChange={(e) => setLimits({ ...limits, max_outflows: Number(e.target.value) })}
                />
              </label>

              <label className="form-label">
                Max Nodes
                <input
                  type="number"
                  className="form-input"
                  value={limits.max_nodes}
                  onChange={(e) => setLimits({ ...limits, max_nodes: Number(e.target.value) })}
                />
              </label>

              <label className="form-label">
                Timeout Sec
                <input
                  type="number"
                  className="form-input"
                  value={limits.timeout_seconds}
                  onChange={(e) => setLimits({ ...limits, timeout_seconds: Number(e.target.value) })}
                />
              </label>
            </div>

            {/* Hop Filter Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-2)", marginBottom: "6px" }}>
                <span>Graph Hop Filter</span>
                <strong className="mono" style={{ color: "var(--accent-2)" }}>≤ {hopFilter} hops</strong>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={hopFilter}
                onChange={(e) => setHopFilter(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
              <button className="btn-primary" disabled={isTracing} onClick={runTrace}>
                {isTracing ? "Executing Bounded Trace..." : "Run Bounded Trace"}
              </button>

              {/* Trace Receipt */}
              {trace && (
                <div style={{
                  padding: "14px",
                  borderRadius: "var(--r-md)",
                  background: "var(--elev-2)",
                  border: "1px solid var(--line)",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)" }}>Nodes / Edges</span>
                    <strong>{trace.node_count} nodes · {trace.edge_count} edges</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)" }}>Max Depth</span>
                    <strong>{trace.max_depth_reached} hops</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)" }}>Termination</span>
                    <Badge tone="amber">{trace.termination_reason}</Badge>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)" }}>Coverage</span>
                    <Badge tone="partial">{trace.coverage}</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Fund-Flow Graph Area */}
        <div style={{ gridColumn: "span 2" }}>
          <div className="kestrel-panel" style={{ padding: "0", overflow: "hidden" }}>
            <FundFlowGraph
              nodes={graph?.nodes ?? []}
              edges={displayedEdges}
              selectedId={selectedGraphItem}
              activeEdgeId={activeFlowEdge?.id}
              onNode={(node) => {
                setSelectedGraphItem(node.id);
                setDrawer({ kind: "node", node });
              }}
              onEdge={async (edge) => {
                setSelectedGraphItem(edge.id);
                const tx = edge.tx_hash.startsWith("HEURISTIC")
                  ? undefined
                  : (await mockApi.getTransaction(edge.tx_hash)).data;
                setDrawer({ kind: "edge", edge, tx });
              }}
            />
          </div>

          <GraphInspector
            nodes={graph?.nodes ?? []}
            edges={displayedEdges}
            selectedId={selectedGraphItem}
            activeEdgeId={activeFlowEdge?.id}
            onNode={(node) => {
              setSelectedGraphItem(node.id);
              setDrawer({ kind: "node", node });
            }}
            onEdge={async (edge) => {
              setSelectedGraphItem(edge.id);
              const tx = edge.tx_hash.startsWith("HEURISTIC")
                ? undefined
                : (await mockApi.getTransaction(edge.tx_hash)).data;
              setDrawer({ kind: "edge", edge, tx });
            }}
          />
        </div>
      </div>

      {/* Intelligence Triad: Typologies, VASP, Recommendations */}
      <div className="kestrel-grid-3">
        {/* Typologies */}
        <div className="kestrel-panel">
          <div className="kestrel-panel-head">
            <div>
              <h2>Typology Detection</h2>
              <p>Rule-versioned fraud behavioral indicators</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {typologies.slice(0, 5).map((f) => (
              <button
                key={f.finding_id}
                onClick={() => setDrawer({ kind: "finding", finding: f })}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "12px 14px",
                  borderRadius: "var(--r-md)",
                  background: "var(--elev-2)",
                  border: "1px solid var(--line)",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13.5px", color: "var(--text)" }}>{f.pattern_type}</strong>
                  {f.india_specific && <Badge tone="india">India Pattern</Badge>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-3)" }}>
                  <span>Confidence: <strong style={{ color: "var(--gold)" }}>{f.confidence}</strong></span>
                  <span className="mono">{f.rule_version}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* VASP Candidates */}
        <div className="kestrel-panel">
          <div className="kestrel-panel-head">
            <div>
              <h2>VASP Intelligence</h2>
              <p>Candidate exit clustering (not ownership proof)</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {vasps.map((candidate) => (
              <button
                key={candidate.candidate_id}
                onClick={() => setDrawer({ kind: "vasp", candidate })}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: "var(--r-md)",
                  background: "var(--elev-2)",
                  border: "1px solid var(--line)",
                  textAlign: "left"
                }}
              >
                <div>
                  <strong style={{ display: "block", fontSize: "13.5px", color: "var(--text)" }}>{candidate.name}</strong>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-3)" }}>{candidate.address.slice(0, 12)}...</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge tone={candidate.label_status.toLowerCase()}>{candidate.label_status}</Badge>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--accent-2)", marginTop: "4px" }}>
                    {Math.round(candidate.confidence * 100)}% · hop {candidate.hop_distance}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="kestrel-panel">
          <div className="kestrel-panel-head">
            <div>
              <h2>Advisory Actions</h2>
              <p>Recommended investigative follow-ups</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recommendations.map((rec) => (
              <article
                key={rec.recommendation_id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--r-md)",
                  background: "var(--elev-2)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13.5px", color: "var(--text)" }}>{rec.title}</strong>
                  <Badge tone={rec.priority === "HIGH" ? "red" : "amber"}>{rec.priority}</Badge>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-2)", lineHeight: "1.4" }}>
                  {rec.reason}
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                  {rec.evidence_references.map((ref: string) => (
                    <button
                      key={ref}
                      onClick={() => openTransaction(ref)}
                      className="mono"
                      style={{ fontSize: "11px", color: "var(--accent-2)", background: "var(--elev-1)", padding: "2px 8px", borderRadius: "4px" }}
                    >
                      {ref} ↗
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
