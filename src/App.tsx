import React, { useState, useEffect } from "react";
import type { Case, Role } from "./types";
import { mockApi } from "./services/mockApi";
import { App as ClassicApp } from "./App.old";

import "./theme/kestrel.css";
import { Sidebar, type Route } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { DrawerPanel, type DrawerState } from "./components/layout/DrawerPanel";
import { SkeletonLoader } from "./components/common/StateFeedback";

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

type UiMode = "kestrel" | "classic";

export function App() {
  const [uiMode, setUiMode] = useState<UiMode>("kestrel");
  const [route, setRoute] = useState<Route>("overview");
  const [role, setRole] = useState<Role>("INVESTIGATOR");
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [auditRefresh, setAuditRefresh] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  if (uiMode === "classic") {
    return (
      <div className="classic-ui">
        <div className="classic-mode-banner">
          <div>
            <strong>Classic Frontend Fallback Mode Active</strong>
            <span>Old UI is running untouched for regression comparison</span>
          </div>
          <button onClick={() => setUiMode("kestrel")}>← Return to Kestrel UI</button>
        </div>
        <ClassicApp />
      </div>
    );
  }

  const renderView = () => {
    if (!activeCase) return <SkeletonLoader text="Loading active case workspace..." />;

    switch (route) {
      case "overview":
        return (
          <OverviewView
            activeCase={activeCase}
            onNavigate={(r) => setRoute(r as Route)}
            openTransaction={openTransaction}
            uiMode="kestrel"
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
        return <WalletsView activeCase={activeCase} openTransaction={openTransaction} />;
      case "typologies":
        return <TypologiesView setDrawer={setDrawer} openTransaction={openTransaction} />;
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
        return <AlertsView onNavigate={(r) => setRoute(r as Route)} openTransaction={openTransaction} />;
      case "system":
        return <SystemStatusView />;
      default:
        return (
          <OverviewView
            activeCase={activeCase}
            onNavigate={(r) => setRoute(r as Route)}
            openTransaction={openTransaction}
            uiMode="kestrel"
          />
        );
    }
  };

  return (
    <div className="kestrel-app">
      <Sidebar
        currentRoute={route}
        onNavigate={setRoute}
        openAlertsCount={18}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onQuickAction={(action) => {
          if (action === "intake") setRoute("cases");
          else if (action === "trace") setRoute("investigations");
          else if (action === "supervisor") setRoute("supervisor");
        }}
      />

      <main className="kestrel-main">
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
          onOpenNavigation={() => setMobileNavOpen(true)}
        />

        <div className="forensic-telemetry-banner">
          <div className="indicator-pulse">Synthetic Replay Environment</div>
          <span>Forensic intelligence generated from deterministic testnet fixtures. No live RPC executions or automated fund freezing.</span>
        </div>

        <div className="kestrel-content">{renderView()}</div>
      </main>

      <DrawerPanel
        drawer={drawer}
        onClose={() => setDrawer(null)}
        openTransaction={openTransaction}
      />
    </div>
  );
}
