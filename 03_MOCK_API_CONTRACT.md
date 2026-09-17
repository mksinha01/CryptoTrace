# CryptoTrace LEA — Frontend Demo Mock API Contract

## 1. Purpose

This document defines the frontend-facing API contract for the SIH 26183 CryptoTrace LEA demo build.

The frontend is implemented against these interfaces as if they were production APIs. For the SIH deadline build, all responses are served by a local mock service backed by `04_DEMO_FIXTURE.json`.

The mock layer must preserve production terminology and domain boundaries so it can later be replaced by real backend endpoints without redesigning the UI.

## 2. Execution Modes

Every response must expose:

- `execution_mode`: `FIXTURE_REPLAY` for the current demo build.
- `demo_data`: `true` for all fixture responses.
- `source`: provenance of the simulated data.

The UI must never present fixture responses as live intelligence.

## 3. Common Response Envelope

```json
{
  "success": true,
  "execution_mode": "FIXTURE_REPLAY",
  "demo_data": true,
  "request_id": "req-demo-001",
  "source": "CRYPTO_TRACE_FIXTURE",
  "data": {}
}
```

For simulated failures:

```json
{
  "success": false,
  "execution_mode": "FIXTURE_REPLAY",
  "demo_data": true,
  "request_id": "req-demo-001",
  "error": {
    "code": "TRACE_LIMIT_EXCEEDED",
    "message": "Trace stopped at configured node limit.",
    "retryable": false
  }
}
```

## 4. Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/cases` | Case queue |
| GET | `/api/cases/:caseId` | Case details |
| POST | `/api/cases/intake` | Manual/NCRP/SAHYOG demo intake |
| GET | `/api/wallets/:address` | Wallet profile |
| GET | `/api/wallets/:address/transactions` | Wallet transaction history |
| GET | `/api/transactions` | Global rapid transaction feed |
| GET | `/api/transactions/:txHash` | Transaction detail |
| POST | `/api/trace` | Run bounded trace |
| GET | `/api/cases/:caseId/graph` | Fund-flow graph |
| GET | `/api/cases/:caseId/typologies` | Typology findings |
| GET | `/api/cases/:caseId/vasps` | VASP candidates |
| GET | `/api/cases/:caseId/attribution` | AdaptiveVASPScorer output |
| GET | `/api/cases/:caseId/cross-chain` | Cross-chain findings |
| GET | `/api/cases/:caseId/risk` | Risk assessment |
| GET | `/api/cases/:caseId/recovery` | Heuristic Recovery Estimate |
| GET | `/api/cases/:caseId/recommendations` | Investigator recommendations |
| GET | `/api/cases/:caseId/evidence` | Evidence manifest |
| GET | `/api/alerts` | Alert center |
| GET | `/api/audit` | Audit timeline |
| GET | `/api/system/status` | Simulated provider/system status |
| GET | `/api/supervisor/requests` | Preservation request queue |
| GET | `/api/supervisor/requests/:requestId` | Request details |
| POST | `/api/supervisor/requests/:requestId/decision` | Demo approve/reject |
| GET | `/api/reports/:caseId` | Investigation report view model |

## 5. Case Intake

### POST `/api/cases/intake`

Accepts a frontend form model:

```json
{
  "source": "NCRP_INTAKE",
  "complaint_id": "NCRP-2026-184721",
  "fraud_type": "INVESTMENT_FRAUD",
  "fraud_amount_inr": 200000,
  "incident_datetime": "2026-09-16T14:32:00+05:30",
  "state": "Chhattisgarh",
  "chain": "ethereum",
  "wallet": "0x7F31A4D8E11B72A1C9D5E3B4F8A2C7D19A92C"
}
```

Successful response:

```json
{
  "success": true,
  "execution_mode": "FIXTURE_REPLAY",
  "demo_data": true,
  "data": {
    "case_id": "CASE-2026-184721",
    "complaint_id": "NCRP-2026-184721",
    "source": "NCRP_INTAKE",
    "status": "TRACE_QUEUED",
    "confirmation": "Case created and wallet queued for investigation."
  }
}
```

## 6. Case Object

