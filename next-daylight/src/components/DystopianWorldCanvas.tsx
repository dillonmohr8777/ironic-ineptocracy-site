'use client';
import { useEffect, useRef } from 'react';
import { chamber } from '@/lib/chamber';
import { mountStage } from '@/lib/stage';
export default function DystopianWorldCanvas(){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const canvas=ref.current!,hero=canvas.closest<HTMLElement>('.hero');
    return mountStage(canvas,()=>{const r=chamber(canvas);if(!r)return null;
      return { draw(f){r.draw(f);hero?.style.setProperty('--lamp-shadow',((1-f.flicker)*.25).toFixed(3));},dispose:r.dispose };});
  },[]);
  return <div className="chamber" aria-hidden="true"><canvas ref={ref}/></div>;
}
