# WCT-2026.1 frozen canonical release

This release freezes the WCT research compiler across four repositories and provides one command that rebuilds and verifies the maintained layers:

- canonical equation source and deterministic finite-band simulation;
- complete SymPy audit and effective registry compilation;
- Lean 4 kernel build and formal-source manifest;
- synchronized public registry surfaces and publication traceability validation;
- regenerated simulation table, numerical field, summary, and figure;
- expected source and artifact hashes.

## Run locally

Prerequisites are Git, Make, Python 3.12 with `venv`, and Lean/`lake` 4.23.0.

```bash
make reproduce
```

The command clones the exact source commits recorded in `release-manifest.json`, verifies selected source files by Git blob hash, creates an isolated Python environment, runs all maintained checks, and writes:

```text
release-output/WCT-2026.1/reproduction-report.json
```

## Docker

```bash
make docker-build
make docker-reproduce
```

The Docker environment uses the dated Ubuntu Noble image `noble-20260509.1`, a commit-pinned elan installer, Lean 4.23.0, and the exact Python package versions in `requirements.lock`.

## Nix

The root `flake.nix` pins nixpkgs to a single commit.

```bash
nix develop
make reproduce
```

or:

```bash
make nix-reproduce
```

## What a PASS means

A successful release run establishes that the declared source commits build and produce the expected maintained artifacts. It does not independently validate WCT as a physical theory. In particular:

- symbolic PASS values remain scoped to their declared checker and assumptions;
- Lean builds establish only the encoded formal declarations;
- the deterministic simulation is a linear finite-band reference fixture, not a nonlinear selection theorem or physical experiment;
- external replication remains a separate requirement.
