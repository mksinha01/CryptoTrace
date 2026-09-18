import React from "react";
import type { Case, Role } from "../../types";

interface TopbarProps {
  activeCase: Case | null;
  role: Role;
  onRoleToggle: () => void;
  uiMode: "halyard" | "kestrel" | "classic";
  onToggleUiMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
  onOpenAlerts?: () => void;
  onSetUiMode?: (mode: "halyard" | "kestrel" | "classic") => void;
}

export function Topbar({
  activeCase,
  role,
  onRoleToggle,
  uiMode,
  onToggleUiMode,
  searchQuery,
  onSearchChange,
  onRefresh,
  onOpenAlerts,
  onSetUiMode
}: TopbarProps) {
  return (
    <header className="kestrel-topbar">
      <div className="topbar-left">
        <div className="topbar-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search suspect wallet, tx hash, VASP, or evidence ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Universal forensic search"
          />
        </div>
      </div>

      <div className="topbar-actions">
        {/* Compliance & safe fixture telemetry capsule */}
        <div className="env-status-capsule" title="Operating in safe synthetic fixture replay mode">
          <span className="pulse-dot" />
          <span>REPLAY · DEMO</span>
        </div>

        {/* Active case badge */}
        {activeCase && (
          <div className="case-selector-pill" title={`Active Case: ${activeCase.case_id}`}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-2)" }} />
            <span className="mono">{activeCase.case_id}</span>
          </div>
        )}

        {/* Role toggle button */}
        <button
          className={`role-pill-btn ${role === "SUPERVISOR" ? "supervisor" : ""}`}
          onClick={onRoleToggle}
          title="Toggle user authorization role between Investigator and Supervisor"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Role: {role}</span>
        </button>

        {/* 3-Way Theme Switcher */}
        {onSetUiMode ? (
          <div className="halyard-theme-switch" style={{ display: "inline-flex", gap: "3px", padding: "2px", borderRadius: "999px", background: "var(--elev-2)", border: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={() => onSetUiMode("halyard")}
              style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 600, borderRadius: "999px", color: uiMode === "halyard" ? "#04160F" : "var(--text-3)", background: uiMode === "halyard" ? "var(--accent)" : "transparent" }}
            >
              Halyard
            </button>
            <button
              type="button"
              onClick={() => onSetUiMode("kestrel")}
              style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 600, borderRadius: "999px", color: uiMode === "kestrel" ? "#04160F" : "var(--text-3)", background: uiMode === "kestrel" ? "var(--accent)" : "transparent" }}
            >
              Kestrel
            </button>
            <button
              type="button"
              onClick={() => onSetUiMode("classic")}
              style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 600, borderRadius: "999px", color: uiMode === "classic" ? "#04160F" : "var(--text-3)", background: uiMode === "classic" ? "var(--accent)" : "transparent" }}
            >
              Classic
            </button>
          </div>
        ) : (
          <button
            className="classic-switch-btn"
            onClick={onToggleUiMode}
            title="Toggle between UI modes"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 4V9H9M20 20V15H15M4.93 19.07A10 10 0 0 0 20 12A10 10 0 0 0 4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{uiMode === "kestrel" ? "Classic UI" : "Kestrel UI"}</span>
          </button>
        )}

        {/* Round actions */}
        <button
          className="roundbtn has-badge"
          aria-label="Open Alerts"
          title="Triage Open Alerts"
          onClick={onOpenAlerts}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {onRefresh && (
          <button
            className="roundbtn"
            aria-label="Refresh intelligence"
            title="Replay / refresh fixture data"
            onClick={onRefresh}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21.5 2V8H15.5M2.5 22V16H8.5M20.5 15.5C19.5 18.5 17 21 13.5 21.8C9.5 22.7 5.5 20.7 3.5 17.5M3.5 8.5C4.5 5.5 7 3 10.5 2.2C14.5 1.3 18.5 3.3 20.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