```json
{
  "case_id": "CASE-2026-184721",
  "complaint_id": "NCRP-2026-184721",
  "source": "NCRP_INTAKE",
  "source_badge": "NCRP",
  "execution_mode": "FIXTURE_REPLAY",
  "demo_data": true,
  "status": "UNDER_INVESTIGATION",
  "fraud_type": "INVESTMENT_FRAUD",
  "fraud_amount_inr": 200000,
  "incident_datetime": "2026-09-16T14:32:00+05:30",
  "state": "Chhattisgarh",
  "primary_chain": "ethereum",
  "reported_wallet": "0x7F31A4D8E11B72A1C9D5E3B4F8A2C7D19A92C",
  "wallet_type": "NON_CUSTODIAL_CANDIDATE",
  "data_coverage": "PARTIAL",
  "created_at": "2026-09-16T14:34:12+05:30",
  "last_updated_at": "2026-09-16T15:08:31+05:30"
}
```

## 7. Rapid Transaction Feed

### GET `/api/transactions`

Query parameters:

- `chain`
- `asset`
- `direction`
- `limit`
- `cursor`
- `status`

Each transaction item:

```json
{
  "tx_hash": "0x8AF31B2C77D9E1A2B913EE7D6C4C2A71B5A91D2E3F8811",
  "chain_id": "ethereum",
  "block_height": 23891442,
  "timestamp": "2026-09-16T21:04:31+05:30",
  "from_address": "0x7F31...A92C",
  "to_address": "0x9132...E812",
  "asset": "ETH",
  "event_type": "NATIVE",
  "amount_native": "1.270000000000000000",
  "value_inr": 48200,
  "direction": "OUT",
  "finality": "CONFIRMED",
  "provider": "ETH_RPC_PRIMARY",
  "provenance_id": "RAW-ETH-23891442-8AF3"
}
```

The UI should animate the newest fixture rows arriving at the top of the stream.

## 8. Transaction Detail

### GET `/api/transactions/:txHash`

Return:

- transaction identity;
- chain and block;
- sender/receiver;
- asset and value;
- gas/fee;
- event type;
- finality;
- provider;
- provenance;
- payload hash;
- related case/wallet IDs.

## 9. Wallet Profile

### GET `/api/wallets/:address`

```json
{
  "address": "0x7F31...A92C",
  "chain": "ethereum",
  "wallet_type": "NON_CUSTODIAL_CANDIDATE",
  "first_seen": "2026-09-14T09:20:00+05:30",
  "last_activity": "2026-09-16T20:58:13+05:30",
  "transaction_count": 43,
  "total_inbound_inr": 231400,
  "total_outbound_inr": 217800,
  "risk_tier": "HIGH",
  "label": null,
  "label_status": "UNRESOLVED",
  "coverage": "PARTIAL"
}
```

## 10. Bounded Trace

### POST `/api/trace`

Request:

```json
{
  "case_id": "CASE-2026-184721",
  "root_wallet": "0x7F31...A92C",
  "max_hops": 5,
  "time_window_hours": 72,
  "minimum_value_inr": 5000,
  "max_outflows": 10,
  "max_nodes": 100,
  "timeout_seconds": 15
}
```

Response:

```json
{
  "trace_id": "TRACE-2026-184721-01",
  "root_wallet": "0x7F31...A92C",
  "node_count": 17,
  "edge_count": 31,
  "max_depth_reached": 4,
  "termination_reason": "LOW_VALUE",
  "coverage": "PARTIAL",
  "limits": {
    "max_hops": 5,
    "time_window_hours": 72,
    "minimum_value_inr": 5000,
    "max_outflows": 10,
    "max_nodes": 100,
    "timeout_seconds": 15
  },
  "paths": []
}
```

The frontend must expose these limits rather than silently hiding them.

## 11. Graph Data

### GET `/api/cases/:caseId/graph`

Node schema:

```json
{
  "id": "W2",
  "address": "0xA431...B821",
  "chain": "ethereum",
  "type": "INTERMEDIARY_WALLET",
  "status": "BEHAVIOR_ONLY",
  "risk_tier": "HIGH",
  "label_status": "UNRESOLVED",
  "evidence_count": 4
}
```

Edge schema:

```json
{
  "id": "E-W1-W2-01",
  "source": "W1",
  "target": "W2",
  "tx_hash": "0x8AF3...91D2",
  "asset": "ETH",
  "value_inr": 48200,
  "timestamp": "2026-09-16T14:35:22+05:30",
  "hop": 1,
  "status": "CONFIRMED",
  "evidence_type": "DIRECT",
  "style": "SOLID"
}
```

Heuristic mixer-boundary edges must use:

```json
{
  "evidence_type": "HEURISTIC",
  "style": "DASHED",
  "edge_label": "Possible Exit — Heuristic Only"
}
```

## 12. Typology Findings

### GET `/api/cases/:caseId/typologies`

