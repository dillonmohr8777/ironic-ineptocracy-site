import { Folio } from "@/components/Folio";
import { Icon } from "@/components/Icon";
import { StructuredData } from "@/components/StructuredData";
import { essays, groups, pathFor } from "@/lib/dispatches";
import { edition } from "@/lib/publication";
import { collection } from "@/lib/schema";
const description = "Nine public essays by Dillon Mohr on private power, political satire, and the stories institutions tell. With reading guides and book-club questions.";
export const metadata = edition("/dispatches/", "Dispatches: field correspondence", description, false, ["political satire essays", "ineptocracy definition", "political corruption fiction", "books like 1984 with dark humor", "political thriller book club questions", "The Ironic Ineptocracy dispatches"]);
export default function DispatchIndex() {
  const feature = essays[0];
  return <div className="shell sub publication"><Folio label="DISPATCH INDEX" />
    <StructuredData value={collection("/dispatches/", "Dispatches: field correspondence", description, essays.map(e => ({ name: e.title, path: pathFor(e.slug) })))} />
    <header className="pub-mast"><div><span className="over micro"><b /> FIELD CORRESPONDENCE</span><h1>Dispatches<i className="terminal">.</i></h1></div><p>Nine essays on private power and public life, filed from the world of <em>The Ironic Ineptocracy.</em></p></header>
    <a className="lead-dispatch" href={pathFor(feature.slug)}><figure><img src="/images/editorial/plate-capitol-daylight.webp" alt="Daylight falling across the Capitol colonnade" width="900" height="550" /><figcaption className="micro">PLATE 03 / CAPITOL COLONNADE</figcaption></figure><div><span className="micro over"><b /> OPENING DISPATCH · {feature.folio}</span><h2>The File <em>Opens.</em></h2><p>{feature.excerpt}</p><span className="pub-link">Read the dispatch <Icon name="right" size={16} /></span></div></a>
    <div className="register-head micro"><span>TABLE OF CONTENTS</span><span>09 DISPATCHES / 03 SERIES</span></div>
    {groups.map((g,i)=><section className="dispatch-register" key={g}><header><span className="micro over">SERIES 0{i+1}</span><h2>{g}</h2></header><div>{essays.filter(e=>e.category===g).map(e=><a className="register-row" key={e.slug} href={pathFor(e.slug)}><small className="micro">{e.folio}</small><div><h3>{e.short}</h3><p>{e.excerpt}</p><span className="micro">{g.toUpperCase()} · {e.minutes} MIN READ</span></div><Icon name="up" size={18}/></a>)}</div></section>)}
  </div>;
}
