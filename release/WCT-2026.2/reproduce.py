#!/usr/bin/env python3
"""Reproduce and verify the frozen WCT-2026.2 cross-repository release."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable

import yaml

RELEASE_ID = "WCT-2026.2"
RELEASE_DIR = Path(__file__).resolve().parent
MANIFEST_PATH = RELEASE_DIR / "release-manifest.json"
REQUIREMENTS_PATH = RELEASE_DIR / "requirements.lock"


class ReleaseError(RuntimeError):
    pass


def run(
    command: Iterable[str],
    *,
    cwd: Path | None = None,
    env: dict[str, str] | None = None,
    capture: bool = False,
) -> str:
    command_list = [str(item) for item in command]
    print("+", " ".join(command_list), flush=True)
    result = subprocess.run(
        command_list,
        cwd=cwd,
        env=env,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.STDOUT if capture else None,
        check=False,
    )
    if result.returncode != 0:
        detail = f"\n{result.stdout}" if capture and result.stdout else ""
        raise ReleaseError(
            f"command failed ({result.returncode}): {' '.join(command_list)}{detail}"
        )
    return (result.stdout or "").strip()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def git_blob_sha1(path: Path) -> str:
    content = path.read_bytes()
    header = f"blob {len(content)}\0".encode("ascii")
    return hashlib.sha1(header + content).hexdigest()


def clone_pinned(name: str, record: dict[str, Any], destination: Path) -> str:
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    run(["git", "init", "--quiet"], cwd=destination)
    run(["git", "remote", "add", "origin", record["url"]], cwd=destination)
    run(
        ["git", "fetch", "--quiet", "--depth", "1", "origin", record["commit"]],
        cwd=destination,
    )
    run(["git", "checkout", "--quiet", "--detach", "FETCH_HEAD"], cwd=destination)
    actual = run(["git", "rev-parse", "HEAD"], cwd=destination, capture=True)
    if actual != record["commit"]:
        raise ReleaseError(f"{name}: expected commit {record['commit']}, got {actual}")
    return actual


def verify_source_files(
    name: str, record: dict[str, Any], repository: Path
) -> dict[str, str]:
    verified: dict[str, str] = {}
    for relative, expected in sorted(record.get("files", {}).items()):
        path = repository / relative
        if not path.is_file():
            raise ReleaseError(f"{name}: missing pinned source file {relative}")
        actual = git_blob_sha1(path)
        if actual != expected:
            raise ReleaseError(
                f"{name}:{relative}: expected Git blob {expected}, got {actual}"
            )
        verified[relative] = actual
    return verified


def copy_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination)


def check_counts(actual: dict[str, Any], expected: dict[str, int], label: str) -> None:
    normalized = {key: int(actual.get(key, 0)) for key in expected}
    if normalized != expected:
        raise ReleaseError(f"{label}: expected {expected}, got {normalized}")


def output_hashes(root: Path) -> dict[str, str]:
    return {
        path.relative_to(root).as_posix(): sha256(path)
        for path in sorted(root.rglob("*"))
        if path.is_file() and path.name != "reproduction-report.json"
    }


def current_orchestrator_commit() -> str | None:
    try:
        return run(["git", "rev-parse", "HEAD"], cwd=RELEASE_DIR.parents[1], capture=True)
    except ReleaseError:
        return None


def verify_cross_layer_coverage(
    sympy_repo: Path, site_repo: Path, expected: dict[str, Any]
) -> dict[str, int]:
    map_path = sympy_repo / "interoperability" / "lean_map.yaml"
    mapping = yaml.safe_load(map_path.read_text(encoding="utf-8"))
    canonical_mappings = {
        item["sympy_id"]
        for item in mapping.get("mappings", [])
        if item.get("registry") == "full"
    }
    typed = len(canonical_mappings)
    wanted_typed = int(expected["lean_typed_ids"])
    if typed != wanted_typed:
        raise ReleaseError(
            f"Lean interoperability map: expected {wanted_typed} canonical IDs, got {typed}"
        )

    total = int(expected["canonical_objects"])
    registry_only = total - typed
    wanted_registry_only = int(expected["lean_registry_only_ids"])
    if registry_only != wanted_registry_only:
        raise ReleaseError(
            f"Lean registry-only count: expected {wanted_registry_only}, got {registry_only}"
        )

    page = (site_repo / "lean" / "index.html").read_text(encoding="utf-8")
    required_fragments = (
        f"<strong>{total}</strong><span>canonical objects</span>",
        f"<strong>{typed}</strong><span>mapped definitions or declarations</span>",
        f"<strong>{registry_only}</strong><span>unmapped or incomplete</span>",
    )
    missing = [fragment for fragment in required_fragments if fragment not in page]
    if missing:
        raise ReleaseError("published Lean page is not synchronized with the frozen map")

    return {
        "canonical_objects": total,
        "lean_typed_ids": typed,
        "lean_registry_only_ids": registry_only,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--work-dir", type=Path, default=Path(f".reproduction/{RELEASE_ID}")
    )
    parser.add_argument(
        "--output-dir", type=Path, default=Path(f"release-output/{RELEASE_ID}")
    )
    parser.add_argument("--keep-work", action="store_true")
    parser.add_argument("--skip-install", action="store_true")
    args = parser.parse_args()

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if manifest.get("release_id") != RELEASE_ID:
        raise ReleaseError("unexpected release manifest")

    work_dir = args.work_dir.resolve()
    output_dir = args.output_dir.resolve()
    if work_dir.exists():
        shutil.rmtree(work_dir)
    if output_dir.exists():
        shutil.rmtree(output_dir)
    repos_dir = work_dir / "repos"
    repos_dir.mkdir(parents=True)
    output_dir.mkdir(parents=True)

    source_commits: dict[str, str] = {}
    verified_blobs: dict[str, dict[str, str]] = {}
    repo_paths: dict[str, Path] = {}
    for name, record in manifest["repositories"].items():
        destination = repos_dir / name
        source_commits[name] = clone_pinned(name, record, destination)
        verified_blobs[name] = verify_source_files(name, record, destination)
        repo_paths[name] = destination

    venv = work_dir / "venv"
    if args.skip_install:
        python = Path(sys.executable).resolve()
    else:
        run([sys.executable, "-m", "venv", str(venv)])
        python = venv / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
        run(
            [
                str(python),
                "-m",
                "pip",
                "install",
                "--disable-pip-version-check",
                "--requirement",
                str(REQUIREMENTS_PATH),
            ]
        )

    env = os.environ.copy()
    env.update(
        {
            "PYTHONHASHSEED": "0",
            "SOURCE_DATE_EPOCH": str(manifest["source_date_epoch"]),
            "TZ": "UTC",
            "LC_ALL": "C.UTF-8",
            "LANG": "C.UTF-8",
            "MPLCONFIGDIR": str(work_dir / "matplotlib"),
            "PYTHONDONTWRITEBYTECODE": "1",
            "PATH": str(python.parent) + os.pathsep + env.get("PATH", ""),
        }
    )

    geometry = repo_paths["geometry_of_resonance"]
    sympy_repo = repo_paths["wct_sympy"]
    lean_repo = repo_paths["wct_lean"]
    site_repo = repo_paths["scholar_site_baseline"]

    run(["make", "reproduce", f"PYTHON={python}"], cwd=geometry, env=env)
    run(["make", "verify", f"PYTHON={python}"], cwd=geometry, env=env)
    run(
        ["make", "reproduce", f"PYTHON={python}", f"GEOMETRY_DIR={geometry}"],
        cwd=sympy_repo,
        env=env,
    )
    run(["make", "reproduce", f"PYTHON={python}"], cwd=lean_repo, env=env)
    run([str(python), "scripts/validate_registry_sync.py"], cwd=site_repo, env=env)

    expected = manifest["expected"]
    coverage = verify_cross_layer_coverage(sympy_repo, site_repo, expected)

    compiled = json.loads(
        (site_repo / "compiled-registry.json").read_text(encoding="utf-8")
    )
    check_counts(compiled.get("counts", {}), expected["registry_counts"], "compiled registry")
    if sum(int(value) for value in compiled.get("counts", {}).values()) != int(
        expected["canonical_objects"]
    ):
        raise ReleaseError("compiled registry total is not 142")

    site_report = json.loads(
        (site_repo / "registry-validation-report.json").read_text(encoding="utf-8")
    )
    if site_report.get("valid") is not True:
        raise ReleaseError(f"site registry validation failed: {site_report.get('errors')}")

    sympy_report = json.loads(
        (sympy_repo / "build" / "reproducibility" / "reproducibility-report.json").read_text(
            encoding="utf-8"
        )
    )
    if sympy_report.get("status") != "PASS":
        raise ReleaseError(f"SymPy reproducibility failed: {sympy_report.get('failures')}")

    lean_report = json.loads(
        (lean_repo / "formal-source-hashes.json").read_text(encoding="utf-8")
    )
    if lean_report.get("status") != "PASS":
        raise ReleaseError(f"Lean source audit failed: {lean_report.get('failures')}")

    copy_tree(geometry / "reproducibility" / "artifacts", output_dir / "simulation")
    copy_tree(sympy_repo / "build" / "reproducibility", output_dir / "sympy")
    (output_dir / "lean").mkdir()
    shutil.copy2(
        lean_repo / "formal-source-hashes.json",
        output_dir / "lean" / "formal-source-hashes.json",
    )
    (output_dir / "site").mkdir()
    for relative in (
        "compiled-registry.json",
        "registry-validation-report.json",
        "lean/index.html",
    ):
        source = site_repo / relative
        destination = output_dir / "site" / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    shutil.copy2(MANIFEST_PATH, output_dir / "release-manifest.json")
    shutil.copy2(REQUIREMENTS_PATH, output_dir / "requirements.lock")

    for filename, wanted in sorted(expected["simulation_sha256"].items()):
        actual = sha256(output_dir / "simulation" / filename)
        if actual != wanted:
            raise ReleaseError(
                f"simulation/{filename}: expected SHA-256 {wanted}, got {actual}"
            )

    versions = {
        "python": run([str(python), "--version"], capture=True),
        "pip": run([str(python), "-m", "pip", "--version"], capture=True),
        "lean": run(["lean", "--version"], env=env, capture=True),
        "lake": run(["lake", "--version"], env=env, capture=True),
        "git": run(["git", "--version"], capture=True),
        "platform": platform.platform(),
    }
    package_freeze = run(
        [str(python), "-m", "pip", "freeze", "--all"], env=env, capture=True
    )
    (output_dir / "python-environment.txt").write_text(
        package_freeze + "\n", encoding="utf-8"
    )

    report = {
        "schema_version": "1.1.0",
        "release_id": RELEASE_ID,
        "status": "PASS",
        "source_commits": source_commits,
        "verified_source_blobs": verified_blobs,
        "orchestrator_commit": current_orchestrator_commit(),
        "environment": versions,
        "checks": {
            "registry_counts": expected["registry_counts"],
            "coverage": coverage,
            "simulation_sha256": expected["simulation_sha256"],
            "sympy_status": sympy_report.get("status"),
            "lean_status": lean_report.get("status"),
            "site_valid": site_report.get("valid"),
        },
        "scientific_boundaries": manifest["scientific_boundaries"],
    }
    report["output_sha256"] = output_hashes(output_dir)
    (output_dir / "reproduction-report.json").write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, indent=2, sort_keys=True))
    print(f"Frozen release reproduced successfully: {output_dir}")

    if not args.keep_work:
        shutil.rmtree(work_dir)


if __name__ == "__main__":
    try:
        main()
    except ReleaseError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
