#!/usr/bin/env python3
"""Reproduce and verify the frozen WCT-2026.1 cross-repository release."""
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
        raise ReleaseError(f"command failed ({result.returncode}): {' '.join(command_list)}{detail}")
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


def canonical_json_sha256(value: Any) -> str:
    encoded = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def clone_pinned(name: str, record: dict[str, Any], destination: Path) -> str:
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    run(["git", "init", "--quiet"], cwd=destination)
    run(["git", "remote", "add", "origin", record["url"]], cwd=destination)
    run(["git", "fetch", "--quiet", "--depth", "1", "origin", record["commit"]], cwd=destination)
    run(["git", "checkout", "--quiet", "--detach", "FETCH_HEAD"], cwd=destination)
    actual = run(["git", "rev-parse", "HEAD"], cwd=destination, capture=True)
    if actual != record["commit"]:
        raise ReleaseError(f"{name}: expected commit {record['commit']}, got {actual}")
    return actual


def verify_source_files(name: str, record: dict[str, Any], repository: Path) -> dict[str, str]:
    verified: dict[str, str] = {}
    for relative, expected in sorted(record.get("files", {}).items()):
        path = repository / relative
        if not path.is_file():
            raise ReleaseError(f"{name}: missing pinned source file {relative}")
        actual = git_blob_sha1(path)
        if actual != expected:
            raise ReleaseError(f"{name}:{relative}: expected git blob {expected}, got {actual}")
        verified[relative] = actual
    return verified


def copy_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination)


def check_counts(actual: dict[str, Any], expected: dict[str, int], label: str) -> None:
    normalized = {key: int(actual.get(key, 0)) for key in expected}
    if normalized != expected:
        raise ReleaseError(f"{label}: expected counts {expected}, got {normalized}")


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


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--work-dir", type=Path, default=Path(".reproduction/WCT-2026.1"))
    parser.add_argument("--output-dir", type=Path, default=Path("release-output/WCT-2026.1"))
    parser.add_argument("--keep-work", action="store_true")
    parser.add_argument("--skip-install", action="store_true")
    args = parser.parse_args()

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if manifest.get("release_id") != "WCT-2026.1":
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
        run([str(python), "-m", "pip", "install", "--disable-pip-version-check", "--requirement", str(REQUIREMENTS_PATH)])

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
        }
    )
    env["PATH"] = str(python.parent) + os.pathsep + env.get("PATH", "")

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

    copy_tree(geometry / "reproducibility" / "artifacts", output_dir / "simulation")
    copy_tree(sympy_repo / "build" / "reproducibility", output_dir / "sympy")
    (output_dir / "lean").mkdir()
    shutil.copy2(lean_repo / "formal-source-hashes.json", output_dir / "lean" / "formal-source-hashes.json")
    (output_dir / "site").mkdir()
    for relative in (
        "compiled-registry.json",
        "research-corpus.json",
        "registry-validation-report.json",
        "equations/equations.json",
    ):
        source = site_repo / relative
        destination = output_dir / "site" / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    shutil.copy2(MANIFEST_PATH, output_dir / "release-manifest.json")
    shutil.copy2(REQUIREMENTS_PATH, output_dir / "requirements.lock")

    expected = manifest["expected"]
    for filename, wanted in sorted(expected["simulation_sha256"].items()):
        actual = sha256(output_dir / "simulation" / filename)
        if actual != wanted:
            raise ReleaseError(f"simulation/{filename}: expected SHA-256 {wanted}, got {actual}")

    sympy_report = json.loads((output_dir / "sympy" / "reproducibility-report.json").read_text(encoding="utf-8"))
    if sympy_report.get("status") != "PASS":
        raise ReleaseError(f"SymPy reproducibility report failed: {sympy_report.get('failures')}")
    semantic_hash = sympy_report.get("generated_registry_semantic_sha256")
    if semantic_hash != expected["sympy_registry_semantic_sha256"]:
        raise ReleaseError(f"SymPy semantic hash: expected {expected['sympy_registry_semantic_sha256']}, got {semantic_hash}")

    lean_report = json.loads((output_dir / "lean" / "formal-source-hashes.json").read_text(encoding="utf-8"))
    if lean_report.get("status") != "PASS":
        raise ReleaseError(f"Lean source audit failed: {lean_report.get('failures')}")
    lean_map_hash = canonical_json_sha256(lean_report["source_sha256"])
    if lean_map_hash != expected["lean_source_map_sha256"]:
        raise ReleaseError(f"Lean source map: expected {expected['lean_source_map_sha256']}, got {lean_map_hash}")
    if lean_report.get("lake_manifest_sha256") != expected["lean_lake_manifest_sha256"]:
        raise ReleaseError(
            "Lean lake manifest: expected "
            f"{expected['lean_lake_manifest_sha256']}, got {lean_report.get('lake_manifest_sha256')}"
        )

    site_report = json.loads((output_dir / "site" / "registry-validation-report.json").read_text(encoding="utf-8"))
    if site_report.get("valid") is not True:
        raise ReleaseError(f"site registry validation failed: {site_report.get('errors')}")
    check_counts(site_report.get("counts", {}), expected["registry_counts"], "site registry")
    compiled = json.loads((output_dir / "site" / "compiled-registry.json").read_text(encoding="utf-8"))
    check_counts(compiled.get("counts", {}), expected["registry_counts"], "compiled registry")

    versions = {
        "python": run([str(python), "--version"], capture=True),
        "pip": run([str(python), "-m", "pip", "--version"], capture=True),
        "lean": run(["lean", "--version"], env=env, capture=True),
        "lake": run(["lake", "--version"], env=env, capture=True),
        "git": run(["git", "--version"], capture=True),
        "platform": platform.platform(),
    }
    package_freeze = run([str(python), "-m", "pip", "freeze", "--all"], env=env, capture=True)
    (output_dir / "python-environment.txt").write_text(package_freeze + "\n", encoding="utf-8")

    report = {
        "schema_version": "1.0.0",
        "release_id": manifest["release_id"],
        "status": "PASS",
        "source_commits": source_commits,
        "verified_source_blobs": verified_blobs,
        "orchestrator_commit": current_orchestrator_commit(),
        "environment": versions,
        "checks": {
            "registry_counts": expected["registry_counts"],
            "sympy_registry_semantic_sha256": semantic_hash,
            "lean_source_map_sha256": lean_map_hash,
            "lean_lake_manifest_sha256": lean_report["lake_manifest_sha256"],
            "simulation_sha256": expected["simulation_sha256"],
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
