---
name: The Ironic Ineptocracy
description: A cinematic leaked-evidence interface for a satirical political thriller
colors:
  black-site: "#030303"
  black-panel: "#0b0a09"
  black-raised: "#161412"
  paper: "#f3eee2"
  paper-dim: "#c9c1b2"
  signal-red: "#d32218"
  warning-orange: "#f05a28"
  muted-steel: "#7e7a70"
  evidence-tape: "#e2d3ac"
  evidence-paper: "#ddd4c4"
  evidence-ink: "#2c2821"
  success: "#7fbf7a"
typography:
  display:
    fontFamily: "Impact, Anton, Haettenschweiler, Arial Black, sans-serif"
    fontSize: "clamp(4rem, 15.5vw, 13.5rem)"
    fontWeight: 400
    lineHeight: 0.78
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Impact, Anton, Haettenschweiler, Arial Black, sans-serif"
    fontSize: "clamp(2.8rem, 6.8vw, 6.8rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, Courier New, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  evidence: "2px"
  surface: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.warning-orange}"
    textColor: "{colors.black-site}"
    rounded: "{rounded.evidence}"
    padding: "14px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.evidence}"
    padding: "14px 24px"
  evidence-card:
    backgroundColor: "{colors.black-panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: The Ironic Ineptocracy

## Overview

**Creative North Star: "The Leaked Republic"**

The interface is a congressional evidence room invaded by an underground political tabloid. It should feel physical, unstable, and authoritative: colossal black lettering, bone paper, surveillance photography, registration marks, red corrections, and documents that occupy real depth. It refuses the conventional centered book hero followed by a polite card grid.

The page remains readable because the drama is structural. Type announces the charge, images carry proof, and small mono labels orient the visitor. Motion turns scrolling into investigation: evidence locks into place, files cross the viewport, and swipe tracks create deliberate scene changes.

**Key Characteristics:**

- Colossal compressed display type with hard offset shadows
- Real photography in physical evidence frames
- Black, bone, red, and orange used in broad fields
- Sticky vertical stages interrupted by horizontal swipe passages
- Perspective depth made from stacked paper, not 3D characters
- Motion that always preserves a visible reading path

## Colors

The palette uses black as the room, bone as the evidence, red as institutional violence, and orange as the active signal.

### Primary

- **Warning Orange:** Active controls and the most important route forward.
- **Signal Red:** Stamps, corrections, state changes, and large typographic interruptions.

### Neutral

- **Black Site:** The continuous environmental field.
- **Black Panel:** Low evidence surfaces and navigation.
- **Black Raised:** Elevated dossiers and hover depth.
- **Paper:** Primary display text and physical document surfaces.
- **Paper Dim:** Long-form body copy.
- **Muted Steel:** Metadata and secondary labels.

**The Broad Field Rule.** Red, orange, and paper may own an entire scene; they are not reduced to decorative dots.

## Typography

**Display Font:** Impact (with Anton, Haettenschweiler, and Arial Black fallbacks)  
**Body Font:** Georgia (with Times New Roman fallback)  
**Label/Mono Font:** IBM Plex Mono

**Character:** Display lettering should feel printed too hard on a protest sheet. The body voice is calmer and literary, while mono labels behave like machine evidence.

### Hierarchy

- **Display** (400, fluid 4–12.5rem, 0.78): Page charges, hero words, and scene interruptions.
- **Headline** (400, fluid 2.8–7rem, 0.86): Section thesis and route transitions.
- **Body** (400, fluid 1–1.125rem, 1.65): Story and explanatory copy, constrained to 65ch.
- **Label** (700, 0.75rem, 0.16em, uppercase): File metadata, controls, captions, and progress.

**The Impact Means Impact Rule.** The display face appears at architectural scale. Small Impact headings are a failure of the system.

**The Living Flag Rule.** The moving American flag texture and its larger bleeding field belong exclusively to the homepage's main `h1`. That first headline is the singular patriotic spectacle. Interior page titles, section headings, article headings, and CTAs return to solid paper or ink type so the effect never repeats or overwhelms the reading experience. Reduced-motion mode freezes the homepage flag instead of removing it.

## Layout

The site uses a 72rem reading container inside full-bleed scene fields. Vertical editorial flow remains primary. Selected sections become sticky stages with a pinned visual and changing copy; evidence galleries use horizontal scroll snap and conspicuous drag or swipe affordances. Desktop compositions may overlap by up to one grid column. Mobile collapses overlap into edge-to-edge layers while keeping native vertical scrolling intact.

## Elevation & Depth

Depth is structural and deliberately visible. Paper panels cast hard black and red offset shadows; photography is nested in shallow frames; selected cards rotate a fraction of a degree as if placed by hand. Pointer depth is restrained and resets immediately when focus leaves.

### Shadow Vocabulary

- **Paper Lift:** Broad soft black shadow plus a short red offset for physical evidence.
- **Broadcast Cut:** Hard 8–14px black offset under major headlines and controls.
- **Signal Halo:** Rare orange/red glow only for active evidence.

**The Layer Count Rule.** A 3D composition needs foreground, subject, and environmental layer. A single tilted card is not depth.

## Shapes

Corners stay square or nearly square. Cards use clipped corners, borders, tape strips, stamps, and registration marks instead of soft pills. Circular forms are reserved for status markers and pointer affordances.

## Components

### Buttons

- **Shape:** Nearly square evidence label (2px radius).
- **Primary:** Warning orange on black with a hard offset shadow.
- **Hover / Focus:** Lift forward, deepen the shadow, and preserve a strong visible focus ring.
- **Ghost:** Transparent paper text with a hard evidence border.

### Cards / Containers

- **Corner Style:** 2–6px only.
- **Background:** Black evidence panels or bone documents.
- **Shadow Strategy:** Physical paper lift; never generic ambient glass.
- **Border:** Hairline paper or red correction line.
- **Internal Padding:** 24–40px depending on scale.

### Answer Briefs

- **Purpose:** Give search engines, answer engines, AI crawlers, and hurried readers a direct quotable answer before the long evidence trail.
- **Structure:** Mono query label, one decisive answer, optional supporting facts, and a related-route link.
- **Treatment:** Clipped evidence-paper geometry, red rule, registration marks, hard black/red offset shadows, and enough whitespace to read as an editorial artifact rather than a generic card.

### Inputs / Fields

- **Style:** Dark inset field with a clear paper border and mono label.
- **Focus:** Orange border and restrained signal halo.
- **Error / Disabled:** Copy remains explicit; color never carries state alone.

### Navigation

Sticky black rail, mono evidence labels, visible active route, and a high-contrast dossier action. Mobile navigation opens as a full-width file index without covering the whole document.

### Swipe Rail

Every horizontal sequence includes a title, progress counter, native scroll snap, previous/next controls, and touch dragging. It must remain keyboard navigable and readable when motion is reduced.

## Do's and Don'ts

### Do:

- **Do** let one memorable typographic or photographic event dominate each viewport.
- **Do** make real portraits large enough to read as people, not thumbnails.
- **Do** vary density across the scroll so loud scenes earn quiet reading passages.
- **Do** use motion to explain sequence, pressure, and relationship.

### Don't:

- **Don't** use 3D-rendered character likenesses.
- **Don't** return to generic SaaS cards, glass panels, pill buttons, or centered-safe hero stacks.
- **Don't** hide essential content behind animation or pointer-only interaction.
- **Don't** hijack the full-page scroll; horizontal motion is contained inside clearly marked evidence sequences.
