# The Lujie Chronicle

Sue Zhao's personal site, set as a small newspaper: https://lujiez.github.io/

Built with Jekyll (GitHub Pages, no plugins), one hand-written stylesheet and one small script.

- `_layouts/` – `default` (masthead + colophon), `feature` (case studies and project pages), `redirect` (old addresses)
- `_includes/` – masthead, colophon, shared pieces; `ink/` holds the hand-drawn SVG icons
- `_data/archive.yml` – every entry on the Archive page, the front-page strip and "Also on file"
- `_work/` – the two case studies
- `assets/css/chronicle.css`, `assets/js/chronicle.js`

Run it locally:

```sh
bundle install
bundle exec jekyll serve
```
