import React from "react";
import type { Chain, Transaction } from "../../types";
import { Badge } from "../common/Badge";

interface RapidFlowStripProps {
  rows: Transaction[];
  activeIndex: number;
  onOpen: (txHash: string) => Promise<void>;
  large?: boolean;
}

export function RapidFlowStrip({ rows, activeIndex, onOpen, large = false }: RapidFlowStripProps) {
  const visible = rows.slice(0, large ? 8 : 6);
  const active = rows.length ? rows[activeIndex % rows.length] : null;

  const chains: Chain[] = ["ethereum", "polygon", "tron", "bitcoin"];
  const chainStats = chains.map((chain) => {
    const chainRows = rows.filter((row) => row.chain_id === chain);
    const value = chainRows.reduce((sum, row) => sum + row.value_inr, 0);
    return { chain, count: chainRows.length, value, sample: chainRows[0] };
  });

  const maxChainValue = Math.max(1, ...chainStats.map((c) => c.value));

  return (
    <section className="rapid-flow">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-2)" }}>
            Rapid Transaction Streaming Flow
          </span>
          <h3 style={{ margin: "2px 0 0", fontSize: "15px", color: "var(--text)" }}>
            {active ? (
              <span>
                <strong style={{ color: "var(--accent-2)" }}>{active.chain_id.toUpperCase()}</strong> ·{" "}
                <span className="mono">{short(active.tx_hash)}</span> ·{" "}
                <strong style={{ color: "var(--gold)" }}>₹{active.value_inr.toLocaleString("en-IN")}</strong>
              </span>
            ) : (
              "Waiting for stream replay..."
            )}
          </h3>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="badge neutral">FIXTURE STREAM</span>
          <span className="badge green">
            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", marginRight: 2 }} />
            LIVE REPLAY
          </span>
        </div>
      </div>

      {/* Animated Flow Chips */}
      <div className="flow-lane">
        {visible.map((tx) => {
          const isActive = active?.tx_hash === tx.tx_hash;
          return (
            <button
              key={tx.tx_hash}
              className={`flow-chip ${isActive ? "active" : ""}`}
              onClick={() => onOpen(tx.tx_hash)}
              title={`View ${tx.tx_hash}`}
            >
              <span className="flow-dot" />
              <span className="mono">{short(tx.tx_hash)}</span>
              <strong>{tx.asset}</strong>
              <small style={{ color: "var(--text-3)" }}>hop {tx.hop}</small>
            </button>
          );
        })}
      </div>

      {/* 4-Chain Volume & Intensity Grid */}
      <div className="flow-visual-grid">
        {chainStats.map((item) => (
          <button
            key={item.chain}
            className={`chain-flow ${active?.chain_id === item.chain ? "active" : ""}`}
            onClick={() => item.sample && onOpen(item.sample.tx_hash)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge tone={item.chain}>{item.chain}</Badge>
              <strong style={{ fontSize: "12px", color: "var(--text)" }}>{item.count} txs</strong>
            </div>
            <div className="chain-bar">
              <i style={{ width: `${Math.max(8, (item.value / maxChainValue) * 100)}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-3)" }}>
              <span>₹{item.value.toLocaleString("en-IN")}</span>
              <span style={{ color: "var(--accent-2)" }}>Replaying</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function short(val: string) {
  if (val.length <= 16) return val;
  return `${val.slice(0, 7)}...${val.slice(-5)}`;
}
