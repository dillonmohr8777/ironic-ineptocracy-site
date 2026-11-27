"use client";
import { useRef, useState } from "react";
import cast from "@/lib/cast.json";
import { Voice } from "./Voice";
import { SectionHead } from "./Gallery";
import { Icon } from "./Icon";
export type Subject = (typeof cast)[number];
export function Stats({ subject }: { subject: Subject }) {
  return (
    <dl className="stats">
      {["Threat", "Loyalty", "Reach"].map((n, i) => (
        <div key={n}>
          <dt className="micro">{n}</dt>
          <dd>
            <span>
              <i style={{ width: subject.metrics[i] + "%" }} />
            </span>
            <small
              className="micro"
              title={
                subject.metrics[i]
                  ? "Index out of 100"
                  : "Not filed in the public record"
              }
            >
              {subject.metrics[i] || "N/F"}
            </small>
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function CastDeck() {
  const [idx, choose] = useState(0),
    r = useRef<HTMLDivElement>(null),
    s = cast[idx];
  function select(i: number) {
    choose((i + 10) % 10);
  }
  return (
    <section className="act" id="cast">
      <SectionHead
        num="03"
        label="BIOMETRIC INDEX"
        title="The cast files"
        note="10 SUBJECTS / TIER 01"
      />
      <div
        className="roster"
        ref={r}
        aria-label="Subject roster"
        onKeyDown={(e) => {
          if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key))
            return;
          e.preventDefault();
          const n =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? 9
                : (idx + (e.key === "ArrowRight" ? 1 : -1) + 10) % 10;
          select(n);
          r.current?.querySelectorAll("button")[n].focus();
        }}
      >
        {cast.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => choose(i)}
            aria-pressed={idx === i}
            aria-label={`Select ${p.name}`}
            className={idx === i ? "active" : ""}
          >
            <span className="thumb">
              <img src={p.image} alt="" loading="lazy" width="90" height="90" />
            </span>
            <small className="micro">{p.number}</small>
            <span>{p.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>
      <div className="specimen" id="subject">
        <div className="spec-photo">
          <img
            loading="lazy"
            src={s.image}
            alt={s.name + " / archival cast portrait"}
            width="896"
            height="1200"
          />
          <span className="photo-tag micro">35 MM / SUBJECT {s.number}</span>
        </div>
        <div className="spec-copy">
          <div className="spec-top micro">
            <span>SUBJECT FILE / {s.number}</span>
            <span className="tag">{s.group}</span>
          </div>
          <h3>{s.name}</h3>
          <p className="role">{s.role}</p>
          <p className="body-copy">{s.bio}</p>
          <Stats subject={s} />
          <Voice
            key={s.audio}
            src={s.audio}
            label={`${s.name.split(" ")[0]}’s audition`}
          />
          <a className="text-link" href={"/characters/" + s.slug + "/"}>
            Open subject file <Icon name="up" size={14} />
          </a>
        </div>
      </div>
      <div className="cast-tail">
        <a className="text-link" href="/characters/">
          Browse the full index <Icon name="right" size={16} />
        </a>
        <Voice src="cast-audition-reel" label="Full-cast audition reel" />
      </div>
    </section>
  );
}
export function CastGallery() {
  const [f, set] = useState("All");
  return (
    <>
      <div className="filter-row">
        {["All", "Students & Allies", "Intelligence", "Power"].map((n) => (
          <button
            key={n}
            aria-pressed={f === n}
            onClick={() => set(n)}
            className={f === n ? "on" : ""}
          >
            {n}
          </button>
        ))}
        <span className="micro">
          {String(
            cast.filter((s) => f === "All" || s.group === f).length,
          ).padStart(2, "0")}{" "}
          FILES
        </span>
      </div>
      <div className="cast-grid">
        {cast
          .filter((s) => f === "All" || s.group === f)
          .map((s) => (
            <a href={"/characters/" + s.slug + "/"} key={s.slug}>
              <div className="index-photo">
                <img
                  src={s.image}
                  alt={"Portrait of " + s.name}
                  width="896"
                  height="1200"
                />
                <span className="photo-tag micro">FILE / {s.number}</span>
              </div>
              <small className="micro">{s.group}</small>
              <h2>{s.name}</h2>
              <p>
                {s.role} <Icon name="up" size={15} />
              </p>
            </a>
          ))}
      </div>
    </>
  );
}
