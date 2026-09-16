# Source Verification Reuse Map

This is the revision-bound Stage 2 inheritance and Build implementation map for Civora's BLS source-verification path. It preserves the approved baseline behavior while replacing network/runtime identity only. Application source revision: `468f3f266387979bb2bdeb3e5094766199d2309c`; contract SHA-256: `34244EE71EBB9225A1FA59F45D0637CCBBC6D42C52E3B47DD6112E95A768D989` (56,707 bytes).

## Source feasibility record

| Question | Civora binding |
|---|---|
| Publisher | U.S. Bureau of Labor Statistics (BLS), `https://www.bls.gov/` |
| Credential-free validator access | `https://api.bls.gov/publicAPI/v2/timeseries/data/<series>?startyear=<year>&endyear=<year>` plus the official series report at `https://data.bls.gov/timeseries/<series>` |
| Canonical identity | Strictly allowlisted BLS series ID + year + monthly period (`M01`-`M12`) |
| Point-in-time semantics | BLS does not expose a version-addressed snapshot in this flow. Each consensus run retrieves the current official row; immutable on-chain vintages preserve observations and later revisions. |
| Provenance chain | Contract-built allowlisted URL → exact series-ID match → exactly one year/period row → bounded official metadata report → canonical evidence fingerprint |
| Bounds | Two exact HTTPS origins/paths constructed internally; 128,000-byte API/report acceptance limits; two series; one year; one period; one matching row; 8 catalog entries; 5 footnotes |
| Deterministic derivation | URL, source identity, unique row, fixed-scale value, bounded/sorted footnotes, source-stable canonical JSON, SHA-256 fingerprint, threshold result and state transition; bounded catalog metadata separately gates comparability |
| LLM judgment | Only bounded BLS metadata extraction and comparison with the prior verified vintage; identifiers, values, fingerprints and state transitions are not model-authored |
| `UNRESOLVED` | Transport/status/body/UTF-8/size failure, invalid source status, absent/wrong/duplicate row, malformed value, unresolved footnote marker, invalid metadata/model output, or validator disagreement |
| Judge repeatability | Public registry/detail frontend plus `get_trigger`, `get_vintage`, `get_vintages_page`, and `get_effective_trigger_state` authoritative reads |

## Required architecture

```text
validated allowlisted series/year/period
  -> contract-built exact BLS API URL
  -> exact series identity and unique row extraction
  -> bounded official series-report metadata/fallback retrieval
  -> deterministic schema, value, footnote and provenance checks
  -> canonical evidence and SHA-256 fingerprint
  -> bounded untrusted-data metadata/comparability evaluation
  -> exact observation schema validation
  -> independent validator refetch and full consequential equality
  -> fail-closed HOLD or deterministic trigger transition
  -> finalized successful transaction
  -> authoritative trigger/vintage readback
```

## Stage 2 reuse map and Build binding

