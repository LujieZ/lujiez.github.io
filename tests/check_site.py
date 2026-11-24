"""Check the generated Pages artifact using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import sys
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.file = file
        self.ids = set()
        self.links = []
        self.canonical = None
        self.noindex = False
        self.headings = []
        self.feed(file.read_text())

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get('id'):
            assert attrs['id'] not in self.ids, f'{self.file}: duplicate id {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.headings.append(int(tag[1]))
        if tag == 'img':
            assert 'alt' in attrs, f'{self.file}: image missing alt'
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.noindex = 'noindex' in attrs.get('content', '')
        for key in ('href', 'src', 'poster', 'data'):
            if attrs.get(key):
                self.links.append(attrs[key])


site = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
assert site.is_dir(), 'Build the site first: bundle exec jekyll build'
pages = {file: Page(file) for file in site.rglob('*.html')}
assert len(pages) == 14, f'Expected 14 routes, found {len(pages)}'


def resolve(path):
    file = site / unquote(path).lstrip('/')
    assert file.resolve().is_relative_to(site), f'Link escapes published site: {path}'
    for candidate in (file, file / 'index.html', Path(str(file) + '.html')):
        if candidate.is_file():
            return candidate
    raise AssertionError(f'Unresolved local target: {path}')


checked = 0
for file, page in pages.items():
    assert page.canonical, f'{file}: missing canonical URL'
    if not page.noindex:
        assert page.headings.count(1) == 1, f'{file}: expected one h1'
        previous = 0
        for level in page.headings:
            assert level <= previous + 1, f'{file}: skipped heading level'
            previous = level
    origin = urlsplit(page.canonical).netloc
    path = '/' + file.relative_to(site).as_posix()
    for link in page.links:
        target = urlsplit(urljoin('https://' + origin + path, link))
        if target.scheme not in ('http', 'https') or target.netloc != origin:
            continue
        destination = resolve(target.path)
        if target.fragment and destination in pages:
            assert unquote(target.fragment) in pages[destination].ids, f'{file}: missing fragment {link}'
        checked += 1

sitemap = ET.parse(site / 'sitemap.xml')
urls = [element.text for element in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls) == len(set(urls)), 'Sitemap has duplicate URLs'
expected = {page.canonical for page in pages.values() if not page.noindex and page.file.name != '404.html'}
assert set(urls) == expected, f'Sitemap differs from content pages: {set(urls) ^ expected}'

for name in ('tests', 'test-results', 'node_modules', 'Gemfile', 'Gemfile.lock',
             'package.json', 'package-lock.json', 'README.md', 'REVIEW.md', 'CONTENT.md'):
    assert not (site / name).exists(), f'Development artifact published: {name}'

print(f'Validated {len(pages)} HTML routes, {checked} local references, and {len(urls)} sitemap entries.')
