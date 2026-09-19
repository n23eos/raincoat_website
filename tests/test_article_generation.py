from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ArticleGenerationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.posts = json.loads((ROOT / "posts" / "index.json").read_text())

    def test_generated_pages_are_current(self) -> None:
        result = subprocess.run(
            ["python3", "scripts/generate-article-pages.py", "--check"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_each_page_has_static_sharing_metadata_and_fallback(self) -> None:
        for post in self.posts:
            variants = [("ru", ROOT / "articles" / post["slug"] / "index.html")]
            if post.get("en"):
                variants.append(("en", ROOT / "articles" / post["slug"] / "en" / "index.html"))
            for language, path in variants:
                with self.subTest(slug=post["slug"], language=language):
                    source = path.read_text()
                    title = post.get("title_en") if language == "en" else post["title"]
                    self.assertIn(f'<meta property="og:url" content="https://raincoat.cc/articles/', source)
                    self.assertIn('<meta property="og:image" content="https://raincoat.cc/', source)
                    self.assertIn('<meta name="twitter:image" content="https://raincoat.cc/', source)
                    self.assertIn(f'<meta property="og:title" content="{title}', source)
                    self.assertIn("<noscript>", source)
                    self.assertIn(f'data-post="{post["slug"]}"', source)
                    self.assertNotIn('data-i18n="blog.meta.title"', source)
                    self.assertNotIn("\u2013", source)
                    self.assertNotIn("\u2014", source)

    def test_blog_keeps_legacy_route_and_uses_article_routes(self) -> None:
        source = (ROOT / "blog.html").read_text()
        self.assertIn("new URLSearchParams(location.search).get('post')", source)
        self.assertIn("route='articles/'", source)


if __name__ == "__main__":
    unittest.main()
