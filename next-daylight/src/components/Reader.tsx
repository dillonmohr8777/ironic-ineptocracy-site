"use client";
import { useState } from "react";
import scenes from "@/lib/scenes.json";
import { SectionHead } from "./Gallery";
const titles = [
  "East Atlanta & 1600 SAT",
  "Pacific Coast",
  "Philadelphia Tail",
  "Harvard & Langley",
];
const notes = [
  [
    "Sound",
    "A heartbeat inside an empty room. The first institution Darnell faces is a hospital, not Harvard.",
  ],
  [
    "Framing",
    "Hold the horizon level. Garnier never needs to raise his voice.",
  ],
  ["Eyeline", "The stranger watches the game. Darnell watches the stranger."],
  [
    "Scale",
    "Two desks and two beds against a university endowment. Let the room make the comparison.",
  ],
];
export function Reader() {
  const [s, sel] = useState(0),
    [director, mode] = useState(false);
  return (
    <section className="act" id="reader">
      <SectionHead
        num="04"
        label="SCREENPLAY READER"
        title="The cold open"
        note="FOUR SCENES / PUBLIC EXCERPT"
      />
      <div className="reader-box">
        <aside className="scene-list">
          <span className="micro over">SCENE SELECT</span>
          {titles.map((t, i) => (
            <button
              key={t}
              aria-pressed={s === i}
              className={s === i ? "on" : ""}
              onClick={() => sel(i)}
            >
              <small className="micro">0{i + 1}</small>
              {t}
            </button>
          ))}
          <div className="reader-modes">
            <span className="micro">READING MODE</span>
            {["Archival Print", "Director’s Annotated"].map((t, i) => (
              <button
                key={t}
                onClick={() => mode(!!i)}
                aria-pressed={director === !!i}
              >
                <i className={director === !!i ? "checked" : ""} />
                {t}
              </button>
            ))}
          </div>
        </aside>
        <div className="page-wrap">
          <div
            className="script-paper"
            key={`${s}${director}`}
            tabIndex={0}
            role="region"
            aria-label={"Screenplay: " + titles[s]}
          >
            <div className="script-header micro">
              CASE 017 / COLD OPEN <span>0{s + 1}.</span>
            </div>
            {director && (
              <aside className="director-note">
                <b>Margin / {notes[s][0]}</b>
                {notes[s][1]}
              </aside>
            )}
            {scenes[s].map((line, j) => (
              <p
                key={j}
                className={
                  line === line.toUpperCase()
                    ? "slugline"
                    : scenes[s][j - 1]?.match(
                          /^(DARNELL|ATTENDING PHYSICIAN|POWER BROKER|GARNIER|JAVON|SPORTS ANNOUNCER)/,
                        )
                      ? "dialogue"
                      : ""
                }
              >
                {line}
              </p>
            ))}
            <span className="micro">END SCENE / 0{s + 1}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