```json
{
  "pattern_type": "MULE_NETWORK",
  "india_specific": true,
  "confidence": "MEDIUM",
  "confidence_band": "MEDIUM",
  "rule_version": "MULE_NETWORK-v1.2",
  "victim_wallet_count": 3,
  "intermediate_wallet_addresses": [
    "0xA431...B821",
    "0xB921...C441",
    "0xC211...D739"
  ],
  "aggregation_address": "0xAB31...72C9",
  "time_window_hours": 41,
  "total_value_aggregated_usd": 1776.52,
  "evidence_references": ["TX-001", "TX-004", "TX-007"],
  "uncertainty_note": "Mule wallet classification is based on behavioral heuristics only. Individual wallet control requires KYC verification which is outside the scope of on-chain analysis.",
  "data_coverage": "PARTIAL"
}
```

Other supported fixture findings:

- `PEEL_CHAIN`
- `FAN_IN`
- `FAN_OUT`
- `RAPID_HOP`
- `CONSOLIDATION`
- `MIXER_EXPOSURE`
- `MIXER_BOUNDARY_CLUSTER_LEAD`
- `DEX_BOUNDARY`
- `BRIDGE_MEDIATED_MOVEMENT`

## 13. VASP Candidates

### GET `/api/cases/:caseId/vasps`

```json
{
  "candidate_id": "VASP-CAND-01",
  "name": "Exchange-X",
  "address": "0xEE91...A812",
  "label_status": "VERIFIED",
  "label_source": "EXCHANGE_REGISTRY_FIXTURE",
  "confidence": 0.81,
  "confidence_band": "HIGH",
  "hop_distance": 1,
  "evidence_references": ["TX-019", "LABEL-003"],
  "ownership_proof": false
}
```

## 14. AdaptiveVASPScorer

### GET `/api/cases/:caseId/attribution`

Return:

```json
{
  "policy_version": "AVS-2026.03",
  "candidate_id": "VASP-CAND-01",
  "base_weights": {
    "label": 0.35,
    "directness": 0.25,
    "retained": 0.15,
    "finality": 0.10,
    "temporal": 0.10,
    "corroboration": 0.05
  },
  "fired_modifiers": ["HIGH_VALUE", "INDIA_EXCHANGE", "MIXER_PATH"],
  "final_weights": {
    "label": 0.32,
    "directness": 0.31,
    "retained": 0.13,
    "finality": 0.09,
    "temporal": 0.10,
    "corroboration": 0.05
  },
  "score": 0.81,
  "confidence_band": "HIGH",
  "scoring_metadata": {
    "steps": [
      "POLICY_LOADED",
      "STRUCTURAL_OVERRIDE_CHECKED",
      "CONTEXTUAL_MODIFIERS_APPLIED",
      "CONFLICTS_RESOLVED",
      "WEIGHTS_CLAMPED",
      "WEIGHTS_RENORMALIZED",
      "SCORE_CALCULATED"
    ],
    "path_contains_bridge": true
  }
}
```

## 15. Cross-Chain

### GET `/api/cases/:caseId/cross-chain`

Each link contains:

```json
{
  "link_id": "XCHAIN-001",
  "from_chain": "ethereum",
  "to_chain": "polygon",
  "from_address": "0x91...22",
  "to_address": "0x71...AC",
  "relationship": "PROVEN_BRIDGE",
  "evidence_strength": "DIRECT",
  "timestamp_delta_minutes": 3,
  "value_correlation": 0.94,
  "uncertainty": false,
  "evidence_references": ["BRIDGE-011"]
}
```

Heuristic correlations must set:

```json
{
  "relationship": "HEURISTIC_CORRELATION",
  "evidence_strength": "CORRELATION",
  "uncertainty": true
}
```

## 16. Risk

### GET `/api/cases/:caseId/risk`

```json
{
  "risk_tier": "HIGH",
  "risk_score": 78,
  "rule_version": "RISK-2026.02",
  "factors": [
    {"name": "RAPID_HOP", "weight": 0.28, "evidence": ["TX-003", "TX-004"]},
    {"name": "MULE_NETWORK", "weight": 0.32, "evidence": ["FIND-001"]},
    {"name": "HIGH_VALUE", "weight": 0.20, "evidence": ["TX-001"]},
    {"name": "CROSS_CHAIN_EXPOSURE", "weight": 0.20, "evidence": ["XCHAIN-001"]}
  ]
}
```

## 17. Heuristic Recovery Estimate

### GET `/api/cases/:caseId/recovery`

