# Global chrome — The Ironic Ineptocracy (ironicineptocracy.com)

The site has TWO page shells:

1. **Home shell** (`site-shell`) — used only on `/` (and `/world` has its own variant). Header `site-header`, footer `site-footer`.
2. **Launch shell** (`launch-page ineptocracy-page-shell`) — used on /book, /characters, /characters/:slug, /dossier, /dispatches, /dispatches/the-file-opens, /press, /reader-guide (and /admin/*). Header `launch-header`, footer `launch-footer`, plus a global threat ticker.

---

## 1. Home shell header (`site-header`, on `/`)

[BRAND button → home]
> The Ironic **Ineptocracy**
(rendered as "The Ironic " + `<span>`Ineptocracy`</span>`)

[NAV aria-label="Primary navigation"]
- [NAV-LINK → /book] `Book`
- [NAV-LINK → /#about-book] `About the book`
- [NAV-LINK → /characters] `Characters`
- [NAV-MENU → /characters] `Character files`
  - submenu (aria-label "Character pages"), one button per character name → `/characters/<slug>`:
    Darnell Covington, Javon Whitfield, Ronald McNulty, Dijon Garnier, Alec Daheim, Avigail, Sabrina, Leah, Mark
- [NAV-LINK → /dispatches] `Dispatches`

[HEADER-CTA → /dossier]
> Enter the dossier

---

## 2. Launch shell header (`launch-header`, on launch pages)

[BRAND button → home]
> The Ironic **Ineptocracy**

[NAV aria-label="Launch navigation"]
- [NAV-LINK → /book] `Book`
- [NAV-LINK → /world] `World`
- [NAV-LINK → /characters] `Characters` (with submenu, aria-label "Character pages": all 9 character names → `/characters/<slug>`)
- [NAV-LINK → /dispatches] `Dispatches`
- [NAV-LINK → /press] `Press`

[HEADER-CTA → /dossier]
> Enter the dossier

---

## 3. Threat ticker (launch shell, aside, aria-label "Ineptocracy warning signals")

Each item renders as `<strong>LABEL</strong> Title: copy`:

> **WARNING** Protected failure: The people in charge are not confused. They are protected from consequence.
> **SYSTEM FAILURE** Policy without consequence: Incompetence becomes policy when nobody pays the price.
> **EVIDENCE OF DECAY** Power outruns accountability: The warning signs are already everywhere.
> **WHAT HAPPENS NEXT** Recognition becomes action: Ineptocracy is not a theory. It is the operating system.

---

## 4. Launch shell footer (`launch-footer`)

Buttons in order:
- [FOOTER-LINK → home] `Home file`
- [FOOTER-LINK → /book] `Book`
- [FOOTER-LINK → /world] `World`
- [FOOTER-LINK → /dossier] `Dossier`
- [FOOTER-LINK → /characters] `Characters`
- [FOOTER-LINK → /reader-guide] `Reader guide`
- [FOOTER-LINK → /dispatches] `Dispatches`
- [FOOTER-LINK → /press] `Press`
- [FOOTER-CTA → /dossier] `Open the file`

---

## 5. Home shell footer (`site-footer`, on `/`)

[SECTION-CODE]
> Transmission · 017 / 06

[H2 id=site-footer-title]
> The Ironic **Ineptocracy**

[P class=site-footer__pitch]
> Smart kid. Bad year. Donor money, draft papers, and a government that did not lose the plot. It authored the plot, notarized the damage, and asked him to acquiesce while the invoice found his name.

[CTA href=/dossier aria-label="Open the Garnier Dossier"]
> Open the file

[EXTERNAL LINK href=https://www.goodreads.com/ target=_blank rel="noopener noreferrer"]
> Track on Goodreads

### Footer signup form (id="reader-brief", aria-label "Garnier Dossier access form")

[SECTION-CODE]
> Classified reader file

[P class=site-footer__signup-copy]
> Dijon Garnier moves like infrastructure. Send the first file to this address.

[LABEL sr-only]
> Email address

[INPUT type=email placeholder]
> you@example.com

[SUBMIT BUTTON]
> Open the file
(while pending:)
> Opening file

[STATUS messages role=status aria-live=polite]
- ok: `ACCESS GRANTED. The first file is queued.`
- invalid: `TRANSMISSION FAILED. Check the address and try again.`
- pending: `Opening the channel.`
- error: `TRANSMISSION FAILED. Check the address and try again.`
- idle: ` ` (single space)

Submits with `source: "footer-garnier-dossier"`. Email validated against `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.

### Footer nav (aria-label "Site footer navigation")

[SECTION-CODE]
> Routes

- [FOOTER-LINK → /book] `Book page`
- [FOOTER-LINK → /#about-book] `About the book`
- [FOOTER-LINK → /#characters-title] `Cast files` (NOTE: the `characters-title` anchor only exists inside the lazy Characters chunk rendered on /characters — on the homepage this anchor target does not exist)
- [FOOTER-LINK → /world] `World file`
- [FOOTER-LINK → /dispatches] `Dispatches`
- [FOOTER-LINK → /press] `Press kit`
- [FOOTER-LINK → /dossier] `Garnier Dossier`

### Footer ticker (aria-hidden)

> *Deck* 017
> *Status* Galley · pre release
> *Encrypted* Eyes only
> *Chapters* 36 · four continents · one very bad year

### Footer base

[SMALL]
> © The Ironic Ineptocracy. All rights reserved.

[SMALL]
> This is a work of fiction. Names, characters, places, and incidents are products of the author’s imagination.

---

## 6. Dossier signup form ("garnier terminal" — rendered on /dossier and /newsletter)

Form `className: "garnier-terminal"`, noValidate, aria-label `Garnier Dossier access form`, section id `garnier-dossier-access`, aria-labelledby `garnier-signup-title`.

[EYEBROW launch-code]
> CLASSIFIED READER FILE

[H2 id=garnier-signup-title]
> Open the Garnier Dossier

[P]
> Dijon Garnier built a form of power that does not need applause. It needs access. The first file traces his public mask, private logic, financial dependencies, and the machinery surrounding The Ironic Ineptocracy.

[LIST aria-label="What you get" — chips]
- Subject profile
- Known associates
- Influence map
- Public mask
- Private logic
- Redacted timeline
- Future dispatches from the control room

[LABEL]
> EMAIL CLEARANCE
[INPUT type=email required autoComplete=email inputMode=email placeholder]
> you@example.com

[LABEL]
> FIRST NAME, OPTIONAL
[INPUT type=text autoComplete=given-name placeholder]
> Name for the file

[SUBMIT BUTTON class=red-button]
> Open the file
(while pending:)
> Opening file

[STATUS terminal-feedback role=status aria-live=polite]
- ok: **ACCESS GRANTED** ` The control room has your address. ` + [LINK href=/lead-magnets/garnier-dossier.md target=_blank rel="noopener noreferrer"] `Open the dossier file.`
- invalid: **TRANSMISSION FAILED** ` Check the address and try again.`
- error: **TRANSMISSION FAILED** ` Check the address and try again.`
- pending: `Checking clearance.`
- idle: `No spam. No filler. Dispatches only.`

Submits with `source: "garnier-dossier-page"`.

### Dossier artifact preview (aria-label "Dossier artifact preview", next to the form)

[STAMP] `GARNIER DOSSIER`
[P] `SUBJECT: DIJON GARNIER`
[STRONG] `CLASSIFIED READER FILE`
[DL]
- Public mask — Order
- Private logic — Ownership
- Known pressure — Access
[MAP aria-hidden] `Money` · `War` · `Memory` · `Media` · **Garnier**

---

## 7. Newsletter / lead-capture form technical details

Endpoint resolution chain (verbatim code):

```js
const sg = "/api/dossier-leads";
function cg() {
  const r = document
      .querySelector(
        'meta[name="ineptocracy-dossier-endpoint"], meta[name="ineptocracy-newsletter-endpoint"]',
      )
      ?.content.trim(),
    d = window;
  return (
    d.INEPTOCRACY_DOSSIER_ENDPOINT?.trim() ||
    r ||
    d.INEPTOCRACY_NEWSLETTER_ENDPOINT?.trim() ||
    sg
  );
}
```

Resolution priority:
1. `window.INEPTOCRACY_DOSSIER_ENDPOINT` (trimmed)
2. `<meta name="ineptocracy-dossier-endpoint">` or `<meta name="ineptocracy-newsletter-endpoint">` content
3. `window.INEPTOCRACY_NEWSLETTER_ENDPOINT` (trimmed)
4. default `/api/dossier-leads`

UTM / source-page capture (verbatim):

```js
function On(r, d) {
  return r.get(d)?.trim() || void 0;
}
function ig() {
  const r = new URLSearchParams(window.location.search);
  return {
    sourcePage: `${window.location.pathname}${window.location.search}`,
    utmSource: On(r, "utm_source"),
    utmMedium: On(r, "utm_medium"),
    utmCampaign: On(r, "utm_campaign"),
    utmContent: On(r, "utm_content"),
    utmTerm: On(r, "utm_term"),
  };
}
```

Lead submission handler (verbatim) — note the localStorage mirror under key `ineptocracy.dossierLeads`, same-origin JSON POST, and cross-origin no-cors URLSearchParams POST with `fields[email]` / `fields[name]` duplicates:

```js
function rg(r) {
  if (r.startsWith("/")) return !0;
  try {
    return new URL(r, window.location.href).origin === window.location.origin;
  } catch {
    return !1;
  }
}
async function nh(r) {
  const d = cg(),
    p = ig(),
    u = {
      email: r.email,
      firstName: r.firstName?.trim() || void 0,
      source: r.source,
      project: "The Ironic Ineptocracy",
      capturedAt: new Date().toISOString(),
      pageUrl: window.location.href,
      ...p,
    };
  try {
    const A = "ineptocracy.dossierLeads",
      O = window.localStorage.getItem(A),
      M = O ? JSON.parse(O) : [],
      _ = M.findIndex((x) => x.email === u.email);
    (_ >= 0 ? (M[_] = u) : M.push(u),
      window.localStorage.setItem(A, JSON.stringify(M)));
  } catch {}
  if (rg(d)) {
    const A = await fetch(d, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
        keepalive: !0,
      }),
      O = await A.json().catch(() => ({}));
    if (!A.ok || !O.ok)
      throw new Error(O.error || `Dossier lead endpoint returned ${A.status}`);
    return;
  }
  const y = new URLSearchParams();
  (y.set("email", u.email),
    y.set("fields[email]", u.email),
    u.firstName &&
      (y.set("firstName", u.firstName), y.set("fields[name]", u.firstName)),
    y.set("source", u.source),
    y.set("project", u.project),
    y.set("capturedAt", u.capturedAt),
    y.set("sourcePage", u.sourcePage),
    y.set("pageUrl", u.pageUrl),
    y.set("userAgent", window.navigator.userAgent));
  for (const A of [
    "utmSource",
    "utmMedium",
    "utmCampaign",
    "utmContent",
    "utmTerm",
  ]) {
    const O = u[A];
    O && y.set(A, O);
  }
  await fetch(d, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: y.toString(),
    keepalive: !0,
  });
}
```

Summary of POSTed fields:
- Same-origin (JSON body): `email`, `firstName`, `source`, `project` ("The Ironic Ineptocracy"), `capturedAt`, `pageUrl`, `sourcePage`, `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm` — expects `{ ok: true }` JSON back; throws `Dossier lead endpoint returned <status>` otherwise.
- Cross-origin (`mode: "no-cors"`, `application/x-www-form-urlencoded;charset=UTF-8`): `email`, `fields[email]`, `firstName`, `fields[name]`, `source`, `project`, `capturedAt`, `sourcePage`, `pageUrl`, `userAgent`, plus any present utm params.
- Known `source` values: `garnier-dossier-page` (dossier terminal form), `footer-garnier-dossier` (homepage footer form).

---

## 8. Shared micro-components (launch shell)

[SWIPE SECTION header] every swipe-section shows its label + an `<em>`:
> Swipe the files

[QUOTE BOX label] (animated-quote-box, used on /book):
> WARNING SIGNAL

[LAZY FALLBACK] (characters index cast section):
> Loading cast file.

[PORTRAIT FALLBACK] (character detail when no portrait):
> Portrait pending
(+ character name)

## 9. External links / endpoints found

- https://www.goodreads.com/ ("Track on Goodreads", homepage footer)
- /lead-magnets/garnier-dossier.md (dossier success link)
- /api/dossier-leads (default lead endpoint)
- Vercel Analytics: `/_vercel/insights/script.js`, debug `https://va.vercel-scripts.com/v1/script.debug.js` (analytics, not visible copy)
- Canonical site origin: https://ironicineptocracy.com
- OG image: https://ironicineptocracy.com/images/social/ineptocracy-og.png
