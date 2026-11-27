'use client';
import { useEffect, useRef } from 'react';
import { PRINT_PHASE, webRenderer } from '@/lib/flag';
import { mountStage } from '@/lib/stage';
import { pauseMotion } from '@/lib/worldMode';
import { usePaused } from '@/lib/useWorld';
import DystopianWorldCanvas from './DystopianWorldCanvas';
import { Icon } from './Icon';
export default function BleedingFlagCanvas(){
  const ref=useRef<HTMLCanvasElement>(null),paused=usePaused();
  useEffect(()=>{const c=ref.current!;return mountStage(c,()=>{
    const r=webRenderer(c);if(!r)return null;
    return {draw(f){const ratio=Math.min(devicePixelRatio,1.5),w=Math.max(1,Math.round(c.clientWidth*ratio)),h=Math.max(1,Math.round(c.clientHeight*ratio));
      if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
      r.draw(PRINT_PHASE+f.time,.13+.35*f.scroll+.21*Math.abs(f.x),.5+.4*f.x,f.y*.35,f.mode,f.flicker);
    },dispose:r.dispose};});},[]);
  return <figure className="flag-study"><div className="plate-top micro"><span><b className="live-dot"/> OBSERVATION THEATRE</span><span>CAM 01 / NORTH GALLERY</span></div>
    <div className="print-bed"><DystopianWorldCanvas/><i/><i/><i/><i/>
      <div className="flag-canvas" role="img" aria-label="The Bleeding Standard, a suspended linen flag shedding ink inside the North Gallery colonnade."><img className="print-poster" src="/images/editorial/standard-cutout.webp" alt="" width="1080" height="588" fetchPriority="high"/><canvas ref={ref} aria-hidden="true"/></div>
      <div className="film-slate micro" aria-hidden="true"><span>INT. 017</span><span>TAKE 01</span></div>
    </div><figcaption><div><em>The Bleeding Standard</em><span className="micro">CLOTH & LIGHT STUDY, NO. 01</span></div>
    <button className="pill motion-btn" aria-pressed={paused} onClick={()=>pauseMotion(!paused)} disabled={paused && typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches}><Icon name={paused?'play':'pause'} size={12}/>{paused?'Resume Motion':'Pause Motion'}</button></figcaption></figure>;
}
