"use client";
import { useRef, useState, useEffect } from "react";
import { useAudioChannel } from "@/lib/audio";
import { Icon } from "./Icon";
export function Voice({
  src,
  label = "Voice audition",
}: {
  src: string;
  label?: string;
}) {
  const a = useRef<HTMLAudioElement>(null),
    c = useRef<HTMLCanvasElement>(null),
    audioCtx = useRef<AudioContext | null>(null),
    an = useRef<AnalyserNode | null>(null),
    [playing, set] = useState(false),
    [err, fail] = useState(false),
    [current, at] = useState(0),
    [dur, duration] = useState(0);
  useAudioChannel(a);
  const fmt = (n: number) =>
    `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
  useEffect(
    () => () => {
      void audioCtx.current?.close().catch(() => {});
    },
    [],
  );
  useEffect(() => {
    at(0);
    set(false);
    fail(false);
  }, [src]);
  useEffect(() => {
    const cv = c.current!,
      ctx = cv.getContext("2d")!;
    let frame = 0,
      seen = false;
    const arr = new Uint8Array(256);
    function paint() {
      const d = Math.min(2, devicePixelRatio),
        w = cv.clientWidth,
        h = cv.clientHeight;
      if (!w) return;
      if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) {
        cv.width = Math.round(w * d);
        cv.height = Math.round(h * d);
      }
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, w, h);
      an.current?.getByteFrequencyData(arr);
      ctx.fillStyle = playing ? "#b81d18" : "#9c9e99";
      for (let x = 0; x < w; x += 4) {
        const ht = playing
          ? Math.max(2, (arr[Math.floor((x / w) * 150)] / 255) * h)
          : 2 +
            (1 + Math.sin(x * 0.093) * Math.cos(x * 0.26)) *
              (4 + 3 * Math.sin(x * 0.19));
        ctx.fillRect(x, (h - ht) / 2, 2, ht);
      }
      if (
        playing &&
        seen &&
        !document.hidden &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        frame = requestAnimationFrame(paint);
    }
    function sync() {
      cancelAnimationFrame(frame);
      paint();
    }
    const io = new IntersectionObserver((es) => {
      seen = es[0].isIntersecting;
      sync();
    });
    io.observe(cv);
    const ro = new ResizeObserver(sync);
    ro.observe(cv);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [playing]);
  async function toggle() {
    const el = a.current!;
    if (!el.paused) {
      el.pause();
      return;
    }
    try {
      if (!audioCtx.current) {
        const ac = new AudioContext();
        audioCtx.current = ac;
        const n = ac.createAnalyser();
        n.fftSize = 512;
        ac.createMediaElementSource(el).connect(n);
        n.connect(ac.destination);
        an.current = n;
      }
      await audioCtx.current.resume();
    } catch {
      /* native playback is still available */
    }
    await el.play().catch(() => fail(true));
  }
  return (
    <div className="voice" data-playing={playing}>
      <button
        onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} ${label}`}
        className="round-play"
      >
        <Icon name={playing ? "pause" : "play"} size={17} />
      </button>
      <div className="voice-meta">
        <span>{label}</span>
        <small className="micro">
          {err ? "AUDIO UNAVAILABLE" : `${fmt(current)} / ${fmt(dur)}`}
        </small>
      </div>
      <canvas aria-hidden="true" ref={c} />
      <audio
        ref={a}
        src={"/audio/" + src + ".mp3"}
        preload="metadata"
        onPlay={() => { set(true); fail(false); }}
        onPause={() => set(false)}
        onEnded={() => set(false)}
        onTimeUpdate={(e) => at(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => duration(e.currentTarget.duration)}
      />
    </div>
  );
}
