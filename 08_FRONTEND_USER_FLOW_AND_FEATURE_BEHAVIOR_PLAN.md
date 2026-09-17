# CryptoTrace LEA — Frontend User Flow & Feature Behavior Plan

**Project:** SIH 26183 — Real-Time Crypto Fraud Attribution System for Indian Law Enforcement  
**Scope:** Feature behavior and end-user interaction specification for the frontend demo

## 1. Purpose

This document tells the coding agent exactly **what the user should be able to do in the frontend, what should appear, and how each feature should respond**.

The frontend should feel like one connected investigation system. A user action on one screen must produce a logically consistent result on the next screen. The underlying values may come from fixture/mock data.

The documented product journey is intake → validation → indexing/normalization → graph → bounded trace → typology → VASP → cross-chain → risk/attribution → recovery estimate → recommendations → evidence/audit → investigator UI → supervisor workflow.

## 2. Primary User: Investigator

The investigator is the main frontend user.

The investigator should be able to:

- receive or enter a suspect wallet;
- inspect rapid transaction information;
- open a wallet investigation;
- configure and run a bounded trace;
- explore the fund-flow graph;
- inspect suspicious intermediary behavior;
- inspect typology findings;
- inspect candidate VASPs;
- inspect attribution scoring;
- inspect cross-chain evidence;
- inspect risk and attribution separately;
- view the Heuristic Recovery Estimate when eligible;
- review alerts and recommendations;
- inspect evidence/provenance;
- generate an investigation report;
- draft a preservation request.

## 3. Global Application Behavior

### Global header

Always show:

- CryptoTrace LEA
- current module
- current case when one is selected
- execution mode
- user role
- notifications/alerts

### Execution mode

Fixture mode must always be visible:

`FIXTURE REPLAY`

and, where a response is specifically mock-generated:

`DEMO DATA`

### Identifier formatting

Blockchain hashes and addresses use monospace formatting and truncated display with copy controls.

### Global interaction rules

- Clicking a wallet opens wallet investigation.
- Clicking a transaction opens transaction details.
- Clicking a finding opens finding evidence.
- Clicking a VASP candidate opens attribution details.
- Clicking an alert opens the related investigation context.
- Clicking an evidence item opens provenance details.

## 4. Feature-by-Feature Behavior

## Feature 1 — Case Intake

### User action

User chooses:

`NCRP` / `SAHYOG` / `Manual Entry`

### Frontend behavior

Open the corresponding form.

NCRP form fields:

- complaint ID
- fraud type
- reported amount
- incident timestamp
- Indian state
- chain
- suspect wallet

SAHYOG form fields:

- bulletin ID
- source metadata
- wallets
- chain(s)
- notes

Manual form fields:

- wallet
- chain
- reported amount
- incident timestamp
- notes

### Submit behavior

1. Validate fields.
2. Show validation result.
3. Show case creation state.
4. Create case in local/mock state.
5. Mark response `DEMO DATA`.
6. Navigate to the created case.

### Error behavior

Show field-level validation and do not create the case.

### Success result

Show case ID, source, wallet, chain and status.

---

## Feature 2 — Case Queue

### Purpose

Let the investigator quickly locate active cases.

### Display

- case ID
- source
- chain
- reported amount
- created time
- current stage
- alert severity
- status

### Interactions

- search by case ID/wallet
- filter by chain
- filter by source
- filter by status
- click row to open case

### Behavior

Filters modify the visible table immediately from fixture data.

---

## Feature 3 — Rapid Transaction Intelligence

### Purpose

Show that the system can surface blockchain activity quickly for an investigated chain/wallet.

### Display

- chain
- streaming/connected indicator
- last update time
- latest block
- transaction count
- live transaction list

Each transaction shows:

- timestamp
- chain
- hash
- from
- to
- asset
- amount
- value
- block
- finality

### User interaction

- chain switch updates the transaction feed;
- search filters transactions;
- clicking a row opens details;
- latest transactions can appear at the top;
- a refresh interaction replays the fixture fetch state.

### Loading behavior

Show:

`FETCHING → NORMALIZING → READY`

The underlying response remains fixture-backed.

### Important

Do not label fixture data as actual live blockchain intelligence.

---

## Feature 4 — Transaction Detail

### Opened by

Clicking any transaction.

### Display

- transaction hash
- block
- timestamp
- chain
- asset
- value
- raw amount
- sender
- recipient
- event type
- finality
- provider/source
- provenance ID
- payload hash

### Actions

- copy transaction hash
- copy addresses
- open sender wallet
- open recipient wallet
- open evidence

---

## Feature 5 — Wallet Investigation

### Opened by

- case wallet
- transaction sender/recipient
- search result
- graph node

### Display

#### Wallet summary

- address
- chain
- wallet classification
- first seen
- last activity
- inbound total
- outbound total
- transaction count

#### Tabs

`Overview | Transactions | Fund Flow | Behavior | Counterparties | Evidence`

### Behavior

Changing tabs must not reload the entire page; show the requested dataset from mock services.

---

## Feature 6 — Bounded Trace

