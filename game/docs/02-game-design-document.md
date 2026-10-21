# THE IRONIC INEPTOCRACY: THE FILE OPENS
## Game Design Document (v1.0)

A satirical creature-collector RPG in the world of *The Ironic Ineptocracy*
by Dillon Mohr. Modern Pokémon structure; dossier-thriller soul.

The title reuses the canon dispatch name **"The File Opens"** — the game *is*
the file opening, playable.

---

## 1. Player role and starting situation

You are **the Courier** — a new, unnamed member of the human network ("the
unofficial geography of people who keep one another alive while institutions
are busy manufacturing their own excuses"). The game opens the way the canon
says the world must be entered: *"Not through a polished gate. Through a
leak."*

A stranger presses a damaged folder into your hands on West 7th in
Philadelphia and disappears. The folder is the Garnier file — watermarked,
half redacted, "names missing where the money should be." Your job for the
rest of the game is the book's central action: **complete the file before the
machine corrects it.**

The player is deliberately *not* Darnell. Darnell is the subject of the file;
the player is its keeper. This preserves the novel's structure (we read
Darnell through documents and witnesses) while giving the player agency.

## 2. Core loop

1. **Explore** a pressure zone (city block, agency corridor, donor room).
2. **Encounter** Manifestations — the machinery made visible — in "static
   patches" where institutional pressure is thick.
3. **Argue** (turn-based battle): deplete a Manifestation's **Resolve** using
   evidence you've already filed.
4. **File** it: capture = entering it into the dossier as documented evidence.
5. **Advance the file**: quests add pages; the Memory Ledger records first
   versions of events before the official story arrives.
6. **Return to the network** (safe houses) to rest, trade, and read new canon
   text unlocked in the journal.

## 3. Affinity system (types)

Six affinities, straight off the canon evidence board (MONEY, WAR, MEMORY,
MEDIA, OFFICE) plus the human network (WITNESS):

| Affinity | What it is | Color key |
|---|---|---|
| MONEY | Donor rooms, debt, dependency, BankIt, the invoice | ledger green-gold |
| WAR | The Draft Machine, emergency speed, selection | stamp red |
| MEMORY | Revision, redaction, NeuroClick, the corrected record | erasure white/gray |
| MEDIA | Slogans, spectacle, polished concern, the news cycle | broadcast blue |
| OFFICE | Procedure, doctrine, protected failure, Form 28 | fluorescent beige |
| WITNESS | Receipts, checksums, burner phones, testimony | analog amber |

**Type chart** (attacker → ×2 strong / ×0.5 weak), each edge justified by canon:

| Atk \ Def | MONEY | WAR | MEMORY | MEDIA | OFFICE | WITNESS |
|---|---|---|---|---|---|---|
| **MONEY** | – | 2 ("disasters he can bill") | – | 2 (paid attention) | 2 (buys the room) | 0.5 (receipts survive) |
| **WAR** | 0.5 (war is billed) | – | – | 0.5 (the story outruns the event) | 2 (martial law overrides procedure) | 2 ("who gets spent") |
| **MEMORY** | – | – | – | 2 (corrects the record) | 2 (rewrites the file) | 0.5 ("a friend remembers the version of you a system has no use for") |
| **MEDIA** | 0.5 (sponsored) | 2 (sells the war) | 0.5 (the archive was already cleaned) | – | – | 2 (isolation; revision pressure) |
| **OFFICE** | 0.5 (donor-owned) | – | – | – | – | 2 (processing) |
| **WITNESS** | 2 (follow the receipts) | 0.5 (bodies get spent) | 2 (the checksum) | 2 (contradicts the broadcast) | – | – |

WITNESS is the player-leaning affinity: strong against the systems' lies,
fragile against their force. The machine's affinities are strong against
WITNESS individually — the design states the book's thesis: *one witness is
spendable; a network is evidence.*

## 4. Battle system — "Arguments"

Turn-based, 1v1 foundation (2v2 in protest chapters). Vocabulary is reskinned
to the book; mechanics stay legible to Pokémon players:

