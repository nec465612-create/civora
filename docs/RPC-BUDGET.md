# Frontend RPC Budget

Required only for a GenLayer-connected frontend. Studio deployment/testing does not use this artifact.

## Applicability

RPC_BUDGET_REVISION: INCOMPLETE
OFFICIAL_DOCS_CHECKED: INCOMPLETE
FRONTEND_SCOPE: INCOMPLETE

Use APPLICABLE or NOT_APPLICABLE: <checked dependency-boundary reason>.

## FRONTEND RPC BUDGET MATRIX

FRONTEND_MATRIX_STATUS: INCOMPLETE
MULTI_CLIENT_JUSTIFICATION: NOT_REQUIRED

Required before implementing or repairing any GenLayer-connected frontend, including read-only frontends.

| Screen/workflow | Request source | RPC method | Trigger | Cache key / TTL | In-flight dedupe | Invalidation | Poll interval / attempts | Retry/backoff/cancel | Planned maximum | Transaction count | Terminal/readback condition |
|---|---|---|---|---|---|---|---|---|---:|---:|---|

For a read-only frontend, record transaction count `0`; do not invent write requirements. If no GenLayer frontend exists, record `NOT APPLICABLE` and the checked dependency boundary.

## FRONTEND RPC BUDGET EVIDENCE

FRONTEND_EVIDENCE_STATUS: INCOMPLETE

Measure the exact deployed critical journeys before the applicable checkpoint and release.

| Screen/workflow | Request source/method | Actual requests | Cache hit/miss | In-flight dedupe | Poll attempts | Retry/delay | Invalidations | Readback calls | Actual transactions | Variance/result |
|---|---|---:|---|---|---:|---|---|---:|---:|---|

## Closure

- No unexplained multiple read clients.
- No render/Strict-Mode request amplification.
- Polling is bounded and tears down on hidden, unmounted, disconnected, settled and aborted states.
- `429`/transport retry is bounded, honors `Retry-After` when supplied and supports cancellation.
- A returned transaction hash is reconciled; no automatic or duplicate resubmission occurs.
- Mandatory finality, semantic execution and authoritative readback remain intact.
- Anonymous reviewer checked every applicable matrix/evidence section for the exact package.
