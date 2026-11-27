"use client";
import { useRef, useState } from "react";
import dossier from "@/lib/garnier-dossier.json";
import { Icon } from "./Icon";
const sheets = dossier.sheets;
const no = (i:number) => String(i+1).padStart(2,"0");
function Facts({rows}:{rows:string[][]}){return <dl className="file-facts">{rows.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
export function DossierReader(){
  const [active, select]=useState(0), rail=useRef<HTMLDivElement>(null);
  function turn(i:number){const j=(i+sheets.length)%sheets.length;select(j);rail.current?.querySelectorAll('button')[j]?.focus();}
  return <section className="reader-file" id="dossier-reader" tabIndex={-1} aria-label="Full Garnier Dossier reader">
    <div className="file-binding micro"><span><Icon name="folder" size={15}/> CLASSIFIED READER FILE</span><span>DG / 04</span></div>
    <div className="file-leaves"><div className="file-directory"><span className="micro">REGISTER / 07 LEAVES</span><div role="tablist" aria-label="Dossier leaves" aria-orientation="vertical" ref={rail} onKeyDown={e=>{const k=e.key; if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(k))return; e.preventDefault();turn(k==='Home'?0:k==='End'?sheets.length-1:active+(['ArrowDown','ArrowRight'].includes(k)?1:-1))}}>{sheets.map((s,i)=><button key={s.label} type="button" id={`tab-${i}`} role="tab" aria-selected={active===i} aria-controls={`leaf-${i}`} tabIndex={active===i?0:-1} onClick={()=>select(i)}><span className="micro">{no(i)}</span>{s.label}</button>)}</div></div>
    {sheets.map((s,i)=><section className="file-leaf" key={s.label} id={`leaf-${i}`} role="tabpanel" tabIndex={0} hidden={active!==i} aria-labelledby={`tab-${i}`}><div className="leaf-number micro">TRANSMISSION {no(i)} / 07</div><h2>{s.label}</h2>{s.sections.map((sec,j)=><div className="leaf-section" key={sec.title}>{(j>0||s.sections.length>1)&&<h3>{sec.title}</h3>}{sec.blocks.map((b,k)=>{
      if(b.type==='sealed')return <details className="sealed-line" key={k}><summary><span className="micro">{no(k)} / DATE WITHHELD</span><span className="peel-tab">Peel note</span></summary><p>{b.text}</p></details>;
      if('rows' in b && b.rows)return <Facts key={k} rows={b.rows}/>;
      if('items' in b && b.items){const L=b.type==='ol'?'ol':'ul'; return <L key={k}>{b.items.map(item=><li key={item}>{item}</li>)}</L>}
      return <p key={k}>{b.text}</p>})}</div>)}{i===0&&<details className="handling"><summary className="micro">CLASSIFICATION & HANDLING</summary><Facts rows={dossier.record}/></details>}
      <div className="file-turn"><span className="micro">END LEAF {no(i)}</span><button className="pub-link" onClick={()=>turn(i+1)}>{i===6?'Return to cover':'Turn the leaf'} <Icon name="right" size={15}/></button></div></section>)}
    </div></section>;
}
