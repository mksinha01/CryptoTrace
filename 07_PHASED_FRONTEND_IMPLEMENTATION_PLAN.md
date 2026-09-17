# CryptoTrace LEA — Phased Frontend Implementation Plan

**Project:** SIH 26183 — Real-Time Crypto Fraud Attribution System for Indian Law Enforcement  
**Scope:** Frontend-only demo implementation using fixture/mock data  
**Primary Objective:** Build a functional investigator-facing frontend that visibly demonstrates the required CryptoTrace LEA capabilities without requiring the production blockchain/backend stack.

## 1. Governing Implementation Rule

The six supplied project files are the implementation package:

1. `01_FRONTEND_DEMO_PRD.docx` — primary frontend scope and requirements.
2. `02_PRODUCTION_PRD.md` — product source of truth for domain concepts, terminology, constraints and behavior.
3. `03_MOCK_API_CONTRACT.md` — interface contract between frontend and simulated backend services.
4. `04_DEMO_FIXTURE.json` — deterministic demo dataset used by the mock services.
5. `05_UI_DESIGN_SPEC.md` — visual, interaction and information-hierarchy rules.
6. `06_IMPLEMENTATION_PLAN.md` — broader production architecture and implementation reference.

The frontend implementation must preserve the production terminology and domain model while treating the mock API and fixture as the active runtime source for the demo. The production documents explicitly require a distinction between live data and fixture/demo data and state that synthetic fixtures must not be presented as real intelligence. 

## 2. Scope Boundary

### Build now

- Investigator dashboard/workstation
- Case intake and case queue
- Wallet investigation
- Rapid transaction intelligence UI
- Transaction explorer and detail drawer
- Bounded trace configuration/results
- Interactive fund-flow graph
- Typology findings
- MULE_NETWORK
- VASP intelligence
- AdaptiveVASPScorer visualization
- Cross-chain intelligence
- Risk and attribution views
- Heuristic Recovery Estimate
- Alerts
- Recommendations
- Evidence manifest
- Investigation report view/export
- Supervisor preservation-request workflow
- Audit timeline
- System/integration status simulation
- Mock service layer and deterministic fixture replay

### Do not build for this submission

- Production PostgreSQL implementation
- Redis implementation
- Memgraph/Neo4j implementation
- Real Ethereum/Polygon/Tron/Bitcoin provider integration
- Production NCRP or SAHYOG connectivity
- Production VASP integrations
- Production authentication/RBAC backend
- ML/GNN deployment
- Automatic legal action or fund freezing

The production plan places live connectivity, external authorization boundaries and future ML behind separate phases/gates; future ML is explicitly outside the SIH submission scope.

## 3. Phase-Gated Execution

### Phase 1 — Foundation and Application Shell

**Goal:** Establish a runnable frontend with the correct architecture before implementing feature screens.

#### Implement

- Next.js/React application structure.
- Global layout and navigation.
- Shared design tokens/components.
- Routes for all planned modules.
- Domain TypeScript types based on the production canonical entities.
- Mock service interface.
- Fixture loader.
- Global application state for selected case, execution mode and current investigation.
- `FIXTURE REPLAY` / `DEMO DATA` state handling.

#### Required domain types

- Chain
- Address
- Transaction
- Transfer
- Asset
- EntityLabel
- PatternFinding
- VASPCluster
- CrossChainLink
- RiskAssessment
- InvestigativeRecommendation
- EvidenceManifest
- Case
- AuditEvent
- CryptoAlert

#### Checkpoint before Phase 2

- Application starts without runtime errors.
- All major routes load.
- Navigation works.
- Fixture loads successfully.
- Mock service functions return typed data.
- Demo mode is visible globally.
- No component contains production backend assumptions.
- Production terminology matches the supplied PRD.

**Gate:** `PASS` only after the application shell and fixture layer are stable.

---

### Phase 2 — Case Intake, Case Queue and Rapid Transaction Intelligence

**Goal:** Demonstrate that a reported wallet can enter the system and quickly expose blockchain activity.

#### Implement

1. Case intake for:
   - NCRP
   - SAHYOG
   - Manual Entry

2. Case queue showing:
   - Case ID
   - Source
   - Chain
   - Reported amount
   - Status
   - Priority/alert state

3. Rapid transaction intelligence:
   - latest transaction feed
   - chain selector
   - transaction counts
   - last update time
   - transaction hash
   - from/to
   - asset
   - value
   - timestamp
   - block
   - finality
   - provider/provenance

4. Transaction detail drawer.

5. Simulated fetch state:
   - requesting
   - fetched
   - normalized
   - error
   - partial data

The production requirements call for multi-chain handling across EVM, Bitcoin and Tron/TRC-20, continuous indexing concepts, provenance, deduplication, checkpointing, finality and explicit LIVE/FIXTURE execution mode. The frontend should represent these concepts as states and indicators even when their values come from fixtures.

