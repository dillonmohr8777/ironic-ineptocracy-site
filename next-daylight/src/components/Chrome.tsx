"use client";
import { useEffect, useRef, useState } from "react";
import { claimAudio, onAudioClaim, ambience } from "@/lib/audio";
import { chooseMode, installClock, labels, type Selection } from "@/lib/worldMode";
import { useWorld, useSelection } from "@/lib/useWorld";
import { inbox } from "@/lib/contact";
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
export function EditionLabel(){return <><span className="edition day">{labels.daylight}</span><span className="edition dusk">{labels.dusk}</span><span className="edition night">{labels.midnight}</span></>;}
export function Header() {
  const dialog = useRef<HTMLDialogElement>(null), owner = useRef({});
  const [sound, soundOn] = useState(false), [time, clock] = useState(''), mode = useWorld(), selection = useSelection();
  useEffect(() => { const off=installClock(),change=()=>clock(new Date().toLocaleTimeString('en-GB',{hour12:false}));change();const id=setInterval(change,1000);return ()=>{off();clearInterval(id)}; },[]);
  useEffect(() => onAudioClaim(owner.current,()=>soundOn(false)),[]);
  useEffect(() => {if(!sound)return; try{return ambience(mode,()=>soundOn(false))} catch{soundOn(false)}},[sound,mode]);
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
          <div className="telemetry"><div className="dial-label micro"><span className="edition-name" aria-label="Active edition"><EditionLabel/></span><time aria-label="Local time">{time || 'LOCAL'}</time></div><div className="mode-dial" role="group" aria-label="World lighting">{([['auto','Auto'],['daylight','Day'],['dusk','Dusk'],['midnight','Midnight']] as [Selection,string][]).map(([value,label])=><button type="button" key={value} data-choice={value} aria-label={value==='auto'?'Auto: follow local time':labels[value]+(value==='midnight'?' (00:00 to 07:00)':'')} aria-pressed={selection===value} onClick={()=>chooseMode(value)}>{label}</button>)}</div></div>
          <div className="mast-actions">
            <button className="score" aria-pressed={sound} aria-label={`${sound ? "Mute" : "Play"} ${mode} ambience`}
              onClick={() => {if(!sound)claimAudio(owner.current);soundOn(!sound)}}
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
        <p id="archive-index">Archive index</p>
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
        <p>A novel by Dillon Mohr.<br/><a className="contact" href={`mailto:${inbox}`}>{inbox}</a></p>
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
