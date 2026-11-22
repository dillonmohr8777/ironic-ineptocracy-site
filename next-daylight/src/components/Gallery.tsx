"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
export function Redaction() {
  const [open, set] = useState(false),
    x = useRef(0),
    dragged = useRef(false);
  return (
    <section className="redaction" aria-label="Declassify the premise">
      <div className="red-label">
        <span className="micro over">
          <b /> THE PREMISE
        </span>
        <span className="micro red-sub">EXTRACT / 001</span>
      </div>
      <p>
        Power rarely arrives{" "}
        <button
          className={"censor " + (open ? "unsealed" : "")}
          aria-expanded={open}
          aria-label={open ? "Redact premise" : "Reveal redacted premise"}
          onPointerDown={(e) => {
            x.current = e.clientX;
            dragged.current = false;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (e.buttons && Math.abs(e.clientX - x.current) > 12) {
              set(true);
              dragged.current = true;
            }
          }}
          onClick={() => {
            if (!dragged.current) set(!open);
          }}
        >
          <span>under its own name.</span>
        </button>
      </p>
      <button className="red-action micro" onClick={() => set(!open)}>
        <Icon name="peel" size={15} />
        {open ? "REDACT EXTRACT" : "PEEL TO REVEAL"}
      </button>
    </section>
  );
}
const plates = [
  ["01", "The atrium", "hero-daylight"],
  ["02", "Harvard Yard", "plate-harvard-daylight"],
  ["03", "Capitol colonnade", "plate-capitol-daylight"],
];
export function Gallery() {
  const [i, sel] = useState(0),
    [playing, set] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const ob = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) v.pause();
    });
    ob.observe(v);
    return () => ob.disconnect();
  }, [i]);
  return (
    <section className="gallery act" id="plates">
      <SectionHead
        num="02"
        label="LOCATION STUDIES"
        title="Architecture of power"
        note="PLATES 01 — 03"
      />
      <div className="plate-gallery">
        <figure>
          <div className="gallery-img">
            {i === 0 ? (
              <video
                ref={vid}
                src="/video/hero-daylight-loop.mp4"
                poster="/images/editorial/hero-daylight.webp"
                preload="none"
                muted
                loop
                playsInline
                aria-label="Sunlit marble atrium"
                onPlay={() => set(true)}
                onPause={() => set(false)}
              />
            ) : (
              <img
                loading="lazy"
                src={"/images/editorial/" + plates[i][2] + ".webp"}
                alt={plates[i][1] + " in daylight"}
              />
            )}
            <span className="photo-tag micro">
              PLATE {plates[i][0]} / DAYLIGHT
            </span>
            {i === 0 && (
              <button
                className="pill video-btn"
                onClick={() => {
                  if (playing) vid.current?.pause();
                  else vid.current?.play().catch(() => {});
                }}
              >
                <Icon name={playing ? "pause" : "play"} size={13} />
                {playing ? "Pause film" : "Play film"}
              </button>
            )}
          </div>
          <figcaption className="img-caption">
            <em>{plates[i][1]}.</em>
            <span className="micro">ARCHITECTURAL RECORD</span>
          </figcaption>
        </figure>
        <div className="plate-side">
          <span className="micro over">
            <b /> FIELD NOTES
          </span>
          <blockquote>
            “The map is not geography.
            <br />
            <em>It is pressure.</em>”
          </blockquote>
          <div className="plate-list">
            {plates.map(([n, title, src], j) => (
              <button
                key={n}
                className={j === i ? "selected" : ""}
                aria-pressed={j === i}
                onClick={() => {
                  sel(j);
                  set(false);
                }}
              >
                <img
                  loading="lazy"
                  src={"/images/editorial/" + src + ".webp"}
                  alt=""
                />
                <span>
                  <small className="micro">PLATE {n}</small>
                  {title}
                </span>
                <Icon name="up" size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function SectionHead({
  num,
  label,
  title,
  note,
}: {
  num: string;
  label: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="micro over">
          <b />
          {num} / {label}
        </span>
        <h2>
          {title}
          <i className="terminal">.</i>
        </h2>
      </div>
      {note && <span className="micro head-note">{note}</span>}
    </div>
  );
}
