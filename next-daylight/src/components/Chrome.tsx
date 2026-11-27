"use client";
import { useRef, useState } from "react";
import { useAudioChannel } from "@/lib/audio";
import { Icon, Mark } from "./Icon";
const links = [
  ["The book", "/book/"],
  ["The cast", "/characters/"],
  ["World atlas", "/world/"],
  ["Dispatches", "/dispatches/"],
  ["Dossier", "/dossier/"],
  ["Reader guide", "/reader-guide/"],
  ["Press room", "/press/"],
];
export function Header() {
  const dialog = useRef<HTMLDialogElement>(null),
    audio = useRef<HTMLAudioElement>(null),
    [sound, soundOn] = useState(false);
  useAudioChannel(audio);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="progress" />
      <header className="mast">
        <div className="shell mast-in">
          <a className="brand" href="/" aria-label="Ineptocracy Archive home">
            <Mark />
            <span>
              Ineptocracy<span className="brand-alt"> Archive</span>
            </span>
          </a>
          <nav aria-label="Main navigation">
            {links.slice(0, 4).map(([s, h]) => (
              <a key={s} href={h}>
                {s}
              </a>
            ))}
          </nav>
          <div className="mast-actions">
            <button
              className="score" aria-pressed={sound}
              aria-label={`${sound ? "Mute" : "Play"} ambient daylight score`}
              onClick={async () => {
                const a = audio.current!;
                if (!a.paused) a.pause();
                else {
                  a.volume = 0.35;
                  await a.play().catch(() => {});
                }
              }}
            >
              <Icon name={sound ? "sound" : "mute"} size={16} />
              <span>Sound {sound ? "on" : "off"}</span>
            </button>
            <button
              onClick={() => dialog.current?.showModal()}
              className="index-btn"
            >
              <Icon name="menu" size={16} />
              Index
            </button>
          </div>
          <audio
            ref={audio}
            src="/audio/theme-daylight-score.mp3"
            preload="none"
            loop
            onPlay={() => soundOn(true)}
            onPause={() => soundOn(false)}
          />
        </div>
      </header>
      <dialog
        ref={dialog}
        className="index-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        aria-labelledby="archive-index"
      >
        <div className="drawer-head">
          <span className="micro">CASE 017 / DIRECTORY</span>
          <button
            className="icon-btn"
            aria-label="Close index"
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <h2 id="archive-index">Archive index</h2>
        {[["Frontispiece", "/"], ...links].map(([s, h], i) => (
          <a className="index-link" href={h} key={s}>
            <small className="micro">0{i}</small>
            {s}
            <Icon name="up" />
          </a>
        ))}
      </dialog>
    </>
  );
}
export function Footer() {
  return (
    <footer className="shell foot">
      <div>
        <a className="brand" href="/">
          <Mark />
          Ineptocracy Archive
        </a>
        <p>A novel by Dillon Mohr.</p>
      </div>
      <nav aria-label="Archive footer">
        {links.map(([s, h]) => (
          <a key={s} href={h}>
            {s}
          </a>
        ))}
      </nav>
      <div className="footline micro">
        <span>THE IRONIC INEPTOCRACY</span>
        <a href="#main">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
