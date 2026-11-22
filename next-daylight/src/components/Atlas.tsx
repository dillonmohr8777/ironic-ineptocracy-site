"use client";
import { useState, useId } from "react";
import { SectionHead } from "./Gallery";
import paths from "@/lib/map.json";
import { Icon } from "./Icon";
const stops = [
  [
    "East Atlanta",
    -84.39,
    33.75,
    "Merit becomes evidence",
    "A valedictorian leaves East Atlanta with a perfect score and a loss no transcript can record.",
    "darnell-covington",
  ],
  [
    "Harvard",
    -71.12,
    42.38,
    "Promise becomes paperwork",
    "Two roommates meet in a dorm that measures barely three hundred square feet.",
    "javon-whitfield",
  ],
  [
    "Philadelphia",
    -75.17,
    39.95,
    "A familiar stranger",
    "A man from Darnell’s graduation reappears in a corner bar. His attention is fixed on a baseball game.",
    "alec-daheim",
  ],
  [
    "Langley",
    -77.15,
    38.95,
    "Protection becomes pressure",
    "Glass, polished marble, and a field operative with thirty-three passports.",
    "alec-daheim",
  ],
  [
    "Pacific Coast",
    -121.6,
    36.3,
    "Private capital",
    "Above the Pacific, Dijon Garnier describes politics in the language of distribution.",
    "dijon-garnier",
  ],
  [
    "Pier 17",
    -74.0,
    40.71,
    "The waterfront file",
    "At the water’s edge, Leah’s file asks who can move people outside the official record.",
    "leah",
  ],
] as const;
const xy = (i: number) => [
  (stops[i][1] + 126) * 12 + 20,
  (50 - stops[i][2]) * 15 + 12,
];
export function Atlas() {
  const [i, sel] = useState(0);
  const id = useId(),
    s = stops[i];
  return (
    <section className="act" id="atlas">
      <SectionHead
        num="05"
        label="GEOGRAPHIC RECORD"
        title="Pressure-route atlas"
        note="06 PRESSURE POINTS"
      />
      <div className="atlas-area">
        <div className="map-bed">
          <button className="map-key micro" popoverTarget={id + "key"}>
            MAP KEY +
          </button>
          <aside popover="auto" id={id + "key"} className="map-pop">
            <span className="over micro">
              <b /> ATLAS LEGEND
            </span>
            <h3>Reading the route.</h3>
            <p>
              Vermilion marks the selected location. The dotted line follows the
              archive’s reading order, not a travel itinerary.
            </p>
            <button
              className="pill"
              popoverTarget={id + "key"}
              popoverTargetAction="hide"
            >
              Close key
            </button>
          </aside>
          <svg
            className="map"
            viewBox="0 0 790 420"
            aria-label="Map of six American pressure points"
          >
            <defs>
              <pattern
                id={id}
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M24 0H0V24"
                  fill="none"
                  stroke="#dedcd2"
                  strokeWidth=".65"
                />
              </pattern>
            </defs>
            <rect width="790" height="420" fill={`url(#${id})`} />
            {paths.map((p, j) => (
              <path
                d={p}
                key={j}
                fill="#e9e8df"
                stroke="#fff"
                strokeWidth="1"
              />
            ))}
            <polyline
              points={stops.map((_, j) => xy(j).join(",")).join(" ")}
              fill="none"
              stroke="#a83228"
              strokeWidth="1.4"
              strokeDasharray="4 4"
            />
            {stops.map((t, j) => (
              <g
                key={t[0]}
                role="button"
                aria-label={`Inspect ${t[0]}`}
                tabIndex={0}
                onClick={() => sel(j)}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key)) {
                    e.preventDefault();
                    sel(j);
                  }
                }}
                className="pin"
                transform={`translate(${xy(j)})`}
              >
                <circle
                  r={i === j ? 10 : 6.5}
                  fill={i === j ? "#ad241e" : "#13203a"}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <title>{t[0]}</title>
              </g>
            ))}
          </svg>
        </div>
        <div className="map-note" aria-live="polite">
          <span className="micro over">
            <b />
            NODE 0{i + 1} / 06
          </span>
          <h3>{s[0]}</h3>
          <small className="micro">
            {s[2].toFixed(2)}° N, {Math.abs(s[1]).toFixed(2)}° W
          </small>
          <p>{s[4]}</p>
          <a href={"/characters/" + s[5] + "/"} className="text-link">
            Related file <Icon name="up" size={14} />
          </a>
        </div>
      </div>
      <div className="stop-list">
        {stops.map((t, j) => (
          <button aria-pressed={j === i} key={t[0]} onClick={() => sel(j)}>
            <small className="micro">0{j + 1}</small>
            {t[0]}
          </button>
        ))}
      </div>
    </section>
  );
}
