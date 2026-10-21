# The Ironic Ineptocracy: The File Opens

A satirical creature-collector RPG (modern-Pokémon structure) set in the world
of **The Ironic Ineptocracy** by Dillon Mohr. Built with Godot 4, fully
data-driven so new manuscript chapters become new game content via JSON only.

You are the **Courier**. A damaged folder — the Garnier file — is pressed into
your hands on West 7th in Philadelphia. The machinery of the ineptocracy
manifests around you as confrontable entities (**Manifestations**: slogans,
receipts, redactions, draft notices). You **argue** with them, **file** them
as evidence, and build the dossier before the machine corrects the record.

## Documents

| File | Contents |
|---|---|
| [docs/01-manuscript-analysis.md](docs/01-manuscript-analysis.md) | Structured analysis of the canon: themes, systems, characters, quotes |
| [docs/02-game-design-document.md](docs/02-game-design-document.md) | Full GDD: player role, loop, battle/affinity systems, Memory Ledger |
| [docs/03-manifestation-codex.md](docs/03-manifestation-codex.md) | 20 Manifestation entries (31 species/stages), all canon-cited |
| [docs/04-world-and-story.md](docs/04-world-and-story.md) | Zone map, quest spine, dialogue/journal pipeline |
| [docs/05-art-direction-and-roadmap.md](docs/05-art-direction-and-roadmap.md) | Art prompts, palette, balance notes, phased roadmap |

## Running the game

1. Install [Godot 4.2+](https://godotengine.org/download) (standard build).
2. Open `game/godot/project.godot` in the Godot editor.
3. Press **F5** (Run Project).

Controls: **Arrows/WASD** move · **E/Enter** interact & advance dialogue ·
**F5** notarize (save) · **Esc** back to title.

### What's in the vertical slice

- Title screen, new game / resume from save
- Prologue cutscene ("The Leak") with verbatim canon text, starter choice
  (Receipt / Checksum / Burner — three WITNESS instruments)
- Explorable West 7th zone with pressure patches (encounter areas), NPCs
  quoting canon, and the green-eyed stranger story hook
- Full turn-based Argument system: 6-affinity type chart, stat stages, STAB,
  priority, ramping/recoil/stage-clearing move effects
- Filing (capture) with affidavits, dossier tracking, XP/level-ups/learnsets
- Save/load (`user://dossier_save.json`)

### Data architecture (add chapters here)

```
game/godot/data/
  manifestations.json   # species: stats, affinities, learnsets, evolutions, epigraphs
  moves.json            # tactics: power/accuracy/effects
  types.json            # the affinity chart (MONEY WAR MEMORY MEDIA OFFICE WITNESS)
  items.json            # affidavits, restoratives
  zones/<zone>.json     # map geometry, encounter tables, NPCs, exits
  dialogue/<set>.json   # scripts; "source": "canon" marks verbatim book text
```

`DataStore` validates all cross-references at startup. Headless data check:

```
godot --headless --path game/godot -- --check-data
```

## Canon policy

Lines tagged `"source": "canon"` are verbatim from the book's published
materials and must never be edited in place. Connective dialogue is tagged
`"adaptation"`. Every Manifestation cites the canon line it embodies in its
`epigraph` field — the codex doubles as an annotated reader companion.
