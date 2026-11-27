"use client";
import { useEffect, type RefObject } from "react";
const PLAY = "ineptocracy:audio-play";
/** The media element that actually begins playback owns the channel. */
export function useAudioChannel(ref: RefObject<HTMLAudioElement|null>){
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const announce=()=>window.dispatchEvent(new CustomEvent(PLAY,{detail:el}));
    const yieldChannel=(e:Event)=>{if((e as CustomEvent).detail!==el&&!el.paused)el.pause()};
    el.addEventListener('play',announce);window.addEventListener(PLAY,yieldChannel);
    return ()=>{el.removeEventListener('play',announce);window.removeEventListener(PLAY,yieldChannel);el.pause()};
  },[ref]);
}
