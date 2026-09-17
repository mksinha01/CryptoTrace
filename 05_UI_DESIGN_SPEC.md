# CryptoTrace LEA — Frontend Demo UI Design Specification

## 1. Design Goal

Build a professional law-enforcement investigation workstation rather than a generic AI dashboard.

The interface should prioritize:

- evidence first;
- transaction density;
- graph-centric investigation;
- clear provenance;
- uncertainty visibility;
- fast navigation;
- progressive disclosure;
- investigator actions;
- visible fixture/demo boundaries.

## 2. Visual Direction

### Theme

Dark operational interface suitable for long investigation sessions.

### Visual character

- restrained;
- information-dense;
- technical but readable;
- minimal decoration;
- no excessive gradients;
- no oversized hero cards;
- no marketing-style AI imagery.

## 3. Layout

Desktop-first at 1440px and above.

Recommended shell:

```text
┌────────────┬─────────────────────────────────────────────┐
│            │ Top Command Bar                             │
│ Sidebar    ├─────────────────────────────────────────────┤
│            │ Main investigation workspace               │
│            │                                             │
│            │ Graph + evidence + transaction intelligence │
└────────────┴─────────────────────────────────────────────┘
```

Sidebar width: approximately 230–260px.

Main content should support dense two- and three-column layouts.

## 4. Navigation

```text
Overview
Cases
Alerts
Investigations
Transactions
Wallets
VASP Intelligence
Cross-Chain
Typologies
Evidence
Reports

Supervisor
System Status
Settings
```

## 5. Typography

Use a clean sans-serif for UI labels and a monospace font for:

- wallet addresses;
- transaction hashes;
- block numbers;
- evidence IDs;
- request IDs;
- policy versions.

Use strong numeric hierarchy for values such as INR amounts, transaction counts, hop depth and action windows.

## 6. Semantic Status Colors

Use color primarily for meaning.

| State | Semantic treatment |
|---|---|
| Critical/high severity | Red accent |
| India Fraud Pattern | Amber accent |
| Verified/confirmed/healthy | Green accent |
| NCRP | Blue badge |
| SAHYOG | Purple badge |
| Manual | Grey badge |
| Heuristic | Amber + dashed visual |
| Partial | Amber/grey |
| Inferred | Violet/neutral |
| Unresolved | Muted grey |
| Fixture Replay | Yellow badge |
| Demo Data | Yellow badge |

Avoid coloring entire cards; use badges, borders, icons and small accents.

## 7. Mandatory Labels

The UI must use these exact semantics:

`FIXTURE REPLAY`

`DEMO DATA`

`VERIFIED`

`INFERRED`

`UNRESOLVED`

`PARTIAL`

`HEURISTIC`

`India Fraud Pattern`

`Possible Exit — Heuristic Only`

`Heuristic Recovery Estimate`

`Not a statistical probability.`

## 8. Dashboard

Dashboard should prioritize operational state rather than decorative KPIs.

Primary sections:

1. active cases;
2. alerts;
3. live/simulated chain status;
4. recent transactions;
5. high-priority findings;
6. recent audit activity.

## 9. Investigation Workstation

The investigation page is the primary application screen.

Recommended composition:

```text
Case Header
────────────────────────────────────────────────────
Recovery | Attribution | Risk | Data Coverage
────────────────────────────────────────────────────
Fund-Flow Graph                 Findings / VASP
────────────────────────────────────────────────────
Transactions / Timeline         Evidence / Recommendations
```

## 10. Fund-Flow Graph

Use React Flow, Cytoscape, or an equivalent graph library.

### Confirmed edges

Solid edges.

### Heuristic mixer edges

Dashed edges.

Hover text:

`Possible Exit — Heuristic Only`

### Node semantics

- reported wallet;
- intermediary wallet;
- aggregation wallet;
- VASP;
- DEX;
- bridge;
- mixer boundary;
- unresolved address.

Clicking a node opens wallet intelligence.

Clicking an edge opens transaction details.

## 11. Transaction Intelligence

Transaction tables should prioritize:

- timestamp;
- chain;
- transaction hash;
- from;
- to;
- asset;
- amount;
- direction;
- hop;
- finality.

Newest transactions should visually enter at the top in fixture mode.

## 12. Finding Cards

Each finding card should show:

```text
Finding type
Confidence
Rule version
Affected wallets
Evidence count
Data coverage
```

Expand to reveal evidence and uncertainty.

## 13. MULE_NETWORK

Always render:

```text
INDIA FRAUD PATTERN
```

as an amber semantic badge.

Show:

- confidence: MEDIUM;
- victim wallet count;
- intermediary wallets;
- aggregation wallet;
- time window;
- total value;
- rule version;
- evidence references;
- uncertainty note.

## 14. VASP Intelligence

Candidates should be shown as rows or cards with:

- name;
- address;
- label state;
- source;
- confidence;
- hop distance;
- evidence.

Never render `INFERRED` as ownership confirmation.

## 15. Attribution Drawer

Use a right-side drawer rather than a page transition.

Show:

- policy version;
- base weights;
- active modifiers;
- conflict resolution;
- clamping;
- normalized weights;
- final score;
- confidence band;
- provenance.

## 16. Recovery Estimate

When eligible, make the component visually prominent.

Use:

`Heuristic Recovery Estimate`

Secondary text may say:

`Recovery Probability (not a statistical probability)`

Show:

- score;
- display tier;
- action window;
- value ratio;
- exchange cooperation;
- time urgency;
- path clarity;
- attribution confidence;
- source/review date.

## 17. Cross-Chain

Always make the evidence strength immediately visible:

`PROVEN BRIDGE`

versus

`HEURISTIC CORRELATION`

Never use identical graphics for these states.

## 18. Evidence

Evidence views should resemble an operational evidence registry, not a generic document list.

Columns:

- evidence ID;
- type;
- source;
- reference;
- hash;
- integrity;
- immutable state.

## 19. Supervisor UX

Supervisor controls should look visibly different from investigator actions.

Preservation request flow:

`Draft → Review → Approve / Reject → Audit Event`

Do not add direct "Freeze Funds" or automatic legal-action controls.

## 20. Fixture Boundary

Add a persistent top-level banner when fixture data is active:

`FIXTURE REPLAY · DEMO DATA`

The banner must not disappear merely because the user changes pages.

## 21. Responsive Behavior

Desktop is the primary target.

For smaller screens:

- collapse sidebar;
- stack evidence panels;
- preserve graph interaction;
- keep hashes horizontally scrollable rather than wrapping into unreadable text.

## 22. Interaction Principles

- Hover for compact explanations.
- Click for detailed evidence.
- Drawer for transaction/VASP details.
- Modal for supervisor decisions.
- Tabs for related investigation dimensions.
- Filters remain visible while investigating.
- Avoid deep navigation chains when an inline drawer can preserve context.
