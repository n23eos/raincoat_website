"""Guard published routes, case anchors and contact links against regressions."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://portfolio.invalid/'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = []
        self.links = []
        self.base = urljoin(ORIGIN, path.relative_to(ROOT).as_posix())
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'base':
            self.base = urljoin(self.base, attrs.get('href', ''))
        elif tag in ('a', 'link', 'script', 'img', 'video', 'source'):
            for attr in ('href', 'src', 'poster', 'data-src'):
                if attrs.get(attr):
                    self.links.append(attrs[attr])


class SiteIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {p: Page(p) for p in list(ROOT.glob('*.html')) + list((ROOT / 'articles').rglob('index.html'))}

    def test_local_assets_and_fragment_targets_exist(self):
        for path, page in self.pages.items():
            for href in page.links:
                with self.subTest(page=str(path.relative_to(ROOT)), href=href):
                    url = urlsplit(urljoin(page.base, href))
                    if url.netloc != 'portfolio.invalid' or url.scheme not in ('http', 'https'):
                        continue
                    target = ROOT / unquote(url.path).lstrip('/')
                    if target.is_dir():
                        target /= 'index.html'
                    self.assertTrue(target.is_file(), f'Missing local file: {target}')
                    if url.fragment and target.suffix == '.html':
                        parsed = self.pages.get(target) or Page(target)
                        self.assertIn(unquote(url.fragment), parsed.ids)

    def test_showcase_links_go_directly_to_products(self):
        text = (ROOT / 'index.html').read_text()
        showcase = text.split('<div class="project-showcase">', 1)[1].split('</section>', 1)[0]
        lanes = showcase.split('<div class="project-lane">')[1:]
        self.assertEqual(len(lanes), 2)
        self.assertGreaterEqual(lanes[0].count('class="project-tile"'), 5)
        self.assertGreaterEqual(lanes[1].count('class="project-tile"'), 5)
        self.assertIn('<strong>FloatPlayer</strong>', showcase)
        self.assertIn('<strong>I Was Here</strong>', showcase)
        self.assertIn('https://n23eos.github.io/floatplayer-site/', showcase)
        self.assertIn('https://n23eos.github.io/advanced_graph_view/', showcase)
        self.assertIn('https://i-was-here-tau.vercel.app', showcase)
        self.assertIn('obsidian-projects.webp', showcase)
        self.assertIn('other-projects.webp', showcase)
        self.assertNotIn('selected-card', showcase)
        self.assertNotIn('case-studies.html', text)
        self.assertNotIn('Разобрать кейс', text)
        self.assertIn('>AI Engineer</h1>', text)

    def test_showcase_has_reduced_motion_fallback(self):
        css = (ROOT / 'assets' / 'hiring.css').read_text()
        self.assertIn('@media(prefers-reduced-motion:reduce)', css)
        reduced = css.split('@media(prefers-reduced-motion:reduce)', 1)[1]
        self.assertIn('.project-track{animation:none!important}', reduced)
        self.assertIn('.project-set[aria-hidden="true"]{display:none}', reduced)

    def test_ids_are_unique(self):
        for path, page in self.pages.items():
            with self.subTest(page=str(path.relative_to(ROOT))):
                self.assertEqual([key for key, count in Counter(page.ids).items() if count > 1], [])

    def test_contact_links_use_published_email(self):
        for path, page in self.pages.items():
            for href in page.links:
                if href.startswith('mailto:'):
                    with self.subTest(page=str(path.relative_to(ROOT))):
                        self.assertEqual(urlsplit(href).path, 'mns.nicholas@gmail.com')


if __name__ == '__main__':
    unittest.main()
