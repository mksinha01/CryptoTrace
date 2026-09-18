import React, { useState, useEffect } from "react";
import type { Case, Chain, SourceType } from "../types";
import { mockApi, type IntakeInput } from "../services/mockApi";
import { Badge } from "../components/common/Badge";
import { SkeletonLoader, ErrorNotice } from "../components/common/StateFeedback";

interface CasesViewProps {
  activeCase: Case;
  setActiveCase: (c: Case) => void;
  onNavigate: (route: string) => void;
}

export function CasesView({ activeCase, setActiveCase, onNavigate }: CasesViewProps) {
  const [source, setSource] = useState<SourceType>("NCRP_INTAKE");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const loadCases = async () => {
    setLoading(true);
    const res = await mockApi.getCases();
    if (res.success && res.data) {
      setCases(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCases();
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage("VALIDATE → INDEX → NORMALIZE → TRACE QUEUED");

    const response = await mockApi.createCase({ ...form, source });
    setBusy(false);

    if (!response.success || !response.data) {
      setMessage(response.error?.message ?? "Validation failed. Please verify fields.");
      return;
    }

    const caseRes = await mockApi.getCase(response.data.case_id);
    setActiveCase(caseRes.data);
    setMessage(`${response.data.confirmation} (DEMO DATA)`);
    setTimeout(() => {
      onNavigate("investigations");
    }, 900);
  };

  const filteredCases = cases.filter((c) =>
    c.case_id.toLowerCase().includes(search.toLowerCase()) ||
    c.reported_wallet.toLowerCase().includes(search.toLowerCase()) ||
    c.fraud_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="sec-head">
        <div>
          <h2>Case Intake & Active Queue</h2>
          <p>Law enforcement case registration and active investigation indexing</p>
        </div>
        <span className="badge neutral">LOCAL INTAKE REGISTER</span>
      </div>

      <div className="kestrel-grid-3">
        {/* Intake Form Panel */}
        <div style={{ gridColumn: "span 2" }}>
          <div className="kestrel-panel">
            <div className="kestrel-panel-head">
              <div>
                <h2>Case Intake Form</h2>
                <p>Select case registry source: NCRP, SAHYOG bulletin, or manual investigator entry</p>
              </div>
              <div className="segmented">
                <button
                  type="button"
                  className={source === "NCRP_INTAKE" ? "selected" : ""}
                  onClick={() => setSource("NCRP_INTAKE")}
                >
                  NCRP Intake
                </button>
                <button
                  type="button"
                  className={source === "SAHYOG" ? "selected" : ""}
                  onClick={() => setSource("SAHYOG")}
                >
                  SAHYOG
                </button>
                <button
                  type="button"
                  className={source === "MANUAL" ? "selected" : ""}
                  onClick={() => setSource("MANUAL")}
                >
                  Manual Entry
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <label className="form-label">
                Complaint / Bulletin ID
                <input
                  className="form-input mono"
                  value={form.complaint_id}
                  onChange={(e) => setForm({ ...form, complaint_id: e.target.value })}
                  placeholder="e.g. NCRP-2026-184721"
                />
              </label>

              <label className="form-label">
                Fraud Classification
                <input
                  className="form-input"
                  value={form.fraud_type}
                  onChange={(e) => setForm({ ...form, fraud_type: e.target.value })}
                  placeholder="e.g. INVESTMENT_FRAUD"
                />
              </label>

              <label className="form-label">
                Reported Loss (INR ₹)
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={form.fraud_amount_inr}
                  onChange={(e) => setForm({ ...form, fraud_amount_inr: Number(e.target.value) })}
                />
              </label>

              <label className="form-label">
                Incident Timestamp
                <input
                  className="form-input"
                  type="datetime-local"
                  value={form.incident_datetime}
                  onChange={(e) => setForm({ ...form, incident_datetime: e.target.value })}
                />
              </label>

              <label className="form-label">
                Originating Indian State
                <input
                  className="form-input"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="e.g. Chhattisgarh"
                />
              </label>

              <label className="form-label">
                Primary Blockchain
                <select
                  className="form-select"
                  value={form.chain}
                  onChange={(e) => setForm({ ...form, chain: e.target.value as Chain })}
                >
                  <option value="ethereum">Ethereum (ETH / ERC-20)</option>
                  <option value="polygon">Polygon (MATIC / PoS)</option>
                  <option value="tron">Tron (TRX / TRC-20)</option>
                  <option value="bitcoin">Bitcoin (BTC / UTXO)</option>
                </select>
              </label>

              <label className="form-label span-2">
                Suspect Wallet Address
                <input
                  className="form-input mono"
                  value={form.wallet}
                  onChange={(e) => setForm({ ...form, wallet: e.target.value })}
                  placeholder="0x... or Tron/Bitcoin address"
                />
              </label>

              <div className="span-2" style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "8px" }}>
                <button type="submit" className="btn-primary" disabled={busy}>
                  {busy ? "Processing Intake..." : "Validate & Create Demo Case"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setForm({
                      source: "NCRP_INTAKE",
                      complaint_id: "NCRP-2026-184721",
                      fraud_type: "INVESTMENT_FRAUD",
                      fraud_amount_inr: 200000,
                      incident_datetime: "2026-09-16T14:32",
                      state: "Chhattisgarh",
                      chain: "ethereum",
                      wallet: activeCase.reported_wallet
                    })
                  }
                >
                  Load Fixture Defaults
                </button>
              </div>
            </form>

            {message && (
              <div style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderRadius: "var(--r-md)",
                background: "rgba(55, 179, 148, 0.1)",
                border: "1px solid var(--accent)",
                color: "var(--accent-2)",
                fontSize: "13px"
              }}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Case Queue Panel */}
        <div>
          <div className="kestrel-panel">
            <div className="kestrel-panel-head">
              <div>
                <h2>Case Queue</h2>
                <p>Select case to switch active workspace</p>
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <input
                className="form-input"
                placeholder="Filter by case ID or wallet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ height: "36px", fontSize: "12.5px" }}
              />
            </div>

            {loading ? (
              <SkeletonLoader text="Loading queue..." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredCases.map((c) => {
                  const isCurrent = c.case_id === activeCase.case_id;
                  return (
                    <button
                      key={c.case_id}
                      onClick={() => {
                        setActiveCase(c);
                        onNavigate("investigations");
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        padding: "14px",
                        borderRadius: "var(--r-md)",
                        background: isCurrent ? "var(--accent-tint)" : "var(--elev-2)",
                        border: `1px solid ${isCurrent ? "var(--accent)" : "var(--line)"}`,
                        color: "var(--text)",
                        textAlign: "left",
                        transition: "all 0.2s var(--ease)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="mono" style={{ fontWeight: 700, color: isCurrent ? "var(--accent-2)" : "var(--text)" }}>
                          {c.case_id}
                        </span>
                        <Badge tone={c.source_badge}>{c.source_badge}</Badge>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "var(--text-3)" }}>
                        <span>{c.fraud_type}</span>
                        <strong style={{ color: "var(--gold)" }}>₹{c.fraud_amount_inr.toLocaleString("en-IN")}</strong>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-3)" }}>
                        <span className="mono">{c.primary_chain}</span>
                        <Badge tone="partial">{c.data_coverage}</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
