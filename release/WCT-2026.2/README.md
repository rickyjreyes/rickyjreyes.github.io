# WCT-2026.2 synchronized frozen release

This release freezes the synchronized WCT research stack after the Lean expansion from 18 to 50 and then 62 canonical equation-specific mappings.

## Frozen state

- 142 of 142 canonical objects registered;
- 59 `PASS`, 27 `CONDITIONAL`, 26 `DEFINITION`, 30 `OPEN`, and 0 `FAIL` in the effective symbolic registry;
- 62 canonical IDs with maintained non-registry Lean typed support;
- 80 canonical IDs remaining registry-only;
- exact source commits and selected Git blob identities pinned in `release-manifest.json`;
- deterministic finite-band simulation artifacts checked by SHA-256.

Typed Lean support does not mean 62 unconditional proofs. It includes algebraic theorems, dimensional lemmas, finite analogues, conditional theorems, analytic contracts, definitions, counterexamples, and an unresolved proposition.

## Run locally

Prerequisites are Git, Make, Python 3.12 with `venv`, and Lean/`lake` 4.23.0.

```bash
make reproduce
```

The command clones the exact source commits, verifies selected source blobs, runs the maintained geometry, SymPy, Lean, and website validation gates, verifies the 62/80 formal-coverage partition, checks deterministic simulation hashes, and writes:

```text
release-output/WCT-2026.2/reproduction-report.json
```

## Docker

```bash
make docker-build
make docker-reproduce
```

## Nix

```bash
nix develop
make reproduce
```

or:

```bash
make nix-reproduce
```

## What a PASS means

A successful release run establishes that the pinned sources build and reproduce the declared maintained artifacts and cross-layer counts. It does not independently validate WCT as a physical theory.

- A SymPy `PASS` remains scoped to its encoded checker and assumptions.
- A Lean theorem proves only its typed statement under displayed hypotheses.
- Definitions and analytic contracts are not completed theorems.
- The deterministic simulation is a linear finite-band fixture, not a nonlinear confinement theorem or experiment.
- External mathematical review and experimental replication remain separate requirements.