### User action

Click `Run Trace`.

### Configuration

- maximum hops
- time window
- minimum value
- maximum outflows
- maximum nodes
- timeout

### Frontend behavior

1. Validate configuration.
2. Show trace-running state.
3. Return fixture-based trace result.
4. Display applied limits.
5. Update graph.
6. Update trace summary.
7. Update typology/VASP/cross-chain views connected to the trace.

### Display

- root wallet
- nodes discovered
- transactions discovered
- max depth
- time window
- termination reason
- coverage
- applied limits

### Error behavior

Show an explicit trace error/invalid configuration state instead of silently showing stale data.

---

## Feature 7 — Fund-Flow Graph

### Purpose

Make movement of funds understandable visually.

### Node behavior

Clicking a node opens its wallet/entity details.

### Edge behavior

Clicking an edge opens the related transaction.

### Expand behavior

Clicking `Expand` on a node reveals fixture-defined next-hop relationships.

### Filters

- hop depth
- chain
- asset
- minimum value
- time window
- relationship type

### Visual semantics

Confirmed path:

`solid`

Heuristic mixer relationship:

`dashed`

Heuristic mixer edge label:

`Possible Exit — Heuristic Only`

---

## Feature 8 — Timeline Playback

### User action

Move timeline slider or press play.

### Behavior

Transactions appear progressively in chronological order and the graph updates to the visible time range.

### Controls

- play
- pause
- reset
- start/end range
- speed

The playback is a visualization over the fixture timeline.

---

## Feature 9 — Typology Detection

### Display categories

- Peel Chain
- Fan-In
- Fan-Out
- Rapid-Hop
- Consolidation
- Mixer Exposure
- Mixer Boundary Cluster Lead
- DEX Boundary
- Bridge Movement
- MULE_NETWORK

### Finding click behavior

Clicking a finding opens:

- summary
- confidence
- rule version
- affected wallets
- relevant transactions
- evidence
- data completeness
- uncertainty

### Behavior

Selecting a finding highlights affected graph nodes and edges.

---

## Feature 10 — MULE_NETWORK

### Trigger state

The demo fixture contains a qualifying MULE_NETWORK finding.

### Display

- `MULE_NETWORK`
- `India Fraud Pattern`
- `MEDIUM`
- victim wallet count
- intermediate wallets
- aggregation address
- aggregation window
- total aggregated value
- rule version
- evidence references
- uncertainty

### Interaction

Clicking an intermediate wallet highlights the relevant path.

Clicking an evidence reference opens the transaction.

### Required interpretation behavior

The frontend must present this as a behavioral investigative finding, not as proof of individual wallet control.

---

## Feature 11 — Mixer Boundary Heuristic

### Display

- mixer boundary node
- possible exit nodes
- heuristic/LEAD status
- timing correlation
- denomination correlation
- uncertainty note

### Graph behavior

Edges are dashed.

### Important behavior

Never allow the UI to visually promote this relationship to verified ownership.

---

## Feature 12 — VASP Intelligence

### Display states

`VERIFIED | INFERRED | UNRESOLVED`

### Candidate card

- VASP name
- address/cluster
- status
- confidence
- source
- hop distance
- supporting evidence

### Interaction

Clicking candidate opens attribution panel.

### Safety behavior

The UI must distinguish a VASP label/cluster from confirmed ownership.

---

## Feature 13 — AdaptiveVASPScorer

### User action

Click `View Attribution Analysis`.

### Display

- policy version
- base weights
- structural override state
- contextual modifiers
- conflict handling
- clamping result
- normalized weights
- final score
- confidence band

### Interactive behavior

Each modifier should be expandable to show:

- modifier name
- reason
- affected scoring dimension
- resulting weight change

### Final result

The displayed normalized vector must sum to exactly 1.00.

---

## Feature 14 — Cross-Chain Analysis

### Display

For every relationship:

- source chain
- destination chain
- source wallet
- destination wallet
- relationship type
- timestamp information
- value information
- supporting evidence
- confidence/uncertainty

### Relationship types

`PROVEN BRIDGE`

and

`HEURISTIC CORRELATION`

### Behavior

Selecting a cross-chain finding highlights both sides of the relationship in the graph.

---

## Feature 15 — Risk Assessment

### Display

- risk tier
- score if present in fixture
- key contributing findings
- evidence
- uncertainty/data-quality warnings

### Important behavior

Risk is an independent panel and is not merged into attribution confidence.

---

## Feature 16 — Attribution Assessment

### Display

- candidate VASP
- attribution score
- confidence band
- evidence basis
- policy version
- scoring trace

### Important behavior

Do not describe attribution as ownership proof.

---

## Feature 17 — Heuristic Recovery Estimate

### Trigger

Only display when the fixture satisfies the qualifying VASP-confidence boundary.

### Display

- Heuristic Recovery Estimate
- recovery score
- action window hours
- display tier
- traced value
- component values
- top candidate confidence
- cooperation estimate

### Expandable component explanation

- value ratio
- exchange cooperation
- time urgency
- path clarity
- attribution confidence

