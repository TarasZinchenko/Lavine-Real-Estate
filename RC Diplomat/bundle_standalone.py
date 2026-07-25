#!/usr/bin/env python3
"""
bundle_standalone.py — compile diplomat.html + local CSS/JS + assets
into a single zero-dependency diplomat_standalone.html.

- <link rel="stylesheet" href="...">  -> inlined <style> (local files only)
- <script src="..."></script>         -> inlined <script> (local files only)
- assets/... media                    -> Base64 data URIs, embedded EXACTLY ONCE
                                       per unique file in a window.__MEDIA__
                                       registry; JS hydrates src/data-src/poster
                                       attributes at runtime (keeps file small).

Usage:  python bundle_standalone.py
Output: diplomat_standalone.html (next to diplomat.html)
"""
import base64
import json
import mimetypes
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "diplomat.html"
OUT = ROOT / "diplomat_standalone.html"
ASSET_RE = re.compile(r'assets/[A-Za-z0-9_\-.]+')
FONT_URL_RE = re.compile(r"url\('\.\./(assets/fonts/[^']+)'\)")


def inline_font(match: "re.Match") -> str:
    rel = match.group(1)
    path = ROOT / rel
    if not path.exists():
        print(f"WARNING: missing font {rel}", file=sys.stderr)
        return match.group(0)
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"url('data:font/woff2;base64,{b64}')"


def inline_css(match: "re.Match") -> str:
    href = match.group(1).split("?")[0]
    path = ROOT / href
    if not path.exists():
        print(f"WARNING: missing stylesheet {href}", file=sys.stderr)
        return match.group(0)
    css = path.read_text(encoding="utf-8")
    return f"<style>/* Inlined {href} */\n{css}\n</style>"


def inline_js(match: "re.Match") -> str:
    src = match.group(1).split("?")[0]
    if src.startswith(("http://", "https://", "//")):
        return match.group(0)  # leave external scripts untouched
    path = ROOT / src
    if not path.exists():
        print(f"WARNING: missing script {src}", file=sys.stderr)
        return match.group(0)
    js = path.read_text(encoding="utf-8")
    return f"<script>/* Inlined {src} */\n{js}\n</script>"


def build_registry(html: str) -> dict:
    """Collect unique asset refs (first-seen order) -> Base64 data URIs."""
    registry: dict = {}
    for match in ASSET_RE.finditer(html):
        rel = match.group(0)
        if rel in registry or rel.startswith("assets/fonts/"):
            continue  # fonts are substituted directly into CSS, skip registry
        path = ROOT / rel
        if not path.exists():
            print(f"WARNING: missing asset {rel}", file=sys.stderr)
            continue
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        registry[rel] = (
            f"data:{mime};base64,"
            + base64.b64encode(path.read_bytes()).decode("ascii")
        )
    return registry


def main() -> None:
    if not SRC.exists():
        sys.exit(f"Source not found: {SRC}")

    html = SRC.read_text(encoding="utf-8")

    # 1. Inline local stylesheets
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)"\s*/?>', inline_css, html)

    # 1b. Embed woff2 fonts referenced from inlined CSS as data URIs
    html = FONT_URL_RE.sub(inline_font, html)

    # 2. Inline local scripts
    html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)

    # 3. Embed each unique media asset once via a JS registry
    registry = build_registry(html)
    registry_script = (
        "<script>/* Media registry: each asset embedded once, hydrated by js/main.js */\n"
        "window.__MEDIA__=" + json.dumps(registry, separators=(",", ":")) + ";"
        "</script>"
    )
    if "</body>" not in html:
        sys.exit("No </body> tag found in source HTML")
    html = html.replace("</body>", registry_script + "\n</body>", 1)

    OUT.write_text(html, encoding="utf-8")

    size_mb = OUT.stat().st_size / (1024 * 1024)
    print(f"OK  {OUT.name}: {size_mb:.2f} MB, "
          f"{len(registry)} unique assets embedded")


if __name__ == "__main__":
    main()
