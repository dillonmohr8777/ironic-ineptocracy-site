"use client";
import { useEffect, useRef, useState } from "react";
import { PRINT_PHASE, webRenderer } from "@/lib/flag";
import { Icon } from "./Icon";
export default function BleedingFlagCanvas() {
  const host=useRef<HTMLDivElement>(null), ctrl=useRef<(p:boolean)=>void>(()=>{});
  const [paused,setPaused]=useState(false), [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{
    const el=host.current!,canvas=document.createElement('canvas'),mq=matchMedia('(prefers-reduced-motion: reduce)');
    let render:ReturnType<typeof webRenderer>=null,t=PRINT_PHASE,stop=mq.matches,seen=false,raf=0,last=0,wind=0,target=0,focus=.5,tx=.5,sweep=0,dir=0;
    canvas.setAttribute('aria-hidden','true');setPaused(stop);el.dataset.renderer='print';
    function size(){if(!render)return;const d=Math.min(2,devicePixelRatio);canvas.width=Math.max(1,Math.round(el.clientWidth*d));canvas.height=Math.max(1,Math.round(el.clientHeight*d));render.draw(t,wind,focus,sweep)}
    function init(){if(render)return true;try{render=webRenderer(canvas)}catch{render=null}if(!render){setUnavailable(true);return false}
      el.append(canvas);size();el.dataset.ready='true';el.dataset.renderer='webgl2';return true;}
    function tick(now:number){raf=0;if(stop||!seen||document.hidden||!render)return;
      const dt=last?Math.min(.18,(now-last)/1000):0,k=1-Math.exp(-4*dt);last=now;t+=dt;
      wind+=(target+Math.min(scrollY/1000,.64)-wind)*k;focus+=(tx-focus)*k;sweep+=(dir-sweep)*k;dir*=Math.exp(-3*dt);
      render.draw(t,wind,focus,sweep);raf=requestAnimationFrame(tick)}
    function sync(){cancelAnimationFrame(raf);last=0;if(!stop&&seen&&!document.hidden&&init())raf=requestAnimationFrame(tick)}
    ctrl.current=p=>{stop=p;setPaused(p);sync()};
    function preference(){stop=mq.matches;setPaused(stop);if(stop){t=PRINT_PHASE;wind=target=sweep=dir=0;tx=focus=.5;size()}sync()}
    function move(e:PointerEvent){const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      dir=Math.max(-1,Math.min(1,(x-tx)*21));tx=Math.max(0,Math.min(1,x));target=Math.max(0,1.16-Math.hypot(x-.5,(y-.5)*1.4))*(e.buttons?1.65:1.05)}
    function leave(){target=dir=0}function lost(e:Event){e.preventDefault();cancelAnimationFrame(raf);stop=true;setUnavailable(true);el.dataset.ready='false';el.dataset.renderer='print'}
    const ro=new ResizeObserver(size);ro.observe(el);const io=new IntersectionObserver(es=>{seen=es[0].isIntersecting;sync()});io.observe(el);
    el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerdown',move,{passive:true});el.addEventListener('pointerleave',leave);canvas.addEventListener('webglcontextlost',lost);
    document.addEventListener('visibilitychange',sync);mq.addEventListener('change',preference);
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerdown',move);el.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',sync);mq.removeEventListener('change',preference);render?.dispose();canvas.remove();delete el.dataset.ready};
  },[]);
  return (
    <figure className="flag-study">
      <div className="plate-top micro">
        <span>
          <b className="live-dot" /> {unavailable || paused ? "MUSEUM PRINT" : "LIVE ARTWORK"}
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
          disabled={unavailable}
          onClick={() => ctrl.current(!paused)}
        >
          <Icon name={paused ? "play" : "pause"} size={12} />
          {unavailable ? "Static print" : paused ? "Resume Motion" : "Pause Motion"}
        </button>
      </figcaption>
    </figure>
  );
}
