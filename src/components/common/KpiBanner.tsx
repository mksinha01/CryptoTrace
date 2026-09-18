import React from "react";
import type { RecoveryEstimate, RiskAssessment } from "../../types";

interface KpiBannerProps {
  reportedWallet: string;
  caseId: string;
  recovery: RecoveryEstimate | null;
  risk: RiskAssessment | null;
  attributionBand?: string;
  traceCoverage?: string;
}

export function KpiBanner({
  reportedWallet,
  caseId,
  recovery,
  risk,
  attributionBand = "HIGH",
  traceCoverage = "PARTIAL"
}: KpiBannerProps) {
  const recoveryValue = recovery?.eligible
    ? `${Math.round(recovery.recovery_score * 100)}%`
    : "N/A";
  const recoveryWindow = recovery?.eligible ? `${recovery.action_window_hours}h window` : "Low attribution";

  const riskValue = risk ? `${risk.risk_tier} ${risk.risk_score}` : "HIGH 78";

  return (
    <section className="points">
      <div className="points-inner">
        <div className="who">
          <span className="pfp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 10H20V15H16C14.8954 15 14 14.1046 14 13C14 11.8954 14.8954 11 16 11V10Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17" cy="13" r="1" fill="currentColor" />
            </svg>
          </span>
          <div className="handle-wrap">
            <span className="handle mono">{reportedWallet.slice(0, 14)}...{reportedWallet.slice(-6)}</span>
            <span className="subhandle">{caseId} · Lead Suspect Target</span>
          </div>
        </div>

        {/* Recovery Estimate Chip */}
        <div className="chip c-recovery">
          <span className="lbl">Recovery Estimate</span>
          <span className="val" style={{ color: "var(--ember)" }}>{recoveryValue}</span>
          <span className="subval">{recoveryWindow}</span>
        </div>

        {/* VASP Attribution Band Chip */}
        <div className="chip c-attribution">
          <span className="lbl">Attribution Band</span>
          <span className="val" style={{ color: "var(--accent-2)" }}>{attributionBand}</span>
          <span className="subval">VASP Heuristic Band</span>
        </div>

        {/* Risk Tier Chip */}
        <div className="chip c-risk">
          <span className="lbl">Risk Assessment</span>
          <span className="val" style={{ color: "var(--red)" }}>{riskValue}</span>
          <span className="subval">High Risk Typology</span>
        </div>

        {/* Trace Coverage Chip */}
        <div className="chip c-coverage">
          <span className="lbl">Trace Coverage</span>
          <span className="val" style={{ color: "var(--blue)" }}>{traceCoverage}</span>
          <span className="subval">Deterministic Scope</span>
        </div>
      </div>
    </section>
  );
}
