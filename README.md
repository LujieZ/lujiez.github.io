# The Lujie Chronicle

Sue Zhao's personal site, set as a small newspaper: https://lujiez.github.io/

Built with Jekyll (GitHub Pages, no plugins), one stylesheet, and small dependency-free browser scripts.

- `_layouts/` – `default` (masthead + colophon), `feature` (case studies and project pages), `redirect` (old addresses)
- `_includes/` – masthead, colophon, shared pieces; `ink/` holds the hand-drawn SVG icons
- `_data/archive.yml` – every entry on the Archive page, the front-page strip and "Also on file"
- `_work/` – the two case studies
- `assets/css/chronicle.css` – shared styles and transitions
- `assets/js/chronicle.js` – masthead animation, archive controls, and video playback
- `assets/js/page-burn.js` – page transitions and their sound control; loaded synchronously in the head so `pagereveal` is registered before rendering
- `assets/js/redirect.js` – legacy addresses and fragments

Run it locally:

```sh
bundle install
bundle exec jekyll serve
```

Use a Ruby/Bundler version compatible with `Gemfile.lock` (currently Bundler 4).
Keep the preview server on its default loopback address; it is a development server.

Verification (Node 20+):

```sh
bundle exec jekyll build
bundle exec jekyll doctor
python3 tests/check_site.py
bundle exec ruby tests/dependencies.rb
npm ci --ignore-scripts
npm test
npx playwright install chromium
```

With `bundle exec jekyll serve` running in another terminal:

```sh
npm run test:browser
# Or use an installed Chrome:
BROWSER_CHANNEL=chrome npm run test:browser
# Additional engines, after: npx playwright install webkit firefox
BROWSER=webkit npm run test:browser
BROWSER=firefox npm run test:browser
```

`BASE_URL` selects a different local server. Browser checks write a JSON report and
screenshots to `test-results/`; `OUTPUT_DIR` changes that location. Tests, reports,
and npm development dependencies are excluded from the published site. npm install
scripts are disabled in `.npmrc`; browser binaries are installed explicitly.

Security maintenance:

- Audit Ruby dependencies with `bundler-audit check --update` and test dependencies
  with `npm audit`. The WEBrick pin is an unreleased upstream security fix; replace
  it with a released version containing that fix when available.
- `_includes/security-policy.html` limits executable scripts to this origin.
  Inline styles remain allowed for the existing SVG art, and the policy permits
  Google Fonts, generated burn images, and the résumé PDF. HTTP-only policies such
  as HSTS and `frame-ancestors` remain the hosting provider's responsibility.
- Reduced motion is honored at load time and when changed while reading. If browser
  storage is blocked, sound starts muted on each document; the toggle still works
  for that document. Browser autoplay restrictions can also suppress optional sound.

See [the PR #14 review](REVIEW.md) for findings, preservation checks, and remaining
content caveats.
