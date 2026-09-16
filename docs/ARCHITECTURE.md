# Architecture

## Product boundary

Civora verifies two allowlisted BLS CPI series for a fixed year and monthly period. A policy owner creates and freezes a trigger, validators observe official evidence, and later observations either reconfirm, revise, reverse, activate, or place the trigger on hold. Consumers may bind to a trigger and read its effective state; they do not control observations.

## Contract

The `Civora` Intelligent Contract exposes 17 public methods: seven writes and ten views. Trigger specifications, owner nonces, active canonical keys, consumer bindings, and up to five observation vintages are stored on-chain. Owner checks, replay-safe nonces, allowlists, decimal bounds, metadata bounds, and state-transition guards are enforced before mutation.

Official web evidence and model-assisted metadata comparison execute inside a GenLayer nondeterministic block. The validator reruns the observation and accepts only exact agreement across every consequential field. Canonical fingerprints exclude transport-varying metadata while binding the value, period, source identity, and footnotes; bounded catalog metadata separately gates comparability and fail-closed HOLD behavior.

## Frontend

The React frontend has two layers:

1. A public Civora landing surface that explains the product, verification model, network, and safety boundary.
2. An operational workbench for public reading, trigger ownership, permissionless refresh, consumer binding, and vintage auditing.

EIP-6963 discovers MetaMask, OKX Wallet, and Rabby explicitly. Reads use a bounded shared client; writes use the selected wallet provider and account. Pending transaction intents are journaled before submission, reconciled after timeout or reload, and protected against duplicate submission.

## Failure behavior

Unavailable or invalid evidence produces `UNRESOLVED` and `HOLD`. A timed-out frontend operation remains recoverable from its saved transaction hash. Success is recognized only after terminal receipt classification and method-specific authoritative readback.
