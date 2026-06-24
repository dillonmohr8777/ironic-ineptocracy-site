# VA Claims (VACE) Portal — Wireframes

Mid/high-fidelity, clickable HTML wireframes for the **VACE — Claims Edge
Platform** portal, the software for a US VA disability-claims agency. These now
**match the live VACE Claims Edge demo**, reproduced from reference screenshots,
and serve as the buildable front-end blueprint.

## What this is

A single, self-contained `portal-wireframes.html` that reproduces the demo's
layout, information architecture, and visual theme:

- **Dark navy + gold theme** — near-black navy app background, slightly different
  sidebar, panels/cards with subtle borders and rounded corners, gold/amber
  accent, and semantic status colors (amber warning, red danger, green success,
  blue info).
- **VACE wordmark** (gold→blue gradient) + "CLAIMS EDGE PLATFORM" subtitle.
- **11-step client-journey model** — clients progress through Steps 1–11; alerts
  fire when a client exceeds a per-stage day threshold (Early 1–3 / Mid 4–7 /
  Final 8–11) or goes too long without contact. Advisors/coaches own clients; an
  AI assistant has full client-DB visibility.

No build step, no server, no dependencies, no external fonts/CDNs/images/network
calls — works fully offline (CSP-safe). All icons are inline SVG; fonts use a
system stack.

## How to open

Open `portal-wireframes.html` in any web browser. Start on the **Login** screen
→ click **Sign In** to enter the portal. Use the left sidebar to switch screens;
click a client row to open the Client Detail screen; the top-bar **Ask AI**,
**Add Client**, and bell buttons are wired to their screens.

## Screens (8)

1. **Login** — centered VACE card, email/password, Sign In → Dashboard.
2. **Dashboard** — KPI stat cards, 11-step pipeline funnel, recent alerts, advisor mini-summary, quick actions.
3. **All Clients** — filterable table; Step (n/11 with progress bar), days in step, advisor, last contact, status pill, payment; pagination; rows open Client Detail.
4. **Client Detail** — header with status/advisor/step, horizontal 11-step tracker, activity timeline, contact history, payment milestones, documents, notes.
5. **Alerts & Notifications** — the 8 alert cards (icon box, title, description, relative time; left border on warnings).
6. **AI Assistant** — online indicator, assistant chat bubble, input + Ask, suggested-prompt chips.
7. **Advisors & Coaches** — advisor cards (Donnie 94 / Darious 120) + Add New Advisor placeholder.
8. **Settings** — notification thresholds per stage, admin email, Save Settings.

## Provenance: matched vs reconstructed

- **Matched from reference screenshots:** Login, Alerts, AI Assistant, Advisors, Settings.
- **Reconstructed / inferred** (no screenshot available; built consistently with the theme and flagged in-app with a "reconstructed — confirm against demo" caption): Dashboard, All Clients, Client Detail.

## Next steps

- Confirm the three reconstructed screens against the live demo and reconcile any layout/content differences.
- Hand off to the front-end build directed by Dillon.
