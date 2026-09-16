# Civora verification

This document binds the deployed Studio Dev contract to its source and records the live proof available before the public website release. The deployed application was built from the working tree at `2c8c4c334bc3ae3a285eacab98f5a93087138dc4`; the reviewed pre-public evidence commit is `36ec0100d26df6c38b643eccbb20246d2b2088f5`. The first Git commit preserving the deployed contract's exact bytes is [`4c31319`](https://github.com/nec465612-create/civora/commit/4c31319): earlier Git blobs normalized two CRLF endings. This is a Git representation correction, not a contract logic change or redeployment.

## Deployment and source parity

- Chain: GenLayer Studio Dev, `61997`; RPC: `https://studio-dev.genlayer.com/api`.
- Contract: `0x12c037C1F985c6f852bAbBc9F6ed6AfCd4342182`.
- [Deployment transaction](https://explorer-studio-dev.genlayer.com/tx/0x931797897c9665c6dee1799a962b2b84089bc7a4ee9a5f85b95b3c644962e8e1): `FINALIZED`, `FINISHED_WITH_RETURN`, leader `SUCCESS`, `MAJORITY_AGREE` (3 agree, 2 idle).
- `gen_getContractCode` returned 56,832 bytes, byte-equal to `contracts/civora.py` in the working tree and the Git blob at `4c31319`; SHA-256 `6C47353E90347AF9C7B3AACD37CD2E9371FBE6D8532CF48843F26646CB665646`. `.gitattributes` disables text normalization for this one contract file; the public raw file must retain the same size and hash.
- Deployer/upgrader: `0xD56647bBa764c1b673299baaEB356569a37961b8`; initial `get_upgrader` matched and `get_trigger_count` returned `0`. Constructor/linked-contract configuration: no linked contracts; the upgrader is the deployed actor.

## Live write-path evidence

All positive writes below finalized with semantic `FINISHED_WITH_RETURN`, leader `SUCCESS`, `MAJORITY_AGREE`, and the stated authoritative readback. The replay row is an expected semantic error, not a successful write. [Full secret-free evidence ledger](evidence/studio-e2e-36ec010.json) includes exact arguments and pre/post values.

| Case | Transaction | Authoritative consequence |
| --- | --- | --- |
| Create | [LIVE-01](https://explorer-studio-dev.genlayer.com/tx/0x66933e45f08e6a4f9f6b8758d0efe37c293192b2a9c9b2a2a2ade993f713afbf) | Owner nonce resolves `trg-0001`; count `1`; `DRAFT`. |
| Freeze | [LIVE-02](https://explorer-studio-dev.genlayer.com/tx/0x945883072b3b94a049ca2adadfda402ac0ccf43e5971146fc2f7372028a4c5da) | Specification retained; `FROZEN`. |
| First BLS observation | [LIVE-03](https://explorer-studio-dev.genlayer.com/tx/0xfe23143a798b55530685cb9efcc7c99937d65fb10ab44e94ee0a4a909bc4a3bd) | Comparable value `313.175`; `CONFIRMED_ACTIVE`; vintage count `1`. |
| Unchanged revalidation | [LIVE-04](https://explorer-studio-dev.genlayer.com/tx/0x6ed05a8754cc7ad6f709dcbbae33748ee3821ac3d5bc5bce091254a62d87e2da) | Same value/fingerprint/state; observation time advanced; vintage count remained `1`. |
| Consumer binding | [LIVE-05](https://explorer-studio-dev.genlayer.com/tx/0x1caa3d9dac51d7d98144710a8e5f70a4fb182acc9f34a3df87838e614383ea76) | Actor's `civora-demo` namespace resolves `trg-0001`. |
| Duplicate owner nonce | [LIVE-06](https://explorer-studio-dev.genlayer.com/tx/0xfe063994e761a1fc16296da5b346d3fb69d9f09d34e625dc3e5b863b7c02122f) | `FINALIZED`, `FINISHED_WITH_ERROR` with expected duplicate error; count, nonce, state, and vintage unchanged. |

The latest authoritative readback after the matrix was `CONFIRMED_ACTIVE`, scaled value `313175`, fingerprint `47391003df90802647651361ce12df900aab2a7097e537bf3abb150f93333bd4`, vintage count `1`, and consumer binding `trg-0001`. The six rows were attempted once each; no transaction was replayed to make the matrix pass.

## Reproducible checks

```powershell
$env:GENVM_VERSION='v0.6.0-rc5'
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .
$env:PYTHONIOENCODING='utf-8'
.\.venv\Scripts\genvm-lint.exe check contracts/civora.py
.\.venv\Scripts\python.exe -m pytest tests/test_civora.py -q
cd frontend
npm ci
npm test
npm run typecheck
npm run build
```

At the reviewed source: contract tests `54/54`; lint/schema and exact 17-method validation PASS; frontend tests `50/50`, typecheck and production build PASS. `tests/test_live_bls_read.py` is opt-in and is not counted as Studio E2E. The public Vercel URL, browser-wallet E2E and measured frontend RPC evidence are not yet available; [RPC-BUDGET.md](RPC-BUDGET.md) contains the pre-release bounds, not post-release measurements.

## Recovery and limitations

The contract is upgradable only while the recorded upgrader remains available. A local Studio UI reset does not by itself erase chain state; reconcile retained hashes and readbacks. Loss of the upgrader prevents claiming upgrade recovery. A Studio Dev chain reset requires a new deployment and repeat verification. Scope is limited to two allowlisted CPI series, monthly periods, and five vintages per trigger; inaccessible, malformed, or non-comparable evidence produces `UNRESOLVED`/`HOLD` rather than a verified value.
