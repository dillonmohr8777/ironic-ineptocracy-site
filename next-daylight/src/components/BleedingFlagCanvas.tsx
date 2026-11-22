"use client";
import { useEffect, useRef, useState } from "react";
import { material, webRenderer, paperRenderer } from "@/lib/flag";
import { Icon } from "./Icon";
export default function BleedingFlagCanvas() {
  const host = useRef<HTMLDivElement>(null),
    [paused, setPaused] = useState(false),
    ctrl = useRef<(p: boolean) => void>(() => {});
  useEffect(() => {
    const el = host.current!;
    let c = document.createElement("canvas");
    const mat = material();
    let engine;
    try {
      engine = webRenderer(c, mat);
    } catch {}
    const renderer = engine ? "webgl2" : "paper";
    if (!engine) {
      c = document.createElement("canvas");
      engine = paperRenderer(c, mat);
    }
    const render = engine;
    c.setAttribute("aria-hidden", "true");
    el.appendChild(c);
    el.dataset.renderer = renderer;
    let t = 1.1,
      id = 0,
      prev = 0,
      seen = false,
      wind = 0,
      target = 0;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let stop = mq.matches;
    setPaused(stop);
    function draw() {
      render.draw(t, wind);
      el.dataset.ready = "true";
    }
    function tick(now: number) {
      id = 0;
      if (stop || !seen || document.hidden) return;
      t += prev ? Math.min((now - prev) / 1000, 0.06) : 0;
      prev = now;
      wind += (target + Math.min(scrollY / 1500, 0.7) - wind) * 0.035;
      draw();
      id = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(id);
      prev = 0;
      if (seen && !stop && !document.hidden) id = requestAnimationFrame(tick);
    }
    ctrl.current = (p) => {
      stop = p;
      sync();
    };
    function reduced() {
      stop = mq.matches;
      setPaused(stop);
      sync();
    }
    function move(e: PointerEvent) {
      const r = el.getBoundingClientRect();
      target =
        1.2 -
        Math.min(
          1.1,
          Math.hypot(
            (e.clientX - r.left) / r.width - 0.5,
            (e.clientY - r.top) / r.height - 0.5,
          ) * 2,
        );
    }
    function leave() {
      target = 0;
    }
    const ro = new ResizeObserver(() => {
      const d = Math.min(devicePixelRatio, 2);
      c.width = Math.max(1, Math.round(el.clientWidth * d));
      c.height = Math.max(1, Math.round(el.clientHeight * d));
      draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver((entries) => {
      seen = entries[0].isIntersecting;
      sync();
    });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    mq.addEventListener("change", reduced);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", reduced);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      c.remove();
      render.dispose();
    };
  }, []);
  return (
    <figure className="flag-study">
      <div className="plate-top micro">
        <span>
          <b className="live-dot" /> LIVE ARTWORK
        </span>
        <span>FIG. 01 / 06</span>
      </div>
      <div className="print-bed">
        <i />
        <i />
        <i />
        <i />
        <div
          ref={host}
          className="flag-canvas"
          role="img"
          aria-label="The Bleeding Standard: a rippling linen American flag shedding vermilion ink onto paper."
        >
          <img
            className="print-poster"
            src="/images/editorial/standard-print.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            width="1440"
            height="784"
          />
        </div>
        <div className="calibrate" aria-hidden="true" />
      </div>
      <figcaption>
        <div>
          <em>The Bleeding Standard</em>
          <span className="micro">GENERATIVE CLOTH STUDY, NO. 01</span>
        </div>
        <button
          className="pill"
          onClick={() => {
            ctrl.current(!paused);
            setPaused(!paused);
          }}
        >
          <Icon name={paused ? "play" : "pause"} size={12} />
          {paused ? "Resume Motion" : "Pause Motion"}
        </button>
      </figcaption>
    </figure>
  );
}
