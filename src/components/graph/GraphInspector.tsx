import React from "react";
import type { GraphEdge, GraphNode, Transaction } from "../../types";
import { Badge } from "../common/Badge";

interface GraphInspectorProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId?: string;
  activeEdgeId?: string;
  onNode: (node: GraphNode) => void;
  onEdge: (edge: GraphEdge) => void;
}

export function GraphInspector({
  nodes,
  edges,
  selectedId,
  activeEdgeId,
  onNode,
  onEdge
}: GraphInspectorProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginTop: "16px",
      padding: "16px",
      borderRadius: "var(--r-md)",
      background: "var(--elev-2)",
      border: "1px solid var(--line)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ fontSize: "14px", color: "var(--text)" }}>Fund-Flow Quick Inspector</strong>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-3)" }}>
            Select individual entity nodes or transfer edges to open forensic dossier
          </p>
        </div>
        <Badge tone="green">{nodes.length} Nodes · {edges.length} Edges</Badge>
      </div>

      {/* Nodes Quick Bar */}
      <div>
        <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", marginBottom: "8px" }}>
          Key Entity Nodes
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
          {nodes.slice(0, 8).map((node) => (
            <button
              key={node.id}
              onClick={() => onNode(node)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "8px 10px",
                borderRadius: "var(--r-sm)",
                background: selectedId === node.id ? "var(--accent-tint)" : "var(--elev-1)",
                border: `1px solid ${selectedId === node.id ? "var(--accent)" : "var(--line)"}`,
                color: selectedId === node.id ? "var(--accent-2)" : "var(--text)",
                textAlign: "left"
              }}
            >
              <strong style={{ fontSize: "12.5px" }}>{node.label}</strong>
              <small className="mono" style={{ fontSize: "10px", color: "var(--text-3)" }}>{node.id} · {node.chain}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Edges List */}
      <div>
        <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", marginBottom: "8px" }}>
          Transfers & Heuristic Leads
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "8px", maxHeight: "160px", overflowY: "auto" }}>
          {edges.map((edge) => {
            const isSelected = selectedId === edge.id || activeEdgeId === edge.id;
            return (
              <button
                key={edge.id}
                onClick={() => onEdge(edge)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: "var(--r-sm)",
                  background: isSelected ? "var(--accent-tint)" : "var(--elev-1)",
                  border: `1px solid ${isSelected ? "var(--accent)" : "var(--line)"}`,
                  color: isSelected ? "var(--accent-2)" : "var(--text)",
                  fontSize: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Badge tone={edge.style === "DASHED" ? "heuristic" : "blue"}>
                    {edge.style === "DASHED" ? "LEAD" : `H${edge.hop}`}
                  </Badge>
                  <span className="mono">{edge.source} → {edge.target}</span>
                </div>
                <strong style={{ color: "var(--gold)" }}>₹{Math.round(edge.value_inr / 1000)}k</strong>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
