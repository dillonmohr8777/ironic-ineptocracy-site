'use client';
import { useEffect, useRef, useState } from 'react';
import { ArchiveLine, type Speaker } from '@/lib/archiveLine';
import { onAudioClaim, claimAudio } from '@/lib/audio';
import { currentMode } from '@/lib/worldMode';
import { usePaused } from '@/lib/useWorld';
import { briefing, lookup } from '@/lib/briefing';
import cast from '@/lib/cast.json';
import { Icon } from './Icon';

type State='briefing'|'dialling'|'live'|'offline';
type Entry={who:Speaker|'Local file';text:string;link?:{href:string;label:string}};
const station: Record<State,string>={briefing:'Standby',dialling:'Calling archive',live:'Line open',offline:'Local briefing'};
export default function LiveArchivist(){
  const [state,status]=useState<State>('briefing'), [mic,setMic]=useState<'off'|'waiting'|'on'>('off'), [held,hold]=useState(false), [note,notify]=useState(''), [question,type]=useState(''),[entries,setEntries]=useState<Entry[]>([]);
  const line=useRef<ArchiveLine|null>(null),owner=useRef({}),boundary=useRef(true),scope=useRef<HTMLCanvasElement>(null),log=useRef<HTMLDivElement>(null),paused=usePaused();
  function record(who:Entry['who'],text:string,append=false,link?:Entry['link']){const join=append&&!boundary.current;boundary.current=!append;
    setEntries(prev=>{const last=prev.at(-1);return join&&last?.who===who?[...prev.slice(0,-1),{who,text:(last.text+text).slice(-6000)}]:[...prev.slice(-39),{who,text,link}]});}
  function close(msg='Line closed. Local briefs are available.') {line.current?.close();line.current=null;setMic('off');hold(false);status('briefing');notify(msg);boundary.current=true;}
  useEffect(()=>{const off=onAudioClaim(owner.current,()=>{if(line.current)close('Line closed for another audio file.');});const hide=()=>{if(document.hidden&&line.current)close('Line closed while the archive was in the background.')};document.addEventListener('visibilitychange',hide);return()=>{off();document.removeEventListener('visibilitychange',hide);line.current?.close();line.current=null};},[]);
  function open(){if(line.current)return;claimAudio(owner.current);status('dialling');notify('Connecting without a microphone.');
    const session=new ArchiveLine({ready:()=>{status('live');notify('Connected. Type a question or enable the microphone.');},unavailable:()=>{line.current=null;status('offline');hold(false);setMic('off');notify('Live service unavailable. The local briefing desk is open.');},transcript:(who,text)=>record(who,text,true),turn:()=>{boundary.current=true}});
    line.current=session;void session.open(currentMode());}
  function ask(raw:string,local=false){const text=raw.trim().slice(0,500);if(!text)return;record('Reader',text);type('');
    if(!local&&state==='live'&&line.current?.text(text))return;
    const b=lookup(text);record('Local file',b?.a??'This desk holds four indexed answers: Garnier, NeuroClick, the title and Darnell at Harvard. Choose a question or consult the complete subject index.',false,b?{href:b.href,label:b.label}:{href:'/characters/',label:'Browse subject files'});}
  async function enable(){const session=line.current;if(!session||mic!=='off')return;setMic('waiting');const ok=await session.enableMic();if(line.current!==session)return;setMic(ok?'on':'off');notify(ok?'Mic armed. Audio is sent only while you hold Talk.':'Mic unavailable. Type to the live archivist or use a local brief.');}
  function talk(active:boolean){line.current?.talk(active);hold(active);}
  useEffect(()=>{const release=()=>{line.current?.talk(false);hold(false)};window.addEventListener('blur',release);return()=>window.removeEventListener('blur',release)},[]);
  useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight},[entries]);
  useEffect(()=>{const c=scope.current!,g=c.getContext('2d');if(!g)return;let raf=0,seen=false;const values=new Uint8Array(512);
    function draw(){if(!g)return;const w=560,h=72;g.clearRect(0,0,w,h);const an=line.current?.analyser;if(an)an.getByteTimeDomainData(values);g.strokeStyle=getComputedStyle(c).color;g.lineWidth=1.6;g.beginPath();for(let i=0;i<=256;i++){const y=h*.5+(an?(values[i]-128)*.37:0);if(i)g.lineTo(i*w/256,y);else g.moveTo(0,y);}g.stroke();if(seen&&state==='live'&&!paused&&!document.hidden)raf=requestAnimationFrame(draw);}
    function sync(){cancelAnimationFrame(raf);draw()}const io=new IntersectionObserver(([e])=>{seen=e.isIntersecting;sync()});io.observe(c);const theme=new MutationObserver(sync);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-mode']});sync();return()=>{io.disconnect();theme.disconnect();cancelAnimationFrame(raf)}},[state,paused]);
  return <section className="comms act" id="live-archivist" aria-labelledby="line-title"><div className="comms-binding micro"><span>LIVE ARCHIVE LINE // CASE 017</span><span>READER SERVICES / EXT. 04</span></div>
    <div className="console-body"><div className="line-intro"><span className="micro over"><b/> INTERVIEW DESK</span><h2 id="line-title">The live <em>archivist.</em></h2><p>Ask who financed the room, or who gets to leave it. Consult the public files by voice or in writing.</p>
    <div className="receiver"><div className="receiver-label micro"><span><i className="live-dot"/>{station[state]}</span><span>RX / 24 kHz</span></div><canvas ref={scope} width="560" height="72" aria-label="Archivist audio output waveform"/></div>
    {state==='live'||state==='dialling'?<button className="btn secondary" onClick={()=>close()}>{state==='live'?'Close Live Line':'Cancel connection'}</button>:<button className="btn primary" onClick={open}><Icon name="sound" size={16}/>Open Live Voice Line</button>}
    <p className="line-note">Gemini Live receives only what you send on an open line. Local briefs stay on this device.</p>
    {state==='live'&&<div className="mic-controls">{mic==='on'?<><button className="pill" aria-pressed={held} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);talk(true)}} onPointerUp={()=>talk(false)} onLostPointerCapture={()=>talk(false)} onPointerCancel={()=>talk(false)} onKeyDown={e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();if(!e.repeat)talk(true)}}} onKeyUp={e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();talk(false)}}} onBlur={()=>talk(false)}>{held?'Transmitting':'Hold to talk'}</button><button className="pill" onClick={()=>{line.current?.mute();setMic('off');hold(false);notify('Mic muted and released.')}}>Mute mic</button></>:<button className="pill" onClick={enable} disabled={mic==='waiting'}>{mic==='waiting'?'Awaiting permission':'Enable microphone'}</button>}</div>}
    <p className="line-note" role="status">{note}</p></div>
    <div className="briefing-desk"><span className="micro over">01 / QUESTION REGISTER</span><div className="starters">{briefing.map((b,i)=><button key={b.q} onClick={()=>ask(b.q)}><small className="micro">0{i+1}</small>{b.q}<Icon name="up" size={14}/></button>)}</div>
    <div className="transcript" role="log" aria-label="Archive line transcript" aria-live="polite" ref={log}>{entries.length?entries.map((e,i)=><p key={i}><b className="micro">{e.who.toUpperCase()} / </b>{e.text} {e.link&&<a href={e.link.href}>{e.link.label} ↗</a>}</p>):<p><b className="micro">LOG 000 / </b> No testimony on file. Choose a question to begin.</p>}</div>
    <form className="line-form" onSubmit={e=>{e.preventDefault();ask(question)}}><label className="micro" htmlFor="inquiry">{state==='live'?'LIVE TEXT INPUT':'LOCAL BRIEFING Q&A'}</label><div><input id="inquiry" maxLength={500} value={question} onChange={e=>type(e.target.value)} required autoComplete="off" placeholder="Enter a question"/><button className="btn secondary" type="submit">Send <Icon name="right" size={14}/></button></div></form>
    {state==='live'&&<button className="direct-read" onClick={()=>close('Local briefing selected. No live line is open.')}>Switch to local briefing</button>}
    <details className="audition-links"><summary>Cast voice auditions <span className="micro">10 FILES</span></summary><div>{cast.map(c=><a href={`/characters/${c.slug}/#audition`} key={c.slug}>{c.name} ↗</a>)}</div></details></div></div></section>;
}
