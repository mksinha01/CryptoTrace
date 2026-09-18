import React, { useState, useEffect } from "react";
import type { CryptoAlert } from "../types";
import { mockApi } from "../services/mockApi";
import { Badge } from "../components/common/Badge";
import { SkeletonLoader, ErrorNotice } from "../components/common/StateFeedback";

interface AlertsViewProps {
  onNavigate: (route: string) => void;
  openTransaction: (txHash: string) => Promise<void>;
}

export function AlertsView({ onNavigate, openTransaction }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    mockApi.getAlerts()
      .then((res) => {
        if (!active) return;
        setAlerts(res.data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load alerts.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  const filtered = alerts.filter((a) =>
    severityFilter === "ALL" ? true : a.severity === severityFilter
  );

  if (loading) return <SkeletonLoader text="Scanning onchain alert events..." />;
  if (error) return <ErrorNotice message={error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="sec-head">
        <div>
          <h2>Real-Time Alert Triage</h2>
          <p>Automated typology detections and rapid fund movement flags requiring investigator attention</p>
        </div>
        <Badge tone="red">{alerts.filter(a => a.severity === "HIGH").length} Critical Alerts</Badge>
      </div>

      <div className="kestrel-panel">
        <div className="kestrel-panel-head">
          <div>
            <h2>Alert Register</h2>
            <p>Click any alert to navigate to active investigation context</p>
          </div>
          <div className="segmented">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                type="button"
                className={severityFilter === sev ? "selected" : ""}
                onClick={() => setSeverityFilter(sev)}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <div className="table-head grid-alert">
            <span>Severity</span>
            <span>Alert Type</span>
            <span>Linked Case</span>
            <span>Target Wallet</span>
            <span>Status</span>
          </div>
          {filtered.map((alert) => (
            <button
              key={alert.alert_id}
              className="table-row grid-alert"
              onClick={() => onNavigate("investigations")}
            >
              <Badge tone={alert.severity === "HIGH" ? "red" : alert.severity === "MEDIUM" ? "amber" : "neutral"}>
                {alert.severity}
              </Badge>
              <strong style={{ fontSize: "13px", color: "var(--text)" }}>{alert.type.replace(/_/g, " ")}</strong>
              <span className="mono" style={{ fontSize: "12px", color: "var(--text-3)" }}>{alert.case_id}</span>
              <span className="mono" style={{ fontSize: "12px", color: "var(--accent-2)" }}>{alert.wallet}</span>
              <span className={`status-indicator ${alert.status === "OPEN" ? "open" : "acknowledged"}`}>
                {alert.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
