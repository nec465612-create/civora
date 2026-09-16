# Civora

Civora is a GenLayer application for verifying revisions to official public statistics before policy simulations rely on them. Its Intelligent Contract retrieves bounded U.S. Bureau of Labor Statistics evidence, reaches validator consensus on comparability and value, records an immutable vintage history, and fails closed to `HOLD` when evidence is unavailable or ambiguous.

## Network

- GenLayer Studio Next (development preview)
- Chain ID: `61997`
- RPC: `https://studio-dev.genlayer.com/api`
- Explorer: `https://explorer-studio-dev.genlayer.com`

The deployment address is intentionally unset until the independent contract is deployed. Copy `frontend/.env.example` to a local environment file only after deployment.

## Project structure

- `contracts/civora.py` — 17-method Intelligent Contract.
- `tests/` — contract, regression, and optional live-source tests.
- `frontend/` — two-layer React application: public information surface and operational workbench.
- `docs/` — design and bounded-RPC documentation.

## Verify locally

Use the repository's pinned Studio Next-compatible GenVM and testing environment:

```powershell
$env:GENVM_VERSION='v0.6.0-rc5'
genvm-lint check contracts/civora.py
python -m pytest tests/test_civora.py -q
cd frontend
npm test
npm run typecheck
npm run build
```

The live BLS test is opt-in and is not a substitute for Studio E2E evidence.

## Safety boundary

Civora is a research demonstration for public statistical policy simulation. It does not create financial entitlements, legal rights, benefit payments, or investment advice. A missing, malformed, non-comparable, or unavailable source never fabricates a result: the contract records an unresolved vintage and enters `HOLD`.
