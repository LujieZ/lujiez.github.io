# PR #14 review and remediation

Reviewed November 24, 2026. Original PR head: `fb96ea4bc55a93dcf0562020e750b2b6924f911b`.
Base: `12d932acab8b496f537a2d9149cf406b952ec41d`.

The original redesign needed corrections. The remediation passed an independent
fresh-context re-review with no remaining required code findings. Content and
external-link caveats remain below. This review does not merge or deploy the site.

## Findings addressed

| Priority | Finding | Correction and evidence |
| --- | --- | --- |
| P2, dependency security | Addressable 2.9.0 has seven current URI/template advisories. | Updated only this gem to 2.9.2; reviewed the patch changelog and tested URI normalization. |
| P2 here, preview-server security | WEBrick 1.9.2 accepts forbidden request trailers (CVE-2026-38969). The affected server is used for local preview; GitHub Pages serves static files. | Pinned official upstream fix `25b0e9206bf5991c6274893d53c428d23b3f2292`, because no patched release was available. Reproduction fails before and passes after; upstream parser tests pass, 33 tests / 162 assertions. |
| P2 | Archive descriptions collapse to 11–54 pixels at tablet widths and collide with links. | Added an intermediate layout through 1100px; all 12 descriptions remain readable at tested widths. |
| P2 | `/about/#about` becomes `/#about#about`, missing its destination. | Explicit destination fragments take precedence. Project aliases still preserve incoming fragments. Tested normal and deliberately delayed script delivery. |
| P2 | Changing reduced-motion settings leaves rain, typing, and video running. | Reconcile animation resources on preference changes. Preserve manual video playback under reduced motion. |
| P2 | Blocked storage makes the sound toggle unable to mute; audio failures escape as exceptions/rejected promises. | Own sound state in the transition script, catch initialization/resume failures, and close playback on mute, page exit, or reduced motion. With blocked storage, each document starts muted. Refresh saved preferences on page reveal. |
| P2 | A manually paused video starts again after scrolling away and back. | Distinguish user pauses from automatic visibility/motion pauses. Both pause/resume flows are covered in real browsers. |
| P3 | The first footer tooltip clips outside narrow screens. | Anchor it within the viewport; hover checks pass at 320px and 390px. |
| P3 | Archive arrow buttons remain visible but inert without JavaScript. | Reveal the controls only after their behavior is initialized. All content remains available without JavaScript. |

Security hardening also moves inline JavaScript into local files and adds a CSP
with `script-src 'self'`. Inline styles remain allowed for existing artwork;
Google Fonts, generated burn images, and the same-origin résumé object are allowed.
This is defense in depth: no exploitable visitor-controlled XSS or open redirect
was found. HTTP-only policies such as `frame-ancestors` cannot be enforced by this
meta policy.

Dependency sources: [Addressable changelog](https://github.com/sporkmonger/addressable/blob/addressable-2.9.2/CHANGELOG.md),
[WEBrick upstream fix](https://github.com/ruby/webrick/pull/199).
Ruby advisory database snapshot: `c87703e7f2c64f8745ce032711308a17d10cda55`.
The WEBrick advisory was absent from that database, so its separate upstream review
and regression test are necessary; a clean audit alone would have missed it.

## Preservation and structure

- The remediation retains identical normalized main-page text on all ten content/404
  pages compared with the original PR head. The résumé PDF and all existing media
  are unchanged by the remediation.
- Compared with the pre-redesign base, all six original HTML routes survive;
  the redesign produces fourteen. Eleven original content images remain
  byte-identical. Contact, calendar, résumé preview/download, social links, project
  pages, and source-code destinations remain represented.
- The redesign intentionally reorganizes and abridges content. It removes old
  homepage columns and credit text as documented in `CONTENT.md`. The older project
  articles also omit some technical detail: rollout terminology and statistical
  chart behavior, and robotics sensor/fusion details. Core descriptions, media,
  and results survive. This is not verbatim preservation of the old site.
- Keep Jekyll, `_data/archive.yml`, shared layouts, and the `_work` collection.
  These boundaries suit the site's size. A framework migration is unnecessary.
- The implemented refactor gives transition drawing, audio state, and the footer
  sound control one owner in `page-burn.js`, removing three public globals. Its
  classic head script preserves early `pagereveal` registration. General behaviors
  stay in the deferred `chronicle.js`; redirects have their own small script.
- Optional follow-up: remove the unused `.bio`, `.letters`, and `.contact-list`
  style blocks after a selector audit. Keep the single stylesheet for now; split
  component styles only if continued growth makes it harder to navigate.
- Add the documented checks to PR CI as a follow-up. There were no existing test
  workflows or substantive PR review records at the pinned head. Return WEBrick
  to a released gem once a release contains the pinned security fix.

## Verification

| Evidence | Result |
| --- | --- |
| Jekyll build and doctor, including an independently built artifact | Pass |
| Generated artifact | 14 HTML routes, 213 local references, 9 sitemap entries; no missing targets or duplicate IDs; development artifacts excluded |
| Native Node regressions | 9 passing tests; original defects reproduced before remediation |
| Dependency regression | Forbidden trailers rejected without losing permitted trailers/body; URI normalization correct |
| Ruby advisory scan | 35 gems; seven findings before, zero after |
| npm frozen install/audit | Zero advisories; three verified registry signatures, two verified attestations; install scripts disabled |
| Chrome | 367/367 checks, ten routes at 1440, 1100, 1024, 768, 720, 390, and 320px |
| WebKit | 243/243 checks, ten routes at 1440, 768, 390, and 320px |
| JavaScript disabled | Main content parity on all ten pages; all twelve archive rows visible; unavailable controls hidden |
| Interactions | Filters, strip buttons/keys/drag, skip/focus, tooltips, history navigation, burn animation, sound preference, video controls, live/initial reduced motion pass |
| Browser console/network | No unexpected errors, warnings, CSP violations, HTTP failures, or failed requests in passing suites; navigation-cancelled media/PDF requests recorded separately |
| Secret-pattern scan | 78 commits / 337 unique blobs / 274 text blobs; no credential candidates found (not a guarantee) |

Firefox could not launch in this host environment: its content-process sandbox
reported `Operation not permitted` and its software renderer failed to map the
framebuffer. Two attempts failed before any site checks ran. No Firefox pass is
claimed. Browser tests use isolated profiles; WebKit is an engine test, not a
physical iPhone/Safari-device certification.

Ordinary Back/Forward navigation and preference-refresh tests pass. Actual BFCache
restoration was not reproduced in the independent Chrome probe. Synthesized audio
was checked through browser API behavior and cleanup, not a subjective listening
test. Lighthouse and physical-device performance measurements were not run.

## Content caveats retained for the owner

1. **Public résumé:** `CONTENT.md` says certain internal metrics and recognition
   were omitted for confidentiality, but the PDF still includes those categories.
   The owner explicitly chose to keep the PDF unchanged and flag the discrepancy.
2. **AI puzzles:** the existing
   [repository destination](https://github.com/LujieZ/cs4613-artificial-intelligence)
   returned 404 both publicly and through the connected GitHub lookup. No verified
   replacement was found; the original link is retained rather than inventing one.
3. **BlueV:** the existing slide-deck URL redirects an anonymous visitor to Google
   sign-in. Public availability of the presentation is unverified. LinkedIn also
   rejects automated HEAD checks (405); this does not establish a broken profile.
   Other checked public destinations responded successfully, including booking,
   Google Cloud documentation, NYU, Marbury, Saturday, and the other code links.

Run the commands in `README.md` to reproduce the checks. Browser reports and
screenshots are written to the excluded `test-results/` directory by default.
