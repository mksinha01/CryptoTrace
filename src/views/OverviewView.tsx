import React from "react";
import type { Case, Role } from "../types";
import { mockApi } from "../services/mockApi";
import { HeroCaseBanner } from "../components/common/HeroCaseBanner";
import { KpiBanner } from "../components/common/KpiBanner";
import { Badge } from "../components/common/Badge";
import { SkeletonLoader, ErrorNotice } from "../components/common/StateFeedback";
import { HalyardMetricCards } from "../components/common/HalyardMetricCards";

interface OverviewViewProps {
  activeCase: Case;
  onNavigate: (route: string) => void;
  openTransaction: (txHash: string) => Promise<void>;
  uiMode?: "halyard" | "kestrel" | "classic";
}

export function OverviewView({ activeCase, onNavigate, openTransaction, uiMode = "halyard" }: OverviewViewProps) {
  const [cases, setCases] = React.useState<any>(null);
  const [txs, setTxs] = React.useState<any>(null);
  const [alerts, setAlerts] = React.useState<any>(null);
  const [status, setStatus] = React.useState<any>(null);
  const [recovery, setRecovery] = React.useState<any>(null);
  const [risk, setRisk] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      mockApi.getCases(),
      mockApi.getTransactions({ limit: 6 }),
      mockApi.getAlerts(),
      mockApi.getSystemStatus(),
      mockApi.getRecovery(),
      mockApi.getRisk()
    ])
      .then(([casesRes, txRes, alertsRes, statusRes, recRes, riskRes]) => {
        if (!active) return;
        setCases(casesRes.data);
        setTxs(txRes.data);
        setAlerts(alertsRes.data);
        setStatus(statusRes.data);
        setRecovery(recRes.data);
        setRisk(riskRes.data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load overview data.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  if (loading) return <SkeletonLoader text="Loading investigator command center..." />;
  if (error) return <ErrorNotice message={error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Halyard Signature Header & Metrics when in Halyard Mode */}
      {uiMode === "halyard" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ margin: "0 0 6px", fontSize: "30px", fontWeight: 500, letterSpacing: "-0.025em", color: "var(--text)" }}>
                Investigator Command Center
              </h1>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-3)" }}>
                Live multi-chain telemetry & Indian law enforcement triage for active suspect entities
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="halyard-ghost" style={{ fontSize: "12px" }}>
                Window: <strong>24 Hours</strong>
              </span>
              <span className="halyard-ghost" style={{ fontSize: "12px", color: "var(--accent)" }}>
                Active Case: <strong>{activeCase.case_id}</strong>
              </span>
            </div>
          </div>

          <HalyardMetricCards
            onNavigate={onNavigate}
            tracedAmount="₹7,20,500"
            hopDepth={4}
            vaspCount={3}
            alertsCount={alerts?.length || 18}
          />
        </>
      )}

      {/* Hero Case Banner */}
      <HeroCaseBanner
        activeCase={activeCase}
        onOpenTrace={() => onNavigate("investigations")}
      />

      {/* Kestrel Signature Points / KPI Banner */}
      <KpiBanner
        reportedWallet={activeCase.reported_wallet}
        caseId={activeCase.case_id}
        recovery={recovery}
        risk={risk}
      />

      {/* Popular Forensic Modules Grid (Kestrel 'Popular Onchain' layout) */}
      <section>
        <div className="sec-head">
          <div>
            <h2>Forensic Intelligence Modules</h2>
            <p>High-priority capabilities designed for Indian Law Enforcement</p>
          </div>
          <button className="link-btn" onClick={() => onNavigate("investigations")}>
            Open Full Workstation →
          </button>
        </div>

        <div className="kestrel-grid-4" style={{ marginTop: "18px" }}>
          {/* Card 1: MULE_NETWORK */}
          <article className="card" onClick={() => onNavigate("typologies")}>
            <div className="thumb">
              <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="grad-mule" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#1C2E2A" />
                    <stop offset="1" stopColor="#08090B" />
                  </linearGradient>
                </defs>
                <rect width="320" height="200" fill="url(#grad-mule)" />
                <circle cx="160" cy="90" r="32" fill="#37B394" fillOpacity="0.2" stroke="#37B394" strokeWidth="2" />
                <circle cx="90" cy="140" r="16" fill="#14171D" stroke="#6FD7BC" strokeWidth="1.5" />
                <circle cx="230" cy="140" r="16" fill="#14171D" stroke="#6FD7BC" strokeWidth="1.5" />
                <line x1="90" y1="140" x2="140" y2="105" stroke="#6FD7BC" strokeWidth="2" strokeDasharray="3 4" />
                <line x1="230" y1="140" x2="180" y2="105" stroke="#6FD7BC" strokeWidth="2" strokeDasharray="3 4" />
                <text x="160" y="95" textAnchor="middle" fill="#6FD7BC" fontSize="11" fontWeight="700">AGGREGATOR</text>
              </svg>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <Badge tone="india">India Pattern</Badge>
                <Badge tone="amber">MEDIUM</Badge>
              </div>
              <h3>MULE_NETWORK</h3>
              <span>Multi-victim aggregation pattern with explicit behavioral correlation.</span>
            </div>
          </article>

          {/* Card 2: AdaptiveVASPScorer */}
          <article className="card" onClick={() => onNavigate("vasp")}>
            <div className="thumb">
              <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="grad-vasp" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#2E2818" />
                    <stop offset="1" stopColor="#08090B" />
                  </linearGradient>
                </defs>
                <rect width="320" height="200" fill="url(#grad-vasp)" />
                <path d="M40 130 H280" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <rect x="70" y="80" width="34" height="50" rx="4" fill="#E8B24B" />
                <rect x="120" y="60" width="34" height="70" rx="4" fill="#DE7040" />
                <rect x="170" y="40" width="34" height="90" rx="4" fill="#37B394" />
                <rect x="220" y="55" width="34" height="75" rx="4" fill="#6FD7BC" />
              </svg>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <Badge tone="green">Score 0.82</Badge>
                <Badge tone="blue">v1.2 Policy</Badge>
              </div>
              <h3>AdaptiveVASPScorer</h3>
              <span>Normalized vector attribution trace summing to exactly 1.00.</span>
            </div>
          </article>

          {/* Card 3: Cross-Chain Intelligence */}
          <article className="card" onClick={() => onNavigate("cross-chain")}>
            <div className="thumb">
              <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="grad-xchain" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#1A2433" />
                    <stop offset="1" stopColor="#08090B" />
                  </linearGradient>
                </defs>
                <rect width="320" height="200" fill="url(#grad-xchain)" />
                <circle cx="80" cy="100" r="26" fill="#121417" stroke="#4F9FD1" strokeWidth="2" />
                <text x="80" y="104" textAnchor="middle" fill="#4F9FD1" fontSize="10" fontWeight="700">ETH</text>
                <circle cx="240" cy="100" r="26" fill="#121417" stroke="#9D7BFF" strokeWidth="2" />
                <text x="240" y="104" textAnchor="middle" fill="#9D7BFF" fontSize="10" fontWeight="700">POLY</text>
                <path d="M110 100 Q160 60 210 100" fill="none" stroke="#6FD7BC" strokeWidth="2" strokeDasharray="4 4" />
                <rect x="140" y="65" width="40" height="18" rx="4" fill="#0B0C0E" stroke="#37B394" />
                <text x="160" y="77" textAnchor="middle" fill="#6FD7BC" fontSize="8" fontWeight="700">BRIDGE</text>
              </svg>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <Badge tone="purple">Cross-Chain</Badge>
                <Badge tone="green">Bridge Proven</Badge>
              </div>
              <h3>Cross-Chain Provenance</h3>
              <span>Direct bridge event extraction versus heuristic correlations.</span>
            </div>
          </article>

          {/* Card 4: Preservation Workflow */}
          <article className="card" onClick={() => onNavigate("supervisor")}>
            <div className="thumb">
              <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="grad-sup" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#251F2E" />
                    <stop offset="1" stopColor="#08090B" />
                  </linearGradient>
                </defs>
                <rect width="320" height="200" fill="url(#grad-sup)" />
                <path d="M160 50 L220 80 V130 C220 160 160 180 160 180 C160 180 100 160 100 130 V80 Z" fill="#14171D" stroke="#E8B24B" strokeWidth="2" />
                <path d="M145 115 L155 125 L175 105" stroke="#6FD7BC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <Badge tone="green">Supervisor Gated</Badge>
                <Badge tone="neutral">Section 91 CrPC</Badge>
              </div>
              <h3>Preservation Workflow</h3>
              <span>Investigator request drafting with supervisor authorization audit.</span>
            </div>
          </article>
        </div>
      </section>

      {/* Split Section: Rapid Replay Table & Chain Status */}
      <div className="kestrel-grid-3">
        <div style={{ gridColumn: "span 2" }}>
          <div className="kestrel-panel">
            <div className="kestrel-panel-head">
              <div>
                <h2>Recent Streaming Activity</h2>
                <p>Newest replayed transactions from fixture queue</p>
              </div>
              <button className="link-btn" onClick={() => onNavigate("transactions")}>
                View All →
              </button>
            </div>

            <div className="table-wrap">
              <div className="table-head grid-tx">
                <span>Time</span>
                <span>Chain</span>
                <span>Hash</span>
                <span>From → To</span>
                <span>Asset</span>
                <span>Value</span>
                <span>Finality</span>
              </div>
              {txs?.map((tx: any) => (
                <button
                  key={tx.tx_hash}
                  className="table-row grid-tx"
                  onClick={() => openTransaction(tx.tx_hash)}
                >
                  <span style={{ color: "var(--text-3)" }}>{tx.timestamp.slice(11, 19)}</span>
                  <Badge tone={tx.chain_id}>{tx.chain_id}</Badge>
                  <span className="mono" style={{ color: "var(--accent-2)" }}>{tx.tx_hash.slice(0, 10)}...</span>
                  <span className="mono" style={{ fontSize: "12px", color: "var(--text-2)" }}>
                    {tx.from_address} → {tx.to_address}
                  </span>
                  <span>{tx.amount_native} {tx.asset}</span>
                  <strong style={{ color: "var(--gold)" }}>₹{tx.value_inr.toLocaleString("en-IN")}</strong>
                  <Badge tone="green">{tx.finality}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="kestrel-panel">
            <div className="kestrel-panel-head">
              <div>
                <h2>Simulated Chain Providers</h2>
                <p>Fixture-mode RPC network states</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {status?.chains && Object.entries(status.chains).map(([chain, item]: any) => (
                <div
                  key={chain}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "var(--r-md)",
                    background: "var(--elev-2)",
                    border: "1px solid var(--line)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Badge tone={chain}>{chain}</Badge>
                    <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Block</span>
                  </div>
                  <strong className="mono" style={{ fontSize: "12px", color: "var(--text)" }}>
                    #{item.last_block}
                  </strong>
                  <Badge tone="green">{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
