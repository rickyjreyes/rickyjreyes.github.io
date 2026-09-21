#!/usr/bin/env python3
"""Submit changed public URLs for rickyjreyes.github.io to IndexNow.

The workflow passes a newline-delimited list of repository paths changed by a
push. This script maps public artifacts to their canonical site URLs and sends
only those changed URLs to the IndexNow bulk endpoint.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE_URL = "https://rickyjreyes.github.io"
HOST = "rickyjreyes.github.io"
ENDPOINT = "https://api.indexnow.org/indexnow"

PARENT_PAGE_MAP = {
    "data/publications.json": {"/", "/publications/"},
    "data/publication_traceability.json": {"/publications/", "/priority/"},
    "priority/priority.json": {"/priority/"},
    "priority/external-convergence.json": {"/overlap/", "/priority/"},
    "priority/evidence-panel.js": {"/priority/"},
    "overlap/relationship-data.js": {"/overlap/"},
    "site-nav.js": {"/"},
}

PUBLIC_EXTENSIONS = {
    ".html", ".json", ".xml", ".txt", ".cff", ".bib", ".ris",
}

PRIVATE_PREFIXES = (
    ".git",
    ".github/",
    "scripts/",
)


def canonical_url_for_path(path: str) -> str | None:
    path = path.replace("\\", "/").lstrip("./")
    if not path or path.startswith(PRIVATE_PREFIXES):
        return None

    if path == "index.html":
        return f"{BASE_URL}/"

    if path.endswith("/index.html"):
        directory = path[: -len("index.html")]
        return f"{BASE_URL}/{directory}"

    suffix = Path(path).suffix.lower()
    if suffix in PUBLIC_EXTENSIONS:
        return f"{BASE_URL}/{path}"

    return None


def urls_for_changed_path(path: str, key_filename: str) -> set[str]:
    path = path.replace("\\", "/").lstrip("./")
    urls: set[str] = set()

    if path == key_filename:
        return urls

    direct = canonical_url_for_path(path)
    if direct:
        urls.add(direct)

    for parent in PARENT_PAGE_MAP.get(path, set()):
        urls.add(f"{BASE_URL}{parent}")

    if path.startswith("overlap/overlap-data-") and path.endswith(".js"):
        urls.add(f"{BASE_URL}/overlap/")

    if path.startswith("tools/glossary/") and path.endswith(".js"):
        urls.add(f"{BASE_URL}/tools/glossary/")

    if path.startswith("publications/") and path.endswith(".html"):
        urls.add(f"{BASE_URL}/publications/")

    if path.startswith("equations/") and path.endswith((".json", ".html")):
        urls.add(f"{BASE_URL}/equations/")

    if path.startswith("researcher/") and path.endswith(".html"):
        urls.add(f"{BASE_URL}/researcher/")

    return urls


def read_changed_paths(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def wait_for_public_key(key: str, key_url: str, timeout_seconds: int) -> None:
    deadline = time.monotonic() + max(0, timeout_seconds)
    last_error = "not checked"

    while True:
        try:
            req = urllib.request.Request(
                key_url,
                headers={"User-Agent": "rickyjreyes-indexnow/1.0"},
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                body = response.read().decode("utf-8").strip()
                if response.status == 200 and body == key:
                    print(f"IndexNow key verified at {key_url}")
                    return
                last_error = (
                    f"HTTP {response.status}; body did not match expected key"
                )
        except Exception as exc:
            last_error = str(exc)

        if time.monotonic() >= deadline:
            raise RuntimeError(
                f"IndexNow key was not publicly verifiable at {key_url}: {last_error}"
            )
        time.sleep(5)


def submit_urls(key: str, key_url: str, urls: list[str]) -> int:
    payload = {
        "host": HOST,
        "key": key,
        "keyLocation": key_url,
        "urlList": urls,
    }
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        ENDPOINT,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "rickyjreyes-indexnow/1.0",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            status = response.status
            response_body = response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        status = exc.code
        response_body = exc.read().decode("utf-8", errors="replace")

    print(f"IndexNow response: HTTP {status}")
    if response_body.strip():
        print(response_body.strip())

    if status not in (200, 202):
        raise RuntimeError(f"IndexNow submission failed with HTTP {status}")
    return status


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--changed-file-list",
        type=Path,
        required=True,
        help="Newline-delimited repository paths changed by the push.",
    )
    parser.add_argument(
        "--key-file",
        type=Path,
        required=True,
        help="Root IndexNow key file.",
    )
    parser.add_argument(
        "--wait-for-key-seconds",
        type=int,
        default=180,
        help="How long to wait for GitHub Pages to expose the key file.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    key = args.key_file.read_text(encoding="utf-8").strip()
    key_filename = args.key_file.name
    key_url = f"{BASE_URL}/{key_filename}"

    changed_paths = read_changed_paths(args.changed_file_list)
    urls: set[str] = set()
    for changed_path in changed_paths:
        urls.update(urls_for_changed_path(changed_path, key_filename))

    if not urls:
        print("No changed public URLs require IndexNow notification.")
        return 0

    ordered_urls = sorted(urls)
    print("Changed public URLs to submit:")
    for url in ordered_urls:
        print(f"  {url}")

    wait_for_public_key(key, key_url, args.wait_for_key_seconds)
    submit_urls(key, key_url, ordered_urls)
    return 0


if __name__ == "__main__":
    sys.exit(main())
