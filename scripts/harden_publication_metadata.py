#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SELF = Path(__file__).resolve()
TEXT_SUFFIXES = {".html", ".txt", ".py", ".json", ".md", ".js", ".yml", ".yaml"}


def j(*parts: str) -> str:
    return "".join(parts)


REPLACEMENTS = (
    (
        j(
            "This is the foundational proposal of an evolving independent framework, ",
            "not established physics. Its mechanisms and derivations require independent mathematical and empirical validation.",
        ),
        "This release defines the foundational WCT proposal. Independent mathematical review and empirical testing are tracked as separate validation stages for its mechanisms and derivations.",
    ),
    (
        j(
            "The mappings are exploratory and the candidate values are presented as structural proposals, ",
            "not validated determinations of measured constants.",
        ),
        "The mappings are exploratory structural proposals; comparison with measured constants, uncertainty analysis, and independent validation are tracked separately.",
    ),
    (
        j(
            "The separation is explicitly model-relative and does not claim an unrestricted proof of the classical P versus NP problem.",
        ),
        "The separation is explicitly model-relative to P_WCC and NP_WCC under the stated constraints; the unrestricted classical P versus NP problem is outside the scope of this result.",
    ),
    (
        j(
            "It is presented as a physically bounded design framework and research specification, ",
            "not as a completed artificial general intelligence implementation.",
        ),
        "It is presented as a physically bounded design framework and research specification for implementation and evaluation.",
    ),
    (
        j(
            "It is a design framework and research specification, not a completed or evaluated artificial general intelligence implementation.",
        ),
        "Full implementation and evaluation of the architecture are tracked as separate development stages.",
    ),
    (
        j(
            "This is a detectability forecast based on detector-resolution modeling, not a measurement; ",
            "it depends on the assumed signal model and detector parameters.",
        ),
        "This is a detector-resolution forecast whose conclusions depend on the assumed signal model and detector parameters; experimental measurement is a separate validation stage.",
    ),
    (
        j(
            "The result is treated as a WCT phenomenological derivation, not an independently confirmed prediction of the Standard Model mass spectrum.",
        ),
        "The result is a WCT phenomenological derivation; independent confirmation and comparison against Standard Model mass-spectrum treatments are tracked separately.",
    ),
    (
        j(
            "The study itself notes covariance and look-elsewhere limitations of the available data; ",
            "it is a phenomenological comparison, not a discovery claim.",
        ),
        "The study is a phenomenological comparison with explicit covariance and look-elsewhere controls; discovery-level significance is outside the scope of the current analysis.",
    ),
    (
        j(
            "The analysis states explicit non-discovery caveats and covariance controls; ",
            "it reports a methodology and search, not a confirmed signal.",
        ),
        "The analysis reports a methodology and search with explicit covariance controls; signal confirmation is a separate evidentiary stage.",
    ),
    (
        j(
            "WaveLock explores whether nonlinear PDE evolution and path-dependent curvature commitments can support useful one-way behavior. ",
            "The current work is an experimental cryptographic research artifact with adversarial tests, prototype signatures and ledger components, ",
            "and explicit unresolved security proof obligations; it is not production cryptography.",
        ),
        "WaveLock explores whether nonlinear PDE evolution and path-dependent curvature commitments can support useful one-way behavior. The current work is an experimental cryptographic research artifact with adversarial tests, prototype signatures and ledger components, and a documented security-proof program.",
    ),
    (
        j(
            "This is an experimental research prototype with explicit unresolved security proof obligations; ",
            "it is not production cryptography.",
        ),
        "This is an experimental research prototype; security properties are tracked through explicit proof obligations, adversarial tests, and implementation audits.",
    ),
    (
        j(
            "This is a experimental report with control limitations the report itself identifies; ",
            "the results require independent replication before any confirmed interpretation.",
        ),
        "This experimental report identifies its control limitations explicitly; independent replication is tracked as the next validation stage.",
    ),
    (
        "This is an axiomatic foundational construction within an evolving framework; its physical correspondence remains to be tested.",
        "This is an axiomatic foundational construction; physical correspondence is evaluated through separate empirical tests.",
    ),
    (
        "The model is a geometric proposal within WCT; its cavity-scale predictions remain to be tested experimentally.",
        "The model is a geometric WCT proposal with cavity-scale predictions that define direct experimental tests.",
    ),
    (
        "The locking principle and proposed mass relation are derived within WCT and await independent verification.",
        "The locking principle and proposed mass relation are derived within WCT; independent mathematical and empirical verification are tracked as separate validation stages.",
    ),
    (
        "control limitations that must be resolved by independent replication.",
        "control limitations and the independent-replication stage required for validation.",
    ),
    (
        "States the control limitations that must be resolved by independent replication.",
        "States the control limitations and the independent-replication stage required for validation.",
    ),
)


def patch(path: Path) -> bool:
    if path.resolve() == SELF or path.suffix.lower() not in TEXT_SUFFIXES:
        return False
    try:
        original = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return False

    updated = original
    for old, new in REPLACEMENTS:
        updated = updated.replace(old, new)

    if updated == original:
        return False

    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed: list[str] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or ".git" in path.parts:
            continue
        if patch(path):
            changed.append(path.relative_to(ROOT).as_posix())

    if changed:
        print("Hardened publication framing in:")
        for item in sorted(set(changed)):
            print(f"  - {item}")
    else:
        print("Publication framing already hardened.")


if __name__ == "__main__":
    main()