- **Resolve** = HP. When a Manifestation's Resolve breaks, it "loses the room."
- **Pressure** = attack. **Insulation** = defense ("people who have already
  insulated themselves from consequence"). **Tempo** = speed ("the language of
  emergency always wants to hurry the room").
- Moves are **tactics**: *Redact*, *Talking Point*, *Selected Stamp*,
  *Invoice*, *Polished Concern*, *Subpoena*, *Hot Meal*, *Signal Jam*…
- Commands: **ARGUE** (use a tactic), **FILE** (attempt capture; wild only),
  **SWAP** (change deposed evidence), **WITHDRAW** (flee — always succeeds
  outside story arguments; the network survives by knowing when to leave).
- STAB (same-affinity bonus) ×1.5; standard damage curve (see `BattleScene.gd`).

**Filing (capture).** You throw no balls. You spend a **Blank Affidavit** (or
better: *Notarized Affidavit*, *Subpoena Form*) and roll against the target's
remaining Resolve. A filed Manifestation is *documented* — it argues on your
side because exposed machinery serves whoever holds the file. ("The public
file becomes the argument engine.")

**No fainting-to-zero cruelty inversion**: when *your* evidence loses all
Resolve it is "discredited" until restored at a safe house — the machine
spun it, it didn't die.

## 5. Bond, growth, evolution

- Manifestations level by surviving arguments (XP = "corroboration").
- **Evolutions are canon triads** and mostly *story- or bond-gated*, because
  in this world escalation is procedural, not biological:
  - *Favor → Debt → Dependency* ("Access first. Dependence second. Ownership
    after that.")
  - *Rough Draft → Official Story → Corrected Record* ("First the event. Then
    the story. Then the memory.")
  - *Draft Notice → Selected → Spent* ("Who gets protected? Who gets
    processed? Who gets spent?")
  - *Receipt → Ledger → Evidence Board* (the canon board itself)
- WITNESS evolutions require **bond** (battles fought alongside, safe-house
  visits) — friendship is the checksum, so the network's instruments grow
  through use, not levels.

## 6. The Memory Ledger (reputation/choice system)

The book's explicit reader instruction becomes the moral mechanic:

- At key events the game writes a **First Version** into your Ledger.
- Later, the machine offers a **Corrected Version** — always with an
  incentive: money, access, safety, convenience ("a system can sell relief as
  progress").
- **Accepting corrections** raises **Convenience** (shops cheaper, agencies
  friendlier, doors open) but permanently overwrites Ledger pages and weakens
  WITNESS-affinity power (your checksum erodes).
- **Keeping first versions** raises **Record** (the human network trusts you;
  WITNESS evolutions unlock; hidden routes open via Avigail/Leah/Mark) but
  institutions mark you "difficult" — prices rise, patrols thicken.
- There is no neutral: "The person who remembers becomes the difficult person
  in the room." Endings branch on how much of the original file survives.

## 7. Rooms mechanic

Interiors "rank the room before anyone speaks." In donor rooms, agencies, and
the mansion, a **Room Pressure** modifier buffs the resident affinity (e.g.,
MONEY moves ×1.2 inside donor rooms) until the player flips the room by
filing its anchor Manifestation. Reading: power is positional; beat the
architecture, not just the occupant.

## 8. Structure: acts and zones (chapter-aligned)

"36 chapters · four continents · one very bad year" → four acts, data-driven
zones (see `04-world-and-story.md` for the full map):

1. **Act I — The File Opens** (Philadelphia, Boston, Cambridge): starter,
   tutorial arguments, Alec's first appearances, the school file changes.
2. **Act II — The Draft Machine** (D.C., Des Moines, Chicago, Rosedale):
   selection pressure, McNulty's doctrine, the x9R fire, Javon's home stakes.
3. **Act III — The Memory Economy** (Virginia apartment, Mark's cabin,
   international ports, the Keshet route): NeuroClick, Sabrina's evidence,
   signal-jamming, escape logistics.
4. **Act IV — The Room Above the Hill** (Orange County mansion): Garnier.
   "The mansion is not a house. It is a position." The finale is fought room
   by room as the architecture itself raises pressure.

## 9. Modularity for future chapters

Everything narrative or numeric is data:

- `data/manifestations.json` — species, stats, affinities, evolutions, art keys
- `data/moves.json` — tactics
- `data/types.json` — the affinity chart
- `data/zones/*.json` — maps, collision, encounter tables, NPCs, exits
- `data/dialogue/*.json` — scripts, with `source: "canon"` flags for verbatim
  manuscript text vs. `source: "adaptation"` for connective dialogue
- New chapters from the novel = new zone + dialogue + encounter JSON files.
  No engine changes.

## 10. Tone rules (enforced in content review)

1. Restraint: no neon, no explosions, no trailer voice. Analog dread.
2. The joke is never on the victims; it is on the machinery's self-regard.
3. Institutional language is the monster's hide — menus, items, and move
   descriptions use bureaucratic euphemism the player learns to read through.
4. Canon text is never paraphrased when it can be quoted.
5. Human cost stays human: defeated WITNESS allies are "discredited," never
   destroyed; the game never lets erasure feel clean.
