# Ironic Ineptocracy site QA findings

Audit time: 2026-05-20 03:29 UTC
Branch prepared: `qa/static-render-seo-fix`
Production/live URL audited: https://www.ironicineptocracy.com/

## Scope performed
- Checked live homepage render with browser automation.
- Fetched live `/`, `/robots.txt`, `/sitemap.xml`, favicon, CSS, and JS/chunk URLs.
- Inspected local recovered repo at `/root/ironic-ineptocracy-site`.
- Ran `npm run build` before/after the safe patch.
- Ran local Vite preview on the patched branch and verified render + console.
- Tested reader brief lead-capture behavior locally.

## Findings

### Blank / black render cause
- Live `/` returns HTTP 200 and valid HTML, but the React root remains empty in the browser.
- Browser automation reported an uncaught JS exception and an empty accessibility tree.
- The deployed main bundle references/preloads these recovered chunk names:
  - `/assets/Characters-BUdsBtOd.js`
  - `/assets/Characters-Dve3jzJC.css`
- Both return HTTP 404 on production.
- Vite's modulepreload helper throws on failed preload, which prevents React from mounting, causing the blank page.
- Local build reproduces the same risky output shape unless compatibility assets are copied into `dist/assets/`.

### robots.txt / sitemap.xml
- Live `https://www.ironicineptocracy.com/robots.txt`: 404.
- Live `https://www.ironicineptocracy.com/sitemap.xml`: 404.
- Patch adds both under `public/` so Vite copies them to `dist/`.

### Canonical / social metadata
- Live/current local HTML had no `<link rel="canonical">`.
- Social image URLs were relative.
- Patch adds canonical and `og:url`, and converts social/JSON-LD image/offer URLs to absolute production URLs.

### Favicon
- Live `/favicon.svg`: 404.
- Local repo had a recovered favicon at `recovery/live-site/favicon.svg` but it was not tracked in the deployed build path.
- Patch copies it to `public/favicon.svg`.

### Lead capture basics
- The footer reader-brief form exists in the bundle with:
  - `type="email"`, `required`, `autocomplete="email"`, `aria-invalid`, status feedback, and localStorage fallback.
  - Optional endpoint lookup via `meta[name="ineptocracy-newsletter-endpoint"]` or `window.INEPTOCRACY_NEWSLETTER_ENDPOINT`.
- No endpoint is configured in current HTML, so submissions are only stored client-side in `localStorage` and are not sent to a backend/list provider.
- Local patched preview test: submitting `qa@example.com` stored an `ineptocracy.leads` entry and showed “On the list. Watch the inbox.”

## Safe patch prepared, not deployed
Prepared on branch `qa/static-render-seo-fix` only; no push, no commit to main, no Vercel production deploy.

Changed/added:
- `index.html`
  - Added canonical and `og:url`.
  - Converted `og:image`, `twitter:image`, JSON-LD `image`, and JSON-LD offer `url` to absolute production URLs.
- `public/assets/Characters-BUdsBtOd.js`
  - Compatibility copy of recovered dynamic chunk so Vite output serves the exact URL referenced by modulepreload.
- `public/assets/Characters-Dve3jzJC.css`
  - Empty compatibility CSS file to satisfy the stale modulepreload CSS URL and prevent preload failure.
- `public/favicon.svg`
  - Recovered favicon exposed at `/favicon.svg`.
- `public/robots.txt`
  - Allows crawling and points to sitemap.
- `public/sitemap.xml`
  - Includes `/`, `/world`, and `/newsletter`.
- `QA_FINDINGS_2026-05-20.md`
  - This findings file.

## Verification
- `npm run build`: passed.
- Patched `dist/` contains:
  - `dist/assets/Characters-BUdsBtOd.js`
  - `dist/assets/Characters-Dve3jzJC.css`
  - `dist/robots.txt`
  - `dist/sitemap.xml`
  - `dist/favicon.svg`
- Local patched preview `http://127.0.0.1:4173/`: React rendered normally; browser console had 0 JS errors.
- Local patched preview asset checks returned HTTP 200 for compatibility chunk, compatibility CSS, robots, sitemap, and favicon.

## Remaining issues / recommendations
- Production remains blank until a reviewed fix is deployed.
- For real lead capture, configure a backend/newsletter endpoint through an approved environment/config path; do not rely on localStorage for actual signups.
- Longer-term cleanup should reconstruct readable React source rather than relying on recovered minified bundles and compatibility files.