```json
{
  "eligible": true,
  "label": "Heuristic Recovery Estimate",
  "recovery_score": 0.63,
  "display_tier": "AMBER",
  "action_window_hours": 18,
  "value_ratio": 0.74,
  "exchange_cooperation": 0.85,
  "time_urgency": 0.91,
  "path_clarity": 0.33,
  "top_candidate_confidence": 0.81,
  "disclaimer": "Not a statistical probability.",
  "cooperation_source": "ADMINISTRATOR_ESTIMATE",
  "cooperation_last_reviewed": "2026-09-15"
}
```

For non-eligible cases return `eligible=false` and:

`Attribution confidence insufficient for recovery estimate.`

## 18. Recommendations

### GET `/api/cases/:caseId/recommendations`

```json
[
  {
    "recommendation_id": "REC-001",
    "priority": "HIGH",
    "title": "Preserve VASP deposit records",
    "reason": "Verified candidate VASP is one hop from traced funds.",
    "evidence_references": ["TX-019", "VASP-CAND-01"],
    "uncertainty": "VASP label does not establish wallet ownership."
  }
]
```

## 19. Evidence

### GET `/api/cases/:caseId/evidence`

```json
{
  "manifest_id": "EV-MAN-184721",
  "integrity_status": "VERIFIED",
  "hash_algorithm": "SHA-256",
  "items": [
    {
      "evidence_id": "EV-001",
      "type": "TRANSACTION",
      "source": "Ethereum RPC",
      "reference": "TX-001",
      "payload_hash": "8ae31c...72d91",
      "immutable": true
    }
  ]
}
```

## 20. Alerts

### GET `/api/alerts`

Alert object:

```json
{
  "alert_id": "ALERT-001",
  "severity": "HIGH",
  "type": "RAPID_HOP",
  "title": "Rapid-hop activity detected",
  "case_id": "CASE-2026-184721",
  "wallet": "0x72...91",
  "created_at": "2026-09-16T21:03:12+05:30",
  "status": "OPEN",
  "evidence_references": ["TX-014", "TX-015"]
}
```

## 21. Audit

### GET `/api/audit`

```json
{
  "audit_id": "AUD-982174",
  "case_id": "CASE-2026-184721",
  "timestamp": "2026-09-16T15:06:00+05:30",
  "actor_role": "SUPERVISOR",
  "action": "PRESERVATION_REQUEST_APPROVED",
  "target_id": "REQ-001",
  "integrity_hash": "91ab...d291"
}
```

## 22. Supervisor Requests

### POST `/api/supervisor/requests/:requestId/decision`

Request:

```json
{
  "decision": "APPROVE",
  "reviewer": "Demo Supervisor",
  "review_note": "Evidence manifest reviewed."
}
```

The mock workflow must not represent an approval as an automatic freeze or legal filing.

## 23. System Status

### GET `/api/system/status`

```json
{
  "execution_mode": "FIXTURE_REPLAY",
  "chains": {
    "ethereum": {"status": "SIMULATED_ONLINE", "last_block": 23891442},
    "polygon": {"status": "SIMULATED_ONLINE", "last_block": 78452119},
    "tron": {"status": "SIMULATED_ONLINE", "last_block": 91283111},
    "bitcoin": {"status": "SIMULATED_ONLINE", "last_block": 913822}
  },
  "pipeline": {
    "fetch": "READY",
    "validate": "READY",
    "extract": "READY",
    "normalize": "READY",
    "deduplicate": "READY",
    "persist": "SIMULATED",
    "commit": "SIMULATED",
    "advance": "SIMULATED"
  }
}
```

## 24. Loading and Error Simulation

The mock service should optionally simulate:

- delayed transaction response;
- partial indexing;
- provider unavailable;
- trace timeout;
- maximum node termination;
- empty VASP result;
- insufficient recovery attribution.

These states should be deterministic via a frontend query flag or fixture configuration, for example:

`?scenario=provider_degraded`

## 25. Frontend Compatibility Rules

1. Never access fixture JSON directly from UI components.
2. All pages use the mock API service layer.
3. Components consume typed domain objects.
4. Keep `execution_mode` and `demo_data` visible in the UI wherever fixture data is shown.
5. Blockchain identifiers use monospace typography.
6. Verified, inferred, unresolved, partial and heuristic states are distinct.
7. Risk and attribution are separate objects.
8. Confirmed graph edges are solid; mixer-boundary heuristic edges are dashed.
9. Investigator actions are advisory; supervisor approval is separate.
10. The mock layer must be replaceable by production APIs without changing page/component contracts.
