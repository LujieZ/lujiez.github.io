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

Build the static site with `bundle exec jekyll build`; run `bundle exec jekyll doctor`
to check the Jekyll configuration.
