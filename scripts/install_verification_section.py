#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
FRAGMENT = ROOT / "verification-section.html"


def insert_once(text: str, marker: str, insertion: str, label: str) -> str:
    if insertion.strip() in text:
        return text
    if marker not in text:
        raise RuntimeError(f"Missing {label} marker: {marker!r}")
    return text.replace(marker, insertion + marker, 1)


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    fragment = FRAGMENT.read_text(encoding="utf-8").rstrip() + "\n\n"

    css_link = '  <link rel="stylesheet" href="verification.css">\n'
    text = insert_once(
        text,
        '  <script type="application/ld+json">',
        css_link,
        "head",
    )

    nav_link = '        <a href="#verification">Verification</a>\n'
    text = insert_once(
        text,
        '        <a href="#start">Start here</a>',
        nav_link,
        "navigation",
    )

    if 'id="verification"' not in text:
        start_marker = '    <section class="section section-shell" id="start" aria-labelledby="start-title">'
        if start_marker not in text:
            raise RuntimeError("Missing Start here section marker")
        text = text.replace(start_marker, fragment + start_marker, 1)

    footer_link = '        <a href="#verification">Equation audit</a>\n'
    text = insert_once(
        text,
        '        <a href="#publications">Publications</a>',
        footer_link,
        "footer",
    )

    INDEX.write_text(text, encoding="utf-8")
    print("Installed WCT verification section in index.html")


if __name__ == "__main__":
    main()