### Tooltip/disclaimer

Show the administrator-estimate explanation and the statement that the output is not a statistical probability.

### Non-qualifying state

Display:

`Attribution confidence insufficient for recovery estimate.`

when the top candidate does not satisfy the required boundary.

---

## Feature 18 — Alerts

### Display

- severity
- alert type
- case
- wallet
- timestamp
- status

### Interaction

Clicking an alert opens the related investigation and highlights the relevant node/finding.

### Example alert types

- rapid-hop activity
- MULE_NETWORK
- new VASP interaction
- partial indexing
- cross-chain event

---

## Feature 19 — Recommendations

### Display

Each recommendation contains:

- recommended action
- reason
- supporting evidence
- uncertainty
- linked case/finding

### Interaction

Clicking evidence opens the evidence detail.

The UI should present recommendations as advisory investigative actions, not automatic legal decisions.

---

## Feature 20 — Evidence Manifest

### Display

- evidence ID
- evidence type
- source
- linked transaction/finding
- hash
- integrity status
- provenance

### Interaction

Clicking evidence opens a detail view containing the full metadata represented in the fixture.

### Behavior

The same evidence item should appear consistently wherever it is referenced.

---

## Feature 21 — Investigation Report

### User action

Click `Generate Report`.

### Behavior

Generate a report view from current case state.

### Report sections

- case information
- wallet
- transaction summary
- bounded trace
- typology findings
- VASP candidates
- cross-chain analysis
- risk
- attribution
- recovery estimate if eligible
- recommendations
- evidence manifest
- audit reference

### Important

Report values must match the dashboard/fixture, not use separately hardcoded values.

---

## Feature 22 — Supervisor Preservation Request

### Investigator behavior

Investigator can create a draft.

### Draft screen

Show:

- case
- recipient VASP
- requested records
- evidence manifest
- draft status

### Supervisor behavior

Supervisor opens the request and can:

- approve
- reject

### UI state transition

`DRAFT → PENDING SUPERVISOR → APPROVED/REJECTED`

### Important

Do not implement automatic filing, freezing or legal action.

---

## Feature 23 — Audit Timeline

### Display

Chronological events such as:

- case created
- trace run
- finding reviewed
- VASP reviewed
- recommendation created
- evidence attached
- request drafted
- supervisor decision

### Behavior

Audit events should update when the corresponding frontend interaction occurs.

---

## Feature 24 — System / Integration Status

### Display

Chain providers/services as operational-looking status cards:

- Ethereum
- Polygon
- Tron
- Bitcoin
- Indexer
- Trace Engine
- Typology Engine
- VASP Intelligence
- Alert Engine

### Behavior

The fixture can simulate:

- ONLINE
- SYNCING
- DEGRADED
- PARTIAL
- ERROR

but the overall application must retain the `FIXTURE REPLAY`/demo designation.

## 5. Cross-Feature Rules

### Rule A — Shared case state

Changing the active case changes every dependent screen.

### Rule B — Shared wallet state

The selected wallet must remain consistent across transaction, graph and evidence views.

### Rule C — Shared transaction state

A transaction opened from any screen must display the same canonical details.

### Rule D — Shared evidence state

The same evidence ID must resolve to the same metadata everywhere.

### Rule E — Shared VASP state

A VASP candidate's status, score and provenance must remain consistent across candidate cards, attribution view, recommendations and report.

### Rule F — Shared graph state

Graph nodes/edges are derived from the same transactions shown elsewhere.

### Rule G — Explicit uncertainty

Whenever a result is heuristic, inferred, partial or unresolved, the UI must say so.

### Rule H — No generic AI behavior

Do not add an arbitrary chatbot, generative answer panel, or unexplained AI score. The product is an evidence-first investigation workspace.

## 6. Recommended User Flow

```text
Dashboard
   ↓
Case Queue
   ↓
Open Case
   ↓
Case / Wallet Overview
   ↓
Rapid Transactions
   ↓
Transaction Detail
   ↓
Run Bounded Trace
   ↓
Fund-Flow Graph
   ↓
Typology Finding
   ↓
MULE_NETWORK
   ↓
VASP Candidates
   ↓
AdaptiveVASPScorer
   ↓
Cross-Chain
   ↓
Risk + Attribution
   ↓
Heuristic Recovery Estimate
   ↓
Alerts + Recommendations
   ↓
Evidence Manifest
   ↓
Investigation Report
   ↓
Preservation Request Draft
   ↓
Supervisor Review
   ↓
Audit Timeline
```

## 7. Required Frontend States

Every major asynchronous feature should support:

- idle
- loading
- success
- empty
- partial
- error
- fixture replay

The UI should never silently display stale values after a failed operation.

## 8. Feature Completion Rule

A feature is considered implemented only when:

1. the user can trigger it;
2. the UI gives a meaningful response;
3. the response uses the supplied mock API/fixture;
4. related screens update consistently;
5. evidence/provenance is visible where required;
6. uncertainty/confidence semantics are preserved;
7. the feature does not make unsupported production or legal claims.