#### Checkpoint before Phase 3

Verify that a user can:

1. create/open a demo case;
2. select a wallet;
3. see rapid transaction information;
4. open any transaction;
5. inspect chain, asset, amount, timestamp, block, finality and provenance;
6. see the fixture state clearly.

**Gate:** `PASS` only when the intake-to-transaction path is fully usable.

---

### Phase 3 — Wallet Investigation, Bounded Trace and Fund-Flow Graph

**Goal:** Turn transaction history into an actual investigation workspace.

#### Implement

- Wallet profile.
- Wallet statistics.
- Transaction history.
- Counterparties.
- Trace configuration:
  - maximum hops
  - time window
  - minimum value
  - maximum outflows
  - maximum nodes
  - timeout
- Trace execution simulation.
- Trace result summary.
- Interactive graph.
- Node expansion.
- Edge transaction details.
- Hop-depth filtering.
- Timeline playback/filtering.

The PRD defines bounded tracing with configurable computational limits and requires the applied limits to be exposed to the investigator.

#### Graph semantics

- Solid edge = confirmed/on-chain relationship.
- Dashed edge = heuristic mixer-boundary relationship.
- Reported wallet = visually distinct root.
- Intermediary wallet = distinct node type.
- Aggregation wallet = distinct node type.
- VASP = entity/VASP node.
- Bridge/DEX/Mixer = protocol/boundary node.

#### Checkpoint before Phase 4

Verify:

- Trace controls actually change the displayed trace parameters.
- Trace result updates from fixture state.
- Graph nodes correspond to fixture wallets.
- Graph edges correspond to fixture transfers.
- Clicking a graph edge opens the correct transaction.
- Hop filters change the graph.
- Confirmed vs heuristic relationships are visually different.

**Gate:** `PASS` only when the graph is functionally tied to the fixture rather than being decorative.

---

### Phase 4 — Typology Intelligence and MULE_NETWORK

**Goal:** Demonstrate explainable fraud-pattern detection.

#### Implement

Typology categories:

- Peel chain
- Fan-in
- Fan-out
- Rapid-hop layering
- Consolidation
- Mixer exposure
- MIXER_BOUNDARY_CLUSTER_LEAD
- DEX boundary
- Bridge-mediated movement
- MULE_NETWORK

Each finding must expose:

- finding name
- status
- confidence
- rule version
- affected wallets
- relevant transactions
- evidence references
- data completeness
- uncertainty

#### MULE_NETWORK detail

Show:

- `pattern_type`
- victim wallet count
- intermediate wallet addresses
- aggregation address
- time window
- total aggregated value
- confidence = MEDIUM
- rule version
- evidence references
- uncertainty note
- India-specific badge

The MULE_NETWORK requirement explicitly caps confidence at MEDIUM and requires an amber `India Fraud Pattern` presentation. 

#### Mixer-boundary detail

- Show as heuristic/LEAD.
- Use dashed graph edges.
- Hover/tooltip: `Possible Exit — Heuristic Only`.
- Never render it as confirmed attribution.

#### Checkpoint before Phase 5

Verify:

- At least one finding is interactively inspectable.
- MULE_NETWORK evidence is traceable to graph/transactions.
- Confidence and uncertainty are visible.
- Rule version is visible.
- India Fraud Pattern badge is visible.
- Mixer heuristic semantics remain separate from confirmed paths.

**Gate:** `PASS` only when every finding can answer: what happened, why it was flagged, what evidence supports it, and what is uncertain.

---

### Phase 5 — VASP Intelligence, Attribution and AdaptiveVASPScorer

**Goal:** Demonstrate exchange/VASP identification as provenance-aware candidate intelligence rather than ownership proof.

#### Implement

VASP candidate list with:

- name
- address/cluster
- label status: VERIFIED / INFERRED / UNRESOLVED
- source
- confidence
- hop distance
- evidence

Candidate details must explicitly state that a VASP label/cluster is not proof of wallet ownership or illicit conduct.

#### AdaptiveVASPScorer UI

Show:

1. policy version;
2. base weights;
3. structural override state;
4. active contextual modifiers;
5. conflict resolution;
6. clamp/normalization result;
7. final score;
8. scoring metadata/provenance.

The scorer is documented as a deterministic, policy-versioned, auditable six-step process.

#### Checkpoint before Phase 6

Verify:

- VASP candidates display their evidence status correctly.
- Inferred candidates cannot visually appear as verified ownership.
- Scoring trace is derived from the fixture.
- Policy version is visible.
- Final weights sum to 1.00 in the displayed trace.
- Attribution and risk remain separate.

**Gate:** `PASS` only when the VASP module is explainable and provenance-aware.

---

