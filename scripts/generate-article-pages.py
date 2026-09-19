#!/usr/bin/env python3
"""Generate static article entry points from posts/index.json and blog.html."""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "posts" / "index.json"
TEMPLATE_PATH = ROOT / "blog.html"
SITE_URL = "https://raincoat.cc"
FORBIDDEN_DASHES = str.maketrans({"\u2013": "-", "\u2014": "-"})


def clean(value: str) -> str:
    return value.translate(FORBIDDEN_DASHES)


def article_image(slug: str, language: str) -> str:
    candidates = [ROOT / "posts" / f"{slug}.{language}.md"]
    candidates.append(ROOT / "posts" / f"{slug}.md")
    candidates.append(ROOT / "posts" / f"{slug}.en.md")
    for path in candidates:
        if not path.exists():
            continue
        match = re.search(r"!\[[^]]*]\((assets/[^)\s]+)\)", path.read_text())
        if match:
            return f"{SITE_URL}/{match.group(1)}"
    return f"{SITE_URL}/assets/og.png"


def localized(meta: dict[str, object], language: str, key: str) -> str:
    localized_key = f"{key}_en"
    if language == "en" and meta.get(localized_key):
        return str(meta[localized_key])
    return str(meta[key])


def replace_once(source: str, pattern: str, replacement: str) -> str:
    result, count = re.subn(pattern, replacement, source, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"Template pattern did not match exactly once: {pattern}")
    return result


def render(meta: dict[str, object], language: str) -> str:
    slug = str(meta["slug"])
    is_english = language == "en"
    depth = "../../../" if is_english else "../../"
    route = f"/articles/{slug}/" + ("en/" if is_english else "")
    canonical = f"{SITE_URL}{route}"
    title = clean(localized(meta, language, "title"))
    description = clean(localized(meta, language, "desc"))
    image = article_image(slug, language)
    locale = "en_US" if is_english else "ru_RU"
    title_html = html.escape(f"{title} - Raincoat", quote=True)
    description_html = html.escape(description, quote=True)

    page = TEMPLATE_PATH.read_text()
    page = replace_once(page, r'<html lang="[^"]+">', f'<html lang="{language}">')
    page = replace_once(page, r"<head>\n", f'<head>\n<base href="{depth}">\n')
    page = replace_once(page, r"<title[^>]*>.*?</title>", f"<title>{title_html}</title>")
    page = replace_once(
        page,
        r'<meta name="description"[^>]*>',
        f'<meta name="description" content="{description_html}">',
    )

    sharing = "\n".join(
        [
            f'<link rel="canonical" href="{canonical}">',
            f'<meta property="og:title" content="{html.escape(title, quote=True)}">',
            f'<meta property="og:description" content="{description_html}">',
            '<meta property="og:type" content="article">',
            f'<meta property="og:locale" content="{locale}">',
            f'<meta property="og:url" content="{canonical}">',
            f'<meta property="og:image" content="{image}">',
            '<meta name="twitter:card" content="summary_large_image">',
            f'<meta name="twitter:title" content="{html.escape(title, quote=True)}">',
            f'<meta name="twitter:description" content="{description_html}">',
            f'<meta name="twitter:image" content="{image}">',
        ]
    )
    page = replace_once(
        page,
        r'<meta property="og:title"[^>]*>\n<meta property="og:type"[^>]*>\n'
        r'<meta property="og:image"[^>]*>\n<meta name="twitter:card"[^>]*>',
        sharing,
    )

    alternate = f'<link rel="alternate" hreflang="ru" href="{SITE_URL}/articles/{slug}/">'
    if meta.get("en"):
        alternate += (
            "\n"
            f'<link rel="alternate" hreflang="en" href="{SITE_URL}/articles/{slug}/en/">'
        )
    page = page.replace(f'<link rel="canonical" href="{canonical}">', sharing.splitlines()[0] + "\n" + alternate, 1)

    body_attrs = f'data-post="{html.escape(slug, quote=True)}"'
    if meta.get("en"):
        body_attrs += f' data-entry-lang="{language}"'
    page = replace_once(page, r"<body>", f"<body {body_attrs}>")

    source_suffix = ".en.md" if is_english else ".md"
    if is_english:
        source_label = "Read the article without JavaScript"
        back_label = "All essays"
    else:
        source_label = "Прочитать статью без JavaScript"
        back_label = "Все эссе"
    fallback = "\n".join(
        [
            "<noscript>",
            '  <article class="reader active static-article-summary">',
            f'    <div class="reader-content"><h1>{html.escape(title)}</h1><p>{description_html}</p></div>',
            f'    <p><a class="back" href="posts/{slug}{source_suffix}">{source_label}</a></p>',
            f'    <p><a class="back" href="blog.html">{back_label}</a></p>',
            "  </article>",
            "</noscript>",
        ]
    )
    page = page.replace('<div class="wrap">', '<div class="wrap">\n\n' + fallback, 1)
    return clean(page)


def expected_pages() -> dict[Path, str]:
    posts = json.loads(INDEX_PATH.read_text())
    pages: dict[Path, str] = {}
    for meta in posts:
        slug = str(meta["slug"])
        pages[ROOT / "articles" / slug / "index.html"] = render(meta, "ru")
        if meta.get("en"):
            pages[ROOT / "articles" / slug / "en" / "index.html"] = render(meta, "en")
    return pages


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail when generated files are stale")
    args = parser.parse_args()
    stale: list[Path] = []
    for path, content in expected_pages().items():
        if args.check:
            if not path.exists() or path.read_text() != content:
                stale.append(path.relative_to(ROOT))
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_text() != content:
            path.write_text(content)
            print(path.relative_to(ROOT))
    if stale:
        print("Stale generated article pages:", file=sys.stderr)
        for path in stale:
            print(f"  {path}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

