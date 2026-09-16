# Frontend RPC Budget

Required only for a GenLayer-connected frontend. Studio deployment/testing does not use this artifact.

## Applicability

RPC_BUDGET_REVISION: c522a5ee810aa339d9dff352f951bbd285837a95
RPC_BUDGET_REVISION_KIND: APPLICATION_SOURCE
OFFICIAL_DOCS_CHECKED: https://docs.genlayer.com/developers/networks
FRONTEND_SCOPE: APPLICABLE
APPLICABILITY_REASON: The public registry, trigger detail, wallet writes, transaction finality polling, and reload recovery all call Studio Next through the frontend GenLayer clients.

## FRONTEND RPC BUDGET MATRIX

FRONTEND_MATRIX_STATUS: COMPLETE
MULTI_CLIENT_JUSTIFICATION: NOT_REQUIRED

Required before implementing or repairing any GenLayer-connected frontend, including read-only frontends.

| Screen/workflow | Request source | RPC method | Trigger | Cache key / TTL | In-flight dedupe | Invalidation | Poll interval / attempts | Retry/backoff/cancel | Planned maximum | Transaction count | Terminal/readback condition |
|---|---|---|---|---|---|---|---|---|---:|---:|---|
| Layer 1 | none | none | static navigation | static / permanent | n/a | release | none | none | 0 | 0 | static content rendered |
| Public registry | shared read client | get_triggers_page | load or manual refresh | method+args / 10s | yes | successful related write | none | 429 exponential backoff, abort on unmount | 3 | 0 | authoritative page response |
| Trigger detail | shared read client | get_trigger + get_vintages_page | route or manual refresh | method+args / 10s | yes | successful related write | none | 429 exponential backoff, abort on unmount | 4 | 0 | authoritative trigger and vintage response |
| Write journey | dedicated wallet client | selected contract write + gen_getTransaction | explicit user action | pending intent / until reconciled | single-flight | terminal outcome | 2s / 120 | bounded backoff, cancel only before hash | 122 | 1 | FINALIZED + semantic success + method readback |
| Reload recovery | shared read client | gen_getTransaction + method readback | saved pending hash | one hash / until reconciled | single-flight | terminal outcome | 2s / 120 | bounded backoff, no resubmit | 121 | 0 | terminal classification + authoritative readback |

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
