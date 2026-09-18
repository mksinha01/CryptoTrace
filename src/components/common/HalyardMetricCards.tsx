import React from "react";

interface HalyardMetricCardsProps {
  onNavigate?: (route: string) => void;
  tracedAmount?: string;
  hopDepth?: number;
  vaspCount?: number;
  alertsCount?: number;
}

export function HalyardMetricCards({
  onNavigate,
  tracedAmount = "₹7,20,500",
  hopDepth = 4,
  vaspCount = 3,
  alertsCount = 18
}: HalyardMetricCardsProps) {
  return (
    <div>
      {/* 4-Column Halyard Signature Metrics Grid */}
      <section className="halyard-metrics-grid" aria-label="Investigation key metrics">
        {/* Card 1: Traced Volume */}
        <article className="halyard-metric-card">
          <div className="halyard-metric-head">
            <span className="halyard-metric-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="9" cy="4.8" rx="5.4" ry="2.1" />
                <path d="M3.6 4.8v8.4c0 1.2 2.4 2.1 5.4 2.1s5.4-.9 5.4-2.1V4.8" />
                <path d="M3.6 9c0 1.2 2.4 2.1 5.4 2.1s5.4-.9 5.4-2.1" />
              </svg>
            </span>
            <h2>Traced Volume</h2>
          </div>
          <p className="halyard-metric-label">Confirmed on-chain movement</p>
          <div className="halyard-metric-value">{tracedAmount}</div>
          <div className="halyard-chart">
            <div className="halyard-bars" role="img" aria-label="Hourly traced volume distribution">
              <span style={{ height: "12%" }} />
              <span style={{ height: "18%" }} />
              <span style={{ height: "10%" }} />
              <span style={{ height: "24%" }} />
              <span style={{ height: "42%" }} />
              <span style={{ height: "35%" }} />
              <span style={{ height: "58%" }} />
              <span style={{ height: "82%" }} />
              <span style={{ height: "94%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "45%" }} />
              <span style={{ height: "22%" }} />
            </div>
            <div className="halyard-axis">
              <span>00:00 UTC</span>
              <span>24:00 UTC</span>
            </div>
          </div>
        </article>

        {/* Card 2: Hop Depth Reached */}
        <article className="halyard-metric-card">
          <div className="halyard-metric-head">
            <span className="halyard-metric-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6.4" cy="11.6" r="3.1" />
                <path d="M8.6 9.4L14.6 3.4" />
                <path d="M11 7l2 2" />
                <path d="M12.8 5.2l2 2" />
              </svg>
            </span>
            <h2>Graph Depth</h2>
          </div>
          <p className="halyard-metric-label">Hop traversal reached</p>
          <div className="halyard-metric-value">{hopDepth} Hops</div>
          <div className="halyard-chart">
            <div className="halyard-bars" role="img" aria-label="Hop depth distribution">
              <span style={{ height: "90%" }} />
              <span style={{ height: "75%" }} />
              <span style={{ height: "60%" }} />
              <span style={{ height: "40%" }} />
              <span style={{ height: "15%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
            </div>
            <div className="halyard-axis">
              <span>H0 Root</span>
              <span>H5 Boundary</span>
            </div>
          </div>
        </article>

        {/* Card 3: Identified VASPs */}
        <article className="halyard-metric-card">
          <div className="halyard-metric-head">
            <span className="halyard-metric-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3.6" width="12" height="3.4" rx="1.2" />
                <path d="M4.2 7v6.4c0 .7.6 1.2 1.2 1.2h7.2c.6 0 1.2-.5 1.2-1.2V7" />
                <path d="M7.4 10.2h3.2" />
              </svg>
            </span>
            <h2>VASP Targets</h2>
          </div>
          <p className="halyard-metric-label">Attributed candidate clusters</p>
          <div className="halyard-metric-value">{vaspCount} Clusters</div>
          <div className="halyard-chart">
            <div className="halyard-bars" role="img" aria-label="VASP cluster activity">
              <span style={{ height: "30%" }} />
              <span style={{ height: "48%" }} />
              <span style={{ height: "72%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "85%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "40%" }} />
              <span style={{ height: "20%" }} />
              <span style={{ height: "15%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
              <span style={{ height: "0%" }} />
            </div>
            <div className="halyard-axis">
              <span>Deposit</span>
              <span>Internal Hot</span>
            </div>
          </div>
        </article>

        {/* Card 4: Critical Alerts */}
        <article className="halyard-metric-card">
          <div className="halyard-metric-head">
            <span className="halyard-metric-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.8 2.4L4.6 9.8h3.9l-.9 5.8 5.8-7.6H9.2Z" />
              </svg>
            </span>
            <h2>Risk Signals</h2>
          </div>
          <p className="halyard-metric-label">Real-time alerts flagged</p>
          <div className="halyard-metric-value">{alertsCount} Flags</div>
          <div className="halyard-chart">
            <div className="halyard-bars" role="img" aria-label="Alert velocity">
              <span style={{ height: "10%" }} />
              <span style={{ height: "15%" }} />
              <span style={{ height: "30%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "80%" }} />
              <span style={{ height: "70%" }} />
              <span style={{ height: "85%" }} />
              <span style={{ height: "90%" }} />
              <span style={{ height: "60%" }} />
              <span style={{ height: "40%" }} />
              <span style={{ height: "25%" }} />
              <span style={{ height: "15%" }} />
            </div>
            <div className="halyard-axis">
              <span>Low</span>
              <span>Critical</span>
            </div>
          </div>
        </article>
      </section>

      {/* Forensic Module Launchers matching Halyard Client Libraries */}
      <h2 className="halyard-modules-head">Forensic Modules</h2>
      <section className="halyard-modules-grid" aria-label="Forensic investigation modules">
        {/* Module 1 */}
        <div className="halyard-module-card">
          <div className="halyard-module-top">
            <span className="halyard-mark m1" aria-hidden="true">FA</span>
            <span className="halyard-module-name">Fund-Flow Atlas</span>
            <span className="halyard-tag">Radial</span>
          </div>
          <p className="halyard-module-desc">Radial hop network visualization tracing multi-chain asset movements.</p>
          <div className="halyard-module-actions">
            {onNavigate && (
              <button type="button" className="halyard-ghost" onClick={() => onNavigate("investigations")}>
                Launch Atlas →
              </button>
            )}
          </div>
        </div>

        {/* Module 2 */}
        <div className="halyard-module-card">
          <div className="halyard-module-top">
            <span className="halyard-mark m2" aria-hidden="true">MN</span>
            <span className="halyard-module-name">Mule Typologies</span>
            <span className="halyard-tag">India Spec</span>
          </div>
          <p className="halyard-module-desc">Rapid fund dissipation detection across UPI and off-ramp banking layers.</p>
          <div className="halyard-module-actions">
            {onNavigate && (
              <button type="button" className="halyard-ghost" onClick={() => onNavigate("typologies")}>
                View Typology →
              </button>
            )}
          </div>
        </div>

        {/* Module 3 */}
        <div className="halyard-module-card">
          <div className="halyard-module-top">
            <span className="halyard-mark m3" aria-hidden="true">VS</span>
            <span className="halyard-module-name">VASP Intelligence</span>
            <span className="halyard-tag">Adaptive</span>
          </div>
          <p className="halyard-module-desc">Normalized Bayesian entity clustering for exchange attribution.</p>
          <div className="halyard-module-actions">
            {onNavigate && (
              <button type="button" className="halyard-ghost" onClick={() => onNavigate("vasp")}>
                Attribution Trace →
              </button>
            )}
          </div>
        </div>

        {/* Module 4 */}
        <div className="halyard-module-card">
          <div className="halyard-module-top">
            <span className="halyard-mark m4" aria-hidden="true">XB</span>
            <span className="halyard-module-name">Cross-Chain Bridge</span>
            <span className="halyard-tag">Multi-Chain</span>
          </div>
          <p className="halyard-module-desc">Lock-and-mint bridge correlations across ETH, Polygon, Tron, and BTC.</p>
          <div className="halyard-module-actions">
            {onNavigate && (
              <button type="button" className="halyard-ghost" onClick={() => onNavigate("cross-chain")}>
                Inspect Bridges →
              </button>
            )}
          </div>
        </div>

        {/* Module 5 */}
        <div className="halyard-module-card">
          <div className="halyard-module-top">
            <span className="halyard-mark m5" aria-hidden="true">EV</span>
            <span className="halyard-module-name">Evidence Vault</span>
            <span className="halyard-tag">SHA-256</span>
          </div>
          <p className="halyard-module-desc">Cryptographically sealed chain of custody for Section 65B compliance.</p>
          <div className="halyard-module-actions">
            {onNavigate && (
              <button type="button" className="halyard-ghost" onClick={() => onNavigate("evidence")}>
                Open Vault →
              </button>
            )}
          </div>
        </div>

        {/* Module 6 */}
        <div className="halyard-module-card">
          <div className="halyard-module-top">
            <span className="halyard-mark m6" aria-hidden="true">CR</span>
            <span className="halyard-module-name">Sec 91 CrPC</span>
            <span className="halyard-tag">Supervisor</span>
          </div>
          <p className="halyard-module-desc">Formal legal notice generation and supervisor sign-off preservation.</p>
          <div className="halyard-module-actions">
            {onNavigate && (
              <button type="button" className="halyard-ghost" onClick={() => onNavigate("supervisor")}>
                Preservation →
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