| Required pattern | Reused structure / source-specific replacement | Implemented source path/symbol | Regression test path/name | Verification result/evidence | Status |
|---|---|---|---|---|---|
| Exact identity or point-in-time retrieval | Direct exact BLS series/year endpoint; monthly period is selected uniquely; immutable vintages preserve each retrieval | `contracts/civora.py::_bls_url`, `_execute_bls_observation` | `tests/test_civora.py::test_missing_period_causes_hold`; `test_duplicate_period_causes_hold`; `test_wrong_series_id_causes_hold` | Canonical contract suite: 54 passed; live proof reserved for Studio E2E | VERIFIED |
| Index-to-document provenance | No fuzzy index is used. Strict user inputs construct the exact canonical series resource, then series ID and row cardinality are checked | `ALLOWLISTED_SERIES`, `_validate_series`, `_execute_bls_observation` | `test_series_allowlist`; `test_wrong_series_id_causes_hold`; `test_duplicate_period_causes_hold` | 54-test suite passed; arbitrary URLs/IDs cannot enter the source set | VERIFIED |
| Host/path allowlist and bounded response | URLs are internally built for exact BLS API/report paths; API and report bodies have 128,000-byte acceptance limits | `_bls_url`, `_bls_metadata_url`, `MAX_API_RESPONSE_LEN`, `MAX_METADATA_RESPONSE_LEN` | `test_oversized_series_report_fails_safe_to_hold`; `test_oversized_api_and_unavailable_fallback_fail_closed`; `test_series_allowlist` | 54-test suite passed; no user-supplied URL; oversize fails closed | VERIFIED |
| HTTP/schema/document validation | Require HTTP 200, non-empty bounded bytes, strict UTF-8/JSON, success status, exact series and one row; API footnotes require a list of exact bounded objects, with `{}` as the sole no-footnote sentinel | `_execute_bls_observation`, `_extract_series_page_record` | `test_rate_limit_429_causes_hold`; `test_bls_api_status_failure`; `test_malformed_decimal_causes_hold`; `test_series_page_fallback_rejects_unresolved_footnote_marker`; `test_api_success_metadata_rejects_invalid_utf8_or_byte_oversize`; `test_malformed_api_footnotes_fail_closed`; `test_empty_api_footnote_sentinel_normalizes_to_empty_list` | 54-test suite passed; invalid bytes/UTF-8/footnote evidence returns `UNRESOLVED`/HOLD | VERIFIED |
| Canonicalization and fingerprint | Sorted compact JSON over source-stable row evidence, including value, source identity, period and footnotes; transport-varying catalog metadata is excluded from dedupe but separately gates comparability/HOLD | `_canonical_json`, `canonical_evidence` in `_execute_bls_observation` | `test_revalidate_identical_fingerprint_refreshes_ttl_without_duplicate`; `test_series_page_fallback_preserves_unchanged_fingerprint`; `test_series_page_fallback_preserves_nonempty_footnote_fingerprint` | 54-test suite passed; stable API/page fingerprint; changed row evidence creates a revision | VERIFIED |
| Untrusted-data and prompt-injection boundary | Only bounded official excerpts enter prompts with explicit untrusted-data instruction; deterministic identity/value remain outside model control | `_bounded_metadata_excerpt`; metadata/comparability prompts | `test_live_sized_metadata_is_deterministically_bounded_before_llm`; `test_metadata_prompt_injection_cannot_change_identity_or_schema`; `test_malformed_model_output_fails_closed` | 54-test suite passed; embedded instructions cannot change identity/schema; invalid model result cannot authorize a conclusive transition | VERIFIED |
| Exact output schema | Observation key set is exact; bounded enums/fields are independently recomputed and compared | `OBSERVATION_KEYS`; `_execute_bls_observation.validate` | `test_validator_accepts_agreement_and_rejects_consequential_disagreement`; `test_malformed_model_output_fails_closed` | 54-test suite passed; extra/missing or unequal consequential output is rejected | VERIFIED |
| Independent refetch and substantive equality | Validator reruns the full retrieval/evaluation and compares every consequential field | `_execute_bls_observation.evaluate`, `.validate`, `gl.vm.run_nondet` | `test_validator_accepts_agreement_and_rejects_consequential_disagreement` | 54-test suite passed; disagreement cannot authorize state | VERIFIED |
| Fail-closed state transition | Source/model/consensus uncertainty records HOLD and never active/inactive confirmation | `observe_initial`, `revalidate_trigger` | `test_transport_failure_causes_hold_never_false_reversal`; `test_unknown_comparability_causes_hold`; `test_material_definition_change_causes_hold` | 54-test suite passed; no conclusive consequence from unresolved evidence | VERIFIED |
| Bounded retry/cooldown and duplicate prevention | No automatic contract retry exists. Each retry is an explicit signed action; five-vintage cap, nonce/canonical-key guards, unchanged-fingerprint dedupe, and frontend single-flight journal bound repetition | `MAX_VINTAGES`, `create_trigger`, `revalidate_trigger`; `frontend/src/services/writeManager.ts` | `test_owner_nonce_replay_rejected`; `test_active_canonical_duplicate_rejected`; `test_max_triggers_cap`; frontend write/recovery tests | Contract 54/54 and frontend 50/50 passed; one wallet submission per intent; unchanged evidence does not append a vintage | VERIFIED |
| Finality, semantic success and authoritative readback | Frontend classifies GenLayer transaction finality/execution then performs method-specific reads before journal release | `frontend/src/services/writeManager.ts`, `readClient.ts` | `frontend/src/__tests__/writeManager.test.ts`; `readClient.test.ts` | Frontend 50/50, typecheck and production build passed; live evidence reserved for Studio/Vercel gates | VERIFIED |

## Source-verification pattern deviations

### Direct exact resource instead of index-to-document discovery

- Original pattern: query a bounded index, extract canonical IDs, then refetch exact documents.
- Verified incompatibility: the approved BLS workflow starts from one strict allowlisted series ID and a validated year/month; the official API URL is already the exact canonical series resource and no discovery index participates.
- Equal-or-stronger replacement: construct the URL internally, reject non-allowlisted series, require the returned series ID to match, and require exactly one matching year/month row.
- Affected tests: series allowlist, wrong series, missing period, and duplicate period regressions listed above.
- Reviewer acceptance: pending the exact `PRE_DEPLOY` verdict for this revision.

### No version-addressed BLS snapshot

- Original pattern: use a dated/version endpoint when point-in-time truth is available.
- Verified incompatibility: these public BLS endpoints expose the current official historical row, not immutable prior releases at versioned URLs.
- Equal-or-stronger replacement within product scope: every successful retrieval is fingerprinted and stored as an immutable on-chain vintage; subsequent retrievals deterministically classify unchanged or revised evidence and preserve both states.
- Affected tests: unchanged refresh, revised-above, revised-below, activated-by-revision, HOLD recovery, and canonical fingerprint regressions.
- Reviewer acceptance: pending the exact `PRE_DEPLOY` verdict for this revision.

No other structural deviation is claimed.