### Phase 6 — Cross-Chain, Risk, Attribution and Recovery

**Goal:** Demonstrate multi-chain investigative reasoning and victim-impact urgency.

#### Implement

### Cross-chain

- Ethereum → Polygon example.
- Proven bridge relationship.
- Heuristic correlation example.
- Time/value correlation details.
- Explicit evidence and uncertainty.

### Risk

Show a separate risk assessment with:

- risk tier
- contributing findings
- supporting evidence
- uncertainty

### Attribution

Show separately:

- top VASP candidate
- confidence band
- score
- policy version
- evidence basis

### Heuristic Recovery Estimate

Show only for the qualifying fixture state.

Display:

- recovery score
- value ratio
- exchange cooperation
- time urgency
- path clarity
- attribution confidence
- action window
- display tier
- administrator-estimate disclaimer

The UI label must be `Heuristic Recovery Estimate`, not an unqualified statistical claim.

#### Checkpoint before Phase 7

Verify:

- Cross-chain proven vs heuristic relationships are distinct.
- Risk and attribution are separate.
- Recovery estimate is shown only in the qualifying fixture state.
- Recovery components can be expanded.
- Disclaimer is visible.
- Action window is visible.

**Gate:** `PASS` only when the investigator can understand why the displayed conclusion/urgency exists and what its limitations are.

---

### Phase 7 — Alerts, Recommendations, Evidence and Reporting

**Goal:** Convert intelligence into operational investigative outputs.

#### Implement

### Alerts

- alert list
- severity
- finding type
- case
- wallet
- timestamp
- status
- click-through to investigation

### Recommendations

Each recommendation should show:

- recommended action
- reason
- supporting evidence
- uncertainty
- related case/finding

### Evidence

- evidence manifest
- evidence IDs
- source
- type
- hash
- linked finding/transaction
- integrity status
- provenance

### Reporting

- investigation summary
- trace summary
- typologies
- VASP candidates
- cross-chain findings
- risk/attribution
- recovery estimate
- recommendations
- evidence manifest
- audit reference

#### Checkpoint before Phase 8

Verify:

- Every alert links to a case/finding.
- Recommendations reference evidence.
- Evidence manifest references actual fixture objects.
- Report values match the investigation UI.
- Hash/provenance fields remain consistent.

**Gate:** `PASS` only when the output layer is internally consistent.

---

### Phase 8 — Supervisor Workflow, Audit and System Status

**Goal:** Demonstrate controlled human review and operational transparency.

#### Implement

### Supervisor

- pending preservation requests
- request details
- evidence manifest binding
- approve
- reject
- status transition

### Audit

Record UI-visible events such as:

- case created
- trace started
- finding reviewed
- recommendation created
- evidence attached
- preservation request drafted
- supervisor decision

### System status

Display simulated states for:

- Ethereum
- Polygon
- Tron
- Bitcoin
- indexing
- trace engine
- typology engine
- VASP intelligence
- alerts
- evidence

All simulated status must remain clearly identified as demo/fixture state.

#### Checkpoint before final QA

Verify:

- Investigator cannot perform supervisor-only approval in the UI.
- Supervisor workflow visibly changes state.
- Audit timeline records the interaction.
- System status does not imply verified production operation.

**Gate:** `PASS` only when review and audit behavior is coherent.

---

## 4. Final Integration QA

Before delivery, run a complete frontend-only acceptance pass.

### Functional

- All routes work.
- All major buttons work.
- All drawers/modals open correctly.
- Filters update visible data.
- Graph and tables remain synchronized.
- Mock services return consistent data.

### Data consistency

- Case IDs match across screens.
- Wallet addresses match transactions.
- Graph edges match transaction records.
- Typology evidence references existing transactions.
- VASP candidates reference existing wallet/cluster data.
- Cross-chain relationships reference existing nodes.
- Recovery inputs match the displayed case.
- Evidence IDs match report references.
- Audit events match actions performed.

### Demo safety

- `FIXTURE REPLAY` visible.
- `DEMO DATA` visible where required.
- No fixture is described as live intelligence.
- No inferred VASP is represented as confirmed ownership.
- No automatic legal action/fund freeze is represented.
- Heuristic recovery estimate carries the required qualifier.
- Mixer heuristic edges remain dashed.

### Build

- Production build succeeds.
- No TypeScript errors.
- No broken routes.
- No missing assets.
- No console errors during the complete user flow.

## 5. Definition of Completion

The frontend is ready when the complete user journey can be performed from a new case through transaction intelligence, wallet investigation, bounded trace, graph, typology, VASP attribution, cross-chain analysis, risk, recovery, recommendations, evidence and supervised workflow using the supplied fixture and mock services.

A feature is not considered complete merely because the page exists; it must be interactive, fixture-backed, internally consistent and visibly aligned with the production terminology and constraints.
