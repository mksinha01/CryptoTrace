import React, { useState, useEffect } from "react";
import type { Case, Role } from "./types";
import { mockApi } from "./services/mockApi";
import { App as ClassicApp } from "./App.old";

// Themes & Layouts
import "./theme/kestrel.css";
import "./theme/halyard.css";
import { Sidebar, type Route } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { HalyardRailNav } from "./components/layout/HalyardRailNav";
import { HalyardTopbar } from "./components/layout/HalyardTopbar";
import { DrawerPanel, type DrawerState } from "./components/layout/DrawerPanel";
import { SkeletonLoader } from "./components/common/StateFeedback";

// Views
import { OverviewView } from "./views/OverviewView";
import { CasesView } from "./views/CasesView";
import { InvestigationView } from "./views/InvestigationView";
import { TransactionsView } from "./views/TransactionsView";
import { WalletsView } from "./views/WalletsView";
import { TypologiesView } from "./views/TypologiesView";
import { VaspView } from "./views/VaspView";
import { CrossChainView } from "./views/CrossChainView";
import { EvidenceView } from "./views/EvidenceView";
import { ReportsView } from "./views/ReportsView";
import { SupervisorView } from "./views/SupervisorView";
import { AlertsView } from "./views/AlertsView";
import { SystemStatusView } from "./views/SystemStatusView";

export function App() {
  const [uiMode, setUiMode] = useState<"halyard" | "kestrel" | "classic">("halyard");
  const [route, setRoute] = useState<Route>("overview");
  const [role, setRole] = useState<Role>("INVESTIGATOR");
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [auditRefresh, setAuditRefresh] = useState(0);

  // Initialize active case from fixture API
  useEffect(() => {
    let active = true;
    mockApi.getCase().then((res) => {
      if (active && res.success && res.data) {
        setActiveCase(res.data);
      }
    });
    return () => { active = false; };
  }, []);

  const openTransaction = async (txHash: string) => {
    const response = await mockApi.getTransaction(txHash);
    setDrawer({ kind: "tx", tx: response.data });
  };

  // Rollback / Classic UI toggle support
  if (uiMode === "classic") {
    return (
      <div>
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 9999,
          background: "#181A1E",
          borderBottom: "2px solid #37B394",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#F2F3F4",
          fontSize: "13px"
        }}>
          <div>
            <strong style={{ color: "#6FD7BC" }}>Classic Frontend Fallback Mode Active</strong>
            <span style={{ marginLeft: "10px", color: "#A6ABB2" }}>
              Old UI is running 100% untouched for regression comparison
            </span>
          </div>
          <button
            onClick={() => setUiMode("kestrel")}
            style={{
              padding: "6px 16px",
              borderRadius: "999px",
              background: "linear-gradient(95deg, #1C8A72, #37B394)",
              color: "#04160F",
              fontWeight: 700,
              border: 0,
              cursor: "pointer"
            }}
          >
            ← Switch to New Kestrel UI
          </button>
        </div>
        <ClassicApp />
      </div>
    );
  }

  // Active View Router
  const renderView = () => {
    if (!activeCase) return <SkeletonLoader text="Loading active case workspace..." />;

    switch (route) {
      case "overview":
        return (
          <OverviewView
            activeCase={activeCase}
            onNavigate={(r) => setRoute(r as Route)}
            openTransaction={openTransaction}
          />
        );
      case "cases":
        return (
          <CasesView
            activeCase={activeCase}
            setActiveCase={setActiveCase}
            onNavigate={(r) => setRoute(r as Route)}
          />
        );
      case "investigations":
        return (
          <InvestigationView
            activeCase={activeCase}
            setDrawer={setDrawer}
            openTransaction={openTransaction}
          />
        );
      case "transactions":
        return <TransactionsView openTransaction={openTransaction} />;
      case "wallets":
        return (
          <WalletsView
            activeCase={activeCase}
            openTransaction={openTransaction}
          />
        );
      case "typologies":
        return (
          <TypologiesView
            setDrawer={setDrawer}
            openTransaction={openTransaction}
          />
        );
      case "vasp":
        return <VaspView setDrawer={setDrawer} />;
      case "cross-chain":
        return <CrossChainView />;
      case "evidence":
        return <EvidenceView setDrawer={setDrawer} />;
      case "reports":
        return <ReportsView />;
      case "supervisor":
        return (
          <SupervisorView
            role={role}
            auditRefresh={auditRefresh}
            setAuditRefresh={setAuditRefresh}
          />
        );
      case "alerts":
        return (
          <AlertsView
            onNavigate={(r) => setRoute(r as Route)}
            openTransaction={openTransaction}
          />
        );
      case "system":
        return <SystemStatusView />;
      default:
        return (
          <OverviewView
            activeCase={activeCase}
            onNavigate={(r) => setRoute(r as Route)}
            openTransaction={openTransaction}
          />
        );
    }
  };

  return (
    <div className="kestrel-app">
      {/* Kestrel Signature Sidebar */}
      <Sidebar
        currentRoute={route}
        onNavigate={setRoute}
        openAlertsCount={18}
        onQuickAction={(action) => {
          if (action === "intake") setRoute("cases");
          else if (action === "trace") setRoute("investigations");
          else if (action === "supervisor") setRoute("supervisor");
        }}
      />

      {/* Main Container */}
      <main className="kestrel-main">
        {/* Kestrel Signature Topbar */}
        <Topbar
          activeCase={activeCase}
          role={role}
          onRoleToggle={() => setRole(role === "INVESTIGATOR" ? "SUPERVISOR" : "INVESTIGATOR")}
          uiMode={uiMode}
          onToggleUiMode={() => setUiMode("classic")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={() => setAuditRefresh((prev) => prev + 1)}
          onOpenAlerts={() => setRoute("alerts")}
        />

        {/* Global Forensic Telemetry & Compliance Banner */}
        <div className="forensic-telemetry-banner">
          <div className="indicator-pulse">
            Synthetic Replay Environment
          </div>
          <span>
            Forensic intelligence generated from deterministic testnet fixtures. No live RPC executions or automated fund freezing.
          </span>
        </div>

        {/* Primary View Area */}
        <div className="kestrel-content">
          {renderView()}
        </div>
      </main>

      {/* Slide-over Inspection Drawer */}
      <DrawerPanel
        drawer={drawer}
        onClose={() => setDrawer(null)}
        openTransaction={openTransaction}
      />
    </div>
  );
}
