import React, { useState, useEffect } from "react";
import type { Chain, Transaction } from "../types";
import { mockApi } from "../services/mockApi";
import { Badge } from "../components/common/Badge";
import { RapidFlowStrip } from "../components/graph/RapidFlowStrip";
import { SkeletonLoader, ErrorNotice } from "../components/common/StateFeedback";

interface TransactionsViewProps {
  openTransaction: (txHash: string) => Promise<void>;
}

export function TransactionsView({ openTransaction }: TransactionsViewProps) {
  const [chain, setChain] = useState<Chain | "all">("all");
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    "FETCH",
    "VALIDATE",
    "EXTRACT",
    "NORMALIZE",
    "DEDUPLICATE",
    "PERSIST",
    "COMMIT",
    "ADVANCE"
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);
    mockApi.getTransactions({ chain, query })
      .then((res) => {
        if (!active) return;
        setTransactions(res.data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load transaction feed.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [chain, query]);

  useEffect(() => {
    if (paused || !transactions.length) return;
    const timer = window.setInterval(() => {
      setStage((curr) => (curr + 1) % stages.length);
      setActiveIndex((curr) => (curr + 1) % transactions.length);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [paused, transactions.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="sec-head">
        <div>
          <h2>Rapid Transaction Intelligence</h2>
          <p>Multi-chain normalized ingestion stream with 8-stage verification pipeline</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="badge neutral">SYNTHETIC STREAM</span>
          <Badge tone="green">NORMALIZED FEED</Badge>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        flexWrap: "wrap",
        padding: "16px 20px",
        borderRadius: "var(--r-lg)",
        background: "var(--elev-1)",
        border: "1px solid var(--line)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flex: 1 }}>
          <select
            className="form-select"
            value={chain}
            onChange={(e) => setChain(e.target.value as Chain | "all")}
            style={{ width: "160px", height: "40px" }}
          >
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="tron">Tron</option>
            <option value="bitcoin">Bitcoin</option>
          </select>

          <input
            className="form-input"
            placeholder="Filter by hash, address, or provider RPC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: "360px", height: "40px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className={paused ? "btn-primary" : "btn-secondary"}
            style={{ height: "40px", fontSize: "13px" }}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume Stream Replay" : "Pause Stream Replay"}
          </button>
        </div>
      </div>

      {/* 8-Stage Simulated Pipeline */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
            8-Stage Normalization Pipeline
          </span>
          <span className="mono" style={{ fontSize: "11px", color: "var(--accent-2)" }}>
            Current Stage: {stages[stage]}
          </span>
        </div>
        <div className="stream-pipeline">
          {stages.map((st, idx) => {
            const isDone = idx < stage;
            const isActive = idx === stage && !paused;
            return (
              <div
                key={st}
                className={`pipeline-stage ${isActive ? "active" : isDone ? "done" : ""}`}
              >
                {st}
              </div>
            );
          })}
        </div>
      </div>

      {/* Large Rapid Flow Strip */}
      <RapidFlowStrip
        rows={transactions}
        activeIndex={activeIndex}
        onOpen={openTransaction}
        large
      />

      {/* Full Transaction Table */}
      <div className="kestrel-panel">
        <div className="kestrel-panel-head">
          <div>
            <h2>Replayed Transaction Ledger</h2>
            <p>Showing {transactions.length} normalized transactions · Click any row to inspect full provenance</p>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader text="Loading transaction stream..." />
        ) : error ? (
          <ErrorNotice message={error} />
        ) : (
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
            {transactions.map((tx) => {
              const isActive = transactions[activeIndex]?.tx_hash === tx.tx_hash;
              return (
                <button
                  key={tx.tx_hash}
                  className={`table-row grid-tx ${isActive ? "active-stream-row" : ""}`}
                  onClick={() => openTransaction(tx.tx_hash)}
                >
                  <span style={{ color: "var(--text-3)" }}>{tx.timestamp.replace("T", " ").slice(11, 19)}</span>
                  <Badge tone={tx.chain_id}>{tx.chain_id}</Badge>
                  <span className="mono" style={{ color: "var(--accent-2)" }}>{tx.tx_hash.slice(0, 10)}...</span>
                  <span className="mono" style={{ fontSize: "12px", color: "var(--text-2)" }}>
                    {tx.from_address} → {tx.to_address}
                  </span>
                  <span>{tx.amount_native} {tx.asset}</span>
                  <strong style={{ color: "var(--gold)" }}>₹{tx.value_inr.toLocaleString("en-IN")}</strong>
                  <Badge tone="green">{tx.finality}</Badge>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
