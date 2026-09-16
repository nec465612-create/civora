# Civora

Civora verifies official U.S. consumer-price statistics before a public-policy simulation treats a statistical trigger as active. A GenLayer Intelligent Contract independently retrieves bounded Bureau of Labor Statistics (BLS) evidence, reaches validator consensus, records comparable vintages, and moves to `HOLD` rather than inventing an answer when evidence cannot be verified.

The contract is deployed on [GenLayer Studio Dev](https://explorer-studio-dev.genlayer.com). See the [deployment transaction](https://explorer-studio-dev.genlayer.com/tx/0x931797897c9665c6dee1799a962b2b84089bc7a4ee9a5f85b95b3c644962e8e1) and [live verification matrix](docs/VERIFICATION.md). The public website URL will be added after its separate Vercel deployment and end-to-end test; no production-web claim is made here yet.

## The trust problem

A policy administrator or data consumer should not be able to select a convenient CPI value, silently reinterpret a revised release, or treat an unavailable source as confirmation. Civora makes the consequential observation a validator-checked on-chain decision. It is a research demonstration for policy simulation, not a system for benefit payments, legal rights, or financial advice.

## How it works

1. A policy owner connects a supported wallet, creates a trigger for one of two allowlisted BLS CPI series, a year/month, comparison operator, and fixed-scale threshold, then freezes that specification.
2. Anyone can initiate the first observation or a later revalidation. Validators independently retrieve official BLS evidence and agree on the consequential value, comparability, provenance, and state transition before the contract records it.
3. A consumer may bind a namespace to a trigger; public readers can inspect its effective state, latest value, and up to five immutable observation vintages. A source outage, malformed response, or non-comparable revision yields `UNRESOLVED`/`HOLD`, not a fabricated active state.

The website has a public information/documentation layer and a separate operational workbench. It supports MetaMask, OKX Wallet, and Rabby through explicit provider selection; no Studio browser wallet is required. The exact deployment address is `0x12c037C1F985c6f852bAbBc9F6ed6AfCd4342182` on chain `61997`.

## Why GenLayer is essential

The contract's nondeterministic block retrieves official web evidence and performs bounded source/metadata comparison. Multiple validators rerun it and accept only agreement on the consequential fields. The agreed result changes on-chain trigger state and, when warranted, appends a vintage. A conventional single-server API could present a value, but it would leave the evidence choice and revision interpretation under one operator's control.

## Architecture and contract

`contracts/civora.py` is the deployed 17-method Intelligent Contract. It stores trigger specifications, owner nonces, active canonical keys, consumer bindings, and up to five vintages. The owner controls create/freeze/close; observation and revalidation are permissionless; consumers bind their own namespaces. BLS is the external source of statistical facts, while the contract is the authoritative source of trigger state and vintage history. Canonical fingerprints bind source-stable row evidence; bounded catalog metadata gates comparability separately. See [architecture](docs/ARCHITECTURE.md) and [network configuration](docs/NETWORK.md).

The React frontend (`frontend/`) has one shared, bounded read client and wallet-bound write clients. It journals submitted transaction hashes and prevents duplicate submission. After a timeout or reload, it continues verification of the saved transaction. It reports success only after terminal finality, semantic execution classification, and method-specific authoritative readback; uncertainty remains visible and retry is withheld until reconciliation. [RPC limits and planned measurements](docs/RPC-BUDGET.md) cover each critical journey.

## Run and verify locally

Use Python 3.13, the Studio Next-compatible GenVM runner, and the pinned frontend dependencies. The frontend needs the contract address in a local environment file:

```powershell
$env:GENVM_VERSION='v0.6.0-rc5'
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .
$env:PYTHONIOENCODING='utf-8'
.\.venv\Scripts\genvm-lint.exe check contracts/civora.py
.\.venv\Scripts\python.exe -m pytest tests/test_civora.py -q
Copy-Item frontend/.env.example frontend/.env.local
# Set VITE_CONTRACT_ADDRESS in frontend/.env.local to the deployment address above.
cd frontend
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

At the reviewed source revision, contract tests passed 54/54, GenVM lint/schema passed, and frontend tests passed 50/50 with clean typecheck/build. The opt-in live BLS read test is separate from the six completed Studio transactions. Exact commands, source parity, transaction hashes, and readbacks are in [verification](docs/VERIFICATION.md).

## Deployment, recovery, and limitations

Studio Dev uses RPC `https://studio-dev.genlayer.com/api` and chain ID `61997`. The deployed 56,832-byte contract was read back byte-equal to the public Git source at commit `4c31319`, with SHA-256 `6C47353E90347AF9C7B3AACD37CD2E9371FBE6D8532CF48843F26646CB665646`. The upgrader is the recorded deployer; if that authority is lost, an upgrade cannot be claimed. A Studio chain reset requires redeployment and renewed live verification. See [verification](docs/VERIFICATION.md).

The contract is limited to two BLS CPI series, monthly periods, five vintages per trigger, and the Studio Dev network. Studio Dev is a testing environment. The public Vercel release and its wallet/RPC E2E measurements are pending and are not represented by the Studio result.

No private key belongs in this repository or the browser app. The frontend's RPC and contract address are public configuration; write authority comes only from the selected user's wallet. Source content is untrusted input to validators, and malformed, ambiguous, or unavailable evidence fails closed.
