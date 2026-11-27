"use client";
import { useEffect, useRef, useState } from "react";
import { useWorld, usePaused } from "@/lib/useWorld";
import type { WorldMode } from "@/lib/worldMode";
import { Icon } from "./Icon";
// Verbatim, spoiler-safe lines from the public Garnier Dossier.
const extracts = [
  ["Power rarely arrives", "under its own name."],
  ["He does not sell domination.", "He sells relief from disorder."],
  ["Read every private room", "as a public clue."],
  ["It is not a biography.", "It is a pressure map."],
];
export function Redaction(){
  const [i, select]=useState(0), [open,seal]=useState(false), x=useRef(0), dragged=useRef(false);
  const turn=()=>{select((i+1)%extracts.length);seal(false);dragged.current=false};
  return <section className="redaction" aria-label="Public dossier extracts"><div className="red-label"><span className="micro over"><b/> THE PREMISE</span><button className="red-sub micro" onClick={turn} aria-label={`Next extract, current extract ${i+1} of 4`}>EXTRACT 00{i+1} <span aria-hidden="true">↻</span></button></div><p aria-live="polite">{extracts[i][0]} <button className={"censor "+(open?"unsealed":"")} aria-expanded={open} aria-label={open?"Reseal extract":"Peel to reveal extract"} onPointerDown={e=>{x.current=e.clientX;dragged.current=false;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(e.buttons&&Math.abs(e.clientX-x.current)>12){seal(true);dragged.current=true}}} onClick={e=>{if(!dragged.current||e.detail===0)seal(!open);dragged.current=false}}><span aria-hidden={!open}>{extracts[i][1]}</span></button></p><button className="red-action micro" onClick={()=>seal(!open)} aria-expanded={open}><Icon name="peel" size={16}/>{open?"RESEAL EXTRACT":"PEEL TO REVEAL"}</button></section>;
}
const plates = [
  ["01", "The atrium", "hero-daylight"],
  ["02", "Harvard Yard", "plate-harvard-daylight"],
  ["03", "Capitol colonnade", "plate-capitol-daylight"],
];
export function Gallery({ films }: { films: Record<WorldMode,string|null> }) {
  const mode=useWorld(), paused=usePaused(), [failed,setFailed]=useState('');
  const preferred=films[mode], fallback=!preferred||failed===preferred, daylight='/video/hero-daylight-loop.mp4', src=fallback?daylight:preferred;
  const want=useRef(false);
  const [i, sel] = useState(0),
    [playing, set] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(()=>{if(paused){want.current=false;vid.current?.pause();}},[paused]);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const ob = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) {want.current=false;v.pause();}
    });
    ob.observe(v);
    const hide=()=>{if(document.hidden){want.current=false;v.pause()}}; document.addEventListener("visibilitychange",hide);return () => {ob.disconnect();document.removeEventListener("visibilitychange",hide)};
  }, [i]);
  return (
    <section className="gallery act" id="plates">
      <SectionHead
        num="02"
        label="LOCATION STUDIES"
        title="Architecture of power"
        note="PLATES 01 - 03"
      />
      <div className="plate-gallery">
        <figure>
          <div className="gallery-img">
            {i === 0 ? (
              <video
                ref={vid}
                src={src}
                data-grade={fallback?mode:'native'}
                onError={()=>{if(preferred && src!==daylight)setFailed(preferred);else{want.current=false;set(false);}}}
                onLoadedData={()=>{if(want.current&&!paused)void vid.current?.play().catch(()=>set(false))}}
                poster={mode === "midnight" ? "/images/editorial/hero-midnight.webp" : mode === "dusk" ? "/images/editorial/hero-dusk.webp" : "/images/editorial/hero-daylight.webp"}
                preload="none"
                muted
                loop
                playsInline
                aria-label={`${mode} location film: the atrium`}
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
              PLATE {plates[i][0]} / {i===0?mode.toUpperCase():"DAYLIGHT"}
            </span>
            {i === 0 && (
              <button
                className="pill video-btn"
                onClick={() => {
                  want.current=!playing; if (playing) vid.current?.pause();
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
                  want.current=false;sel(j);
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
