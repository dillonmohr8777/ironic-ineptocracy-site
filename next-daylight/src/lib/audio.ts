'use client';
import { useEffect, type RefObject } from 'react';
import { currentBallast } from './stage';
import type { WorldMode } from './worldMode';
export const PLAY = 'ineptocracy:audio-play';
export function claimAudio(owner: object) { window.dispatchEvent(new CustomEvent(PLAY,{detail:owner})); }
export function onAudioClaim(owner: object, yieldChannel: () => void) {
  const listen = (e: Event) => { if ((e as CustomEvent).detail !== owner) yieldChannel(); };
  window.addEventListener(PLAY,listen); return () => window.removeEventListener(PLAY,listen);
}
export function useAudioChannel(ref: RefObject<HTMLAudioElement|null>){
  useEffect(()=>{const el=ref.current;if(!el)return;const announce=()=>claimAudio(el),off=onAudioClaim(el,()=>el.pause());
    el.addEventListener('play',announce);return ()=>{el.removeEventListener('play',announce);off();el.pause()};},[ref]);
}
// A single disposable source. Drones are synthesized locally, never mixed with a voice file.
export function ambience(mode: WorldMode, fail: () => void): () => void {
  let closed=false;
  if(mode==='daylight') {const a=new Audio('/audio/theme-daylight-score.mp3');a.loop=true;a.volume=.32;
    void a.play().catch(()=>{if(!closed)fail()}); return ()=>{closed=true;a.pause();a.removeAttribute('src');a.load()};}
  const ctx=new AudioContext(),bus=ctx.createGain(),bed=ctx.createBiquadFilter();
  const night=mode==='midnight'; bus.gain.value=.0001;bus.connect(ctx.destination);bed.type='lowpass';bed.frequency.value=night?540:420;bed.connect(bus);
  for(const [hz,amp] of (night?[[60,.46],[120,.17],[59.6,.17],[39,.14]]:[[55,.35],[82.41,.20],[110.18,.13],[164.82,.07]])){
    const osc=ctx.createOscillator(),level=ctx.createGain();osc.type=hz===120?'triangle':'sine';osc.frequency.value=hz;level.gain.value=amp;osc.connect(level).connect(bed);osc.start();}
  const sample=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=sample.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  const noise=ctx.createBufferSource(),filt=ctx.createBiquadFilter(),grit=ctx.createGain();noise.buffer=sample;noise.loop=true;filt.type='bandpass';filt.frequency.value=night?1250:210;filt.Q.value=.7;grit.gain.value=.005;noise.connect(filt).connect(grit).connect(bus);noise.start();
  const tint=()=>{const key=night?currentBallast():1;bus.gain.setTargetAtTime(.105*(.62+.38*key),ctx.currentTime,.08);grit.gain.setTargetAtTime(.009+.057*(1-key),ctx.currentTime,.09);};
  tint();const timer=setInterval(tint,100);void ctx.resume().catch(()=>{if(!closed)fail()});
  return ()=>{closed=true;clearInterval(timer);void ctx.close().catch(()=>{});};
}
