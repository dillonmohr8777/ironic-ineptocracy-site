# Art Direction, Polish & Roadmap

## 1. Art direction

The site already defines the visual language; the game inherits it:
"Analog, restrained, no trailer voice, no explosions, no fake blockbuster
energy." "No cyberpunk neon." Black glass, crimson accents, fluorescent
institutional light, CRT corruption, redaction bars, stamps, manila.

### Global style prompt (prefix for all generation)
> 2D game art for a satirical political-thriller creature collector. Analog
> dossier aesthetic: manila folders, redaction bars, red stamps, thermal
> paper, fluorescent office light, CRT scanline corruption. Muted palette —
> charcoal, manila, ledger green, stamp red, amber phosphor. Restrained,
> cinematic, institutional dread. NO neon, NO cyberpunk, NO explosions, NO
> cartoon gloss. Clean silhouettes readable at 64px.

### Palette
| Use | Hex |
|---|---|
| Background ink | `#101014` |
| Manila / paper | `#d8c89a` |
| Stamp red (WAR) | `#b3241f` |
| Ledger green-gold (MONEY) | `#8a8a4a` |
| Erasure gray (MEMORY) | `#c9c9cf` |
| Broadcast blue (MEDIA) | `#3d6e8f` |
| Fluorescent beige (OFFICE) | `#cfc4a2` |
| Analog amber (WITNESS) | `#e0a33c` |

### Creature sprite prompts (examples; full set derives from codex visuals)
- **Receipt**: "small hovering thermal-paper scrap creature, curled edges,
  faint purchase lines as markings, amber underglow, front battle sprite,
  flat dark background"
- **Selected**: "upright government form creature, single wet red SELECTED
  stamp as face, fluorescent top-light, slight printer-feed tremble"
- **Memory Hole**: "open filing cabinet drawer containing designed starless
  black, expensive blank label, subtle pull toward the dark"
- **The Room**: "breathing wood-paneled study, windows glowing like server
  racks, chair arrangement implying hierarchy, no people"

### Environment prompts
Reuse the site's own production prompts (canon) — e.g. the mansion: "A
billionaire mansion at night above a distant city, windows glowing like
server racks, storm clouds, long empty driveway, surveillance grid barely
visible, political thriller realism." Tile sets follow: Philadelphia brick
and sodium light; Cambridge stone corridor; D.C. marble and queue ropes;
Des Moines warehouse; cabin timber + basement copper.

### UI
Everything is a document. Battle menu = file tabs; HP bar = a redaction bar
consuming a name; the save screen is a NOTARIZE stamp; the party screen is a
paperclipped stack. Typeface pairing: a typewriter serif for canon text, a
neutral grotesque for institutional UI. Type-on (28ms/char) for dossier text,
matching the site's terminal effect.

### Audio direction
Room tone, fluorescent hum, printer feeds, stamp thuds, distant crowds. Music
is sparse: tape-warped piano and low strings; the mansion gets polite
chamber music that never resolves. The NeuroClick theme is a pleasant UI
chime that recurs until it is menacing.

## 2. Balance & testing notes

- Tune around the WITNESS asymmetry: WITNESS hits 3 affinities super-
  effectively but is weak to WAR/MEDIA/OFFICE pressure — party variety must
  stay necessary. Watch win rates in Act II when WAR spikes.
- Filing rates: base 30%, scaled by remaining Resolve (see `BattleScene.gd`);
  affidavit tiers ×1 / ×1.5 / ×2. Target: 2–3 attempts on a weakened wild.
- Convenience must be *genuinely tempting*: discounts and door-opens should
  save real minutes, or the moral system is a sermon instead of a trap.
- Playtest the Selected→Spent story beat with care; it must never read as a
  reward. If testers celebrate it, re-stage it.
- Data-validation: `DataStore` asserts every move/species/zone reference at
  load; CI can run the Godot binary headless with `--check-data` (see
  README) so bad JSON fails before review.

## 3. Phased roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **0 — Vertical slice** (this repo, done) | West 7th zone, starter choice, wild arguments, FILE capture, save/load, canon dialogue, dossier data for 31 species/stages | Playable loop in Godot 4.2+; all data-driven |
| **1 — Act I** | Cambridge + Boston zones, Room Pressure, 2v2, Javon partner arguments, Memory Ledger v1, Alec encounter 1 | Act I completable, 8–10 species per zone |
| **2 — Act II** | D.C., Des Moines, Chicago, Rosedale; Draft Machine boss; Record/Convenience economy live | Branch-tested Ledger overwrites |
| **3 — Act III** | Virginia, cabin, ports, Keshet; NeuroClick boss; Signal Jam; bond evolutions | All WITNESS lines obtainable |
| **4 — Act IV + endings** | Mansion, THE ROOM, ending matrix | Both ending poles + gradations reachable |
| **5 — Book sync** | As new manuscript chapters land: new dialogue JSON (`source: canon`), new zones/species per chapter | Content adds require zero engine changes |

## 4. New-chapter intake checklist (for the author)

1. Pull quotable lines → `data/dialogue/<chapter>.json` with `source:"canon"`.
2. New location? → copy a zone JSON, repaint, set encounter table.
3. New system/instrument named in the text? → codex entry + species JSON;
   cite the canon line in `epigraph`.
4. New character → NPC entry with portrait prompt in the global style.
5. Run data check; playtest the new pressure patch; ship.
