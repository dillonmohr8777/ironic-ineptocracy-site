import { notFound } from "next/navigation";
import { Folio } from "@/components/Folio";
import { Icon } from "@/components/Icon";
import { StructuredData } from "@/components/StructuredData";
import cast from "@/lib/cast.json";
import { essays, pathFor, type Block } from "@/lib/dispatches";
import { edition, origin, card, site } from "@/lib/publication";
export const dynamicParams = false;
export const generateStaticParams = () => essays.map(({slug})=>({slug}));
type P = { params:Promise<{slug:string}> };
export async function generateMetadata({params}:P){ const {slug}=await params; const e=essays.find(e=>e.slug===slug); if (!e) notFound(); return edition(pathFor(slug),e.seoTitle,e.description,true); }
// Inline marks and citations are allowlisted at import, never accepted from visitors.
function Paragraph({block:b, index:i}:{block:Block;index:number}) {
  switch(b.type){
    case 'h2': case 'h3': {const H=b.type;return <H id={`entry-${i}`}>{b.text}</H>}
    case 'p': return <p dangerouslySetInnerHTML={{__html:b.html}} />;
    case 'ol': case 'ul': {const L=b.type;return <L start={b.start}>{b.items.map((s,k)=><li key={k} dangerouslySetInnerHTML={{__html:s}} />)}</L>}
    case 'table': return <div className="comparison"><table><caption>{b.caption}</caption><thead><tr>{b.rows[0].map((cell,k)=><th key={k} scope="col" dangerouslySetInnerHTML={{__html:cell}} />)}</tr></thead><tbody>{b.rows.slice(1).map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k} dangerouslySetInnerHTML={{__html:cell}} />)}</tr>)}</tbody></table></div>;
  }
}
export default async function Dispatch({params}:P){
  const {slug}=await params;const idx=essays.findIndex(e=>e.slug===slug), e=essays[idx]; if (!e) notFound();
  const url=origin+pathFor(slug), prev=essays[(idx+essays.length-1)%essays.length],next=essays[(idx+1)%essays.length];
  return <div className="shell sub publication"><Folio label={`DISPATCH ${e.folio}`} />
    <StructuredData value={{"@context":"https://schema.org","@graph":[{"@type":"Article","@id":url+"#article",headline:e.title,description:e.description,articleSection:e.category,mainEntityOfPage:url,url,author:{"@type":"Person",name:"Dillon Mohr"},publisher:{"@type":"Organization",name:site},datePublished:"2026-07-30T12:00:00Z",dateModified:"2026-11-27T12:00:00Z",image:card.url,inLanguage:"en-US",wordCount:e.words},{"@type":"BreadcrumbList",itemListElement:[["Public archive","/"],["Dispatches","/dispatches/"],[e.short,pathFor(slug)]].map(([name,path],i)=>({"@type":"ListItem",position:i+1,name,item:origin+path}))}]}} />
    <article><header className="essay-heading"><span className="micro over"><b />{e.category.toUpperCase()} / DISPATCH {e.folio}</span><h1>{e.title}</h1><p>{e.excerpt}</p><div className="essay-by"><span>By Dillon Mohr</span><span className="micro">30 JUL 2026 · {e.minutes} MIN READ</span></div></header>
    <div className="essay-grid"><aside className="folio-rail"><nav aria-label="Essay contents"><a className="micro over" href="/dispatches/">← DISPATCH INDEX</a><span className="rail-heading">In this file</span>{e.blocks.map((b,i)=>b.type==='h2'&&<a href={`#entry-${i}`} key={i}>{b.text}</a>)}<a href="#linked-files">Related subjects</a></nav></aside><div className="story">{e.blocks.map((b,i)=><Paragraph block={b} index={i} key={i}/>)}</div></div></article>
    <section id="linked-files" className="linked-files"><span className="micro over"><b /> RELATED SUBJECT FILES</span><div>{e.subjects.map(slug=>{const c=cast.find(c=>c.slug===slug)!;return <a key={slug} href={`/characters/${slug}/`}><img src={c.image} alt="" width="60" height="78" loading="lazy"/><span><small className="micro">SUBJECT {c.number}</small>{c.name}</span><Icon name="up" size={16}/></a>})}</div></section>
    <a className="reader-invite" href="/dossier/#dossier-reader"><span className="micro">COMPANION FILE / DG–04</span><em>Inside the Garnier Dossier</em><Icon name="right"/></a>
    <nav className="prevnext" aria-label="Dispatch pagination"><a href={pathFor(prev.slug)}><small className="micro">← PREVIOUS DISPATCH</small>{prev.short}</a><a className="micro allfiles" href="/dispatches/">ALL DISPATCHES</a><a href={pathFor(next.slug)}><small className="micro">NEXT DISPATCH →</small>{next.short}</a></nav>
  </div>;
}
