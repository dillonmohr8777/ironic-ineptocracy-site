# VA Claims (VACE) Portal — Wireframes

Low-fidelity, clickable HTML wireframes for the **VA Claims portal** (a.k.a. the
**VACE platform**) — software for a US VA disability-claims agency.

## What this is

A **concept first-pass** wireframe of the full portal, built from the known
feature set. It is **not** derived from the live demo: the demo at
`vace-platform-ui-demo.netlify.app` could not be accessed from this session
(network egress is blocked), so these screens are a blueprint to be **matched
to the live demo once reference screens are available**, and then **branded**
(the neutral `[ VACE ]` logo placeholder marks where brand drops in).

The wireframes are intentionally **grayscale and unbranded** — boxes, lines,
placeholder data, and system fonts — so reviewers focus on structure and flow,
not visuals.

## How to open

Just open `portal-wireframes.html` in any web browser. No build step, no server,
no dependencies, works fully offline.

Start on the **Login** screen → click **Sign in** to enter the portal. Use the
left sidebar, the top "screen index" bar, or click client rows/cards to navigate.

## Screens (7)

1. **Login / Sign-in**
2. **Dashboard (Overview)** — KPI cards, Payment Watch summary, recent activity, quick actions
3. **Payment Watch** (centerpiece) — two day-count groups (60–120 / 121+ days post C&P), manual timers, status badges, Mark Paid
4. **Clients** — searchable/filterable table with pagination; rows open Client Detail
5. **Client / Case Detail** — claim info, post-exam timeline, Payment Watch controls, notes, documents, assigned staff
6. **Reports / Analytics** — placeholder charts + summary table
7. **Admin / Settings** — user/role management + org and notification preferences

## Next steps

- Compare against the live `vace-platform-ui-demo` portal and reconcile layout/flow.
- Apply real branding (color, logo, type) in place of the neutral placeholders.
- Hand off to the front-end build directed by Dillon.
