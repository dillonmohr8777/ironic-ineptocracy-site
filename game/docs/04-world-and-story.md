# World & Story Integration

Zone map, quest spine, and the dialogue/journal pipeline. All locations are
canon; connective tissue is labeled **[adaptation]**.

## 1. Zone map ("The map is not geography. It is pressure.")

The overworld is not a continent — it is a **pressure map**: nodes connected
by routes (bus, rail, car, and later the Keshet's water route). Travel
unlocks follow the file, not a compass.

### Act I — The File Opens
| Zone | Canon anchor | Gameplay |
|---|---|---|
| **Philadelphia — West 7th** | "Walks West 7th alone until a green-eyed asset enters the crowd." Harvard ballcap hiding the Philly bruise. | Tutorial city. Starter choice, first arguments, first FILE. Ends with the green-eyed stranger sighting (Alec, unnamed). |
| **Cambridge / the university** | "Darnell earns the door and learns who owns the hallway." Stone corridor, cold institutional lighting. | First interiors with Room Pressure. The school file changes — first Memory Ledger entry. |
| **Boston — protest** | Boston protest scene: Darnell speaking, Javon protective, black protest clothing. | First 2v2 arguments beside Javon. MEDIA-heavy encounters. |

### Act II — The Draft Machine
| Zone | Canon anchor | Gameplay |
|---|---|---|
| **Washington D.C. — Capitol / White House** | "Darnell, Javon, and Alec standing before the Capitol under a fire lit sky." McNulty at the White House protest: "Eventually, they'll stop protesting, one way or another." | OFFICE/WAR zones; the Draft Machine dungeon; McNulty as antagonist captain. |
| **Des Moines — Tecca site** | "Tecca x9R battery fire · 32 dead." The official line: "An electric fire occurred from a faulty battery, killing 32 workers." | Investigation zone. The player records the First Version before the Corrected Version airs; X9R rare encounter. |
| **Chicago** | "Route bends through Chicago. Column remains empty." | Alec's route; rival arguments where his alignment stays unreadable. |
| **Rosedale, Mississippi** | Javon's hometown, "poorest city in the state." | Javon's stakes; WITNESS bond quests; no wild WITNESS — only people. |

### Act III — The Memory Economy
| Zone | Canon anchor | Gameplay |
|---|---|---|
| **Virginia apartment** | "Shelter with a signal running through it." | Safe house that isn't: MEMORY ambushes; Sabrina joins. |
| **Mark's cabin** | "A basement built for breaking signals without breaking people." | Signal Jam mechanic unlocks (counters MEMORY moves and NeuroClick's Curated Relief). |
| **Ports / abroad (Avigail's threshold network)** | "Doors, elevators, rooms, ports, vehicles, and borders matter around her." Four continents. | Threshold stealth-lite: pass controlled spaces; Avigail's safe houses. |
| **The Keshet route** | "A black file, a buried vessel... built for the moment when official channels become a trap." | Leah pilots; water routes open; Burner→Encrypted Route evolution. |

### Act IV — The Room Above the Hill
| Zone | Canon anchor | Gameplay |
|---|---|---|
| **Orange County — the mansion** | "The mansion is not a house. It is a position." "The windows glow like servers. The driveway looks too empty." | Final dungeon fought room by room; each room's architecture is a fight modifier; THE ROOM finale; Garnier confronted with the completed file. |

## 2. Main quest spine (chapter-aligned, spoiler-safe)

1. **The Leak** — receive the damaged folder; learn ARGUE/FILE. ("If this
   file reached you cleanly, assume someone wanted it seen.")
2. **The School File Changes** — Cambridge; first Ledger overwrite attempt.
3. **Who Gets Spent** — Boston protest; meet Javon in the field.
4. **The Draft Machine** — D.C.; the queue; "the file calls it selection."
5. **32 Names** — Des Moines; file the X9R before the press release does.
6. **The Empty Column** — Chicago; three Alec encounters, alignment unknown.
7. **A Signal Running Through It** — Virginia; Sabrina; NeuroClick revealed.
8. **Breaking Signals, Not People** — Mark's cabin; jam tech.
9. **Thresholds** — ports; Avigail; "survival is decided in the passage
   between one controlled space and another."
10. **Come Quiet With Ghosts** — the Keshet crossing with Leah.
11. **The Weapon He Paid For** — Alec's mansion confrontation; his pivot.
12. **The Room Above the Hill** — finale. "The final weapon is not force.
    It is revision." Ending branches on the surviving Ledger.

**Endings [adaptation, theme-faithful]:** scored by Ledger integrity —
*The Record Holds* (network ending), *The Reasonable Option* (convenience
ending, the quiet horror one), and gradations between. Garnier is never
punched; he is *documented*. Whether documentation matters is the question
the ending asks — same as the book's.

## 3. Side content patterns

- **Receipt Runs**: track a slogan to its payer (MEDIA→MONEY chains).
- **Room Reads**: optional interior puzzles — "who gets invited, who waits
  outside, who owns the silence" — flip Room Pressure for permanent zone perks.
- **The Human Network**: bond quests for Avigail, Sabrina, Leah, Mark; each
  rewards a WITNESS Manifestation or evolution.
- **First Versions**: timed micro-quests; record an event before the
  Corrected Version propagates through zone NPC dialogue (NPC lines literally
  change if you're late — public amnesia, playable).

## 4. Dialogue & journal system

- `data/dialogue/*.json`; each line `{ "speaker", "text", "source" }` where
  `source` is `canon` (verbatim manuscript/site text — *never edited*) or
  `adaptation`.
- The **Dossier journal** has tabs: FILE (main quest pages, written as
  redacted memos), LEDGER (first vs. corrected versions), CODEX (filed
  Manifestations with their canon epigraphs), NETWORK (bonds).
- Canon epigraphs unlock as flavor when filing each species — the game
  doubles as an annotated reader companion for the novel.
- New manuscript chapters → drop quotable lines into dialogue JSON with
  `source: "canon"`; the journal ingests them automatically.

## 5. Reputation: Record vs. Convenience

Tracked globally (see GDD §6), surfaced diegetically:

- High **Record**: network NPCs offer routes/safehouses; institutional NPCs
  stall you with procedure; prices rise ("the difficult person in the room").
- High **Convenience**: doors open, escorts wave you through, shops discount
  — and Ledger pages silently gray out, WITNESS damage falls, and certain
  endings close. The UI never warns you. The book wouldn't.
