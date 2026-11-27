import { ArchiveFAQ } from "./ArchiveFAQ";
import LiveArchivist from "./LiveArchivist";
import { DossierReader } from "./DossierReader";
import { Folio } from "./Folio";
import { Request } from "./Request";
import { StructuredData } from "./StructuredData";
import { Voice } from "./Voice";
import { Icon } from "./Icon";
import { card, origin, published, modified } from "@/lib/publication";
import { author, bookId, breadcrumbs, faqPage, graph, publisher, type Answer } from "@/lib/schema";
const dossierFaqs: readonly Answer[] = [
  { q: "What is inside The Garnier Dossier?", a: "Seven interactive reader leaves tracing Dijon Garnier's public image, financial footprint across Tecca, BankIt, and NeuroClick, and the institutional dependencies surrounding him." },
  { q: "Do I have to enter my email to read the dossier?", a: "No. All seven leaves are open to read right on this page without an email address. Requesting by email sends a direct copy from ironicineptocracy@agentmail.to and adds you to launch dispatches." },
  { q: "Is The Garnier Dossier spoiler-safe?", a: "Yes. It is written as an in-world public pressure map that sets up the novel's power dynamics without giving away the ending." },
];
export function Dossier(){
  const dossierSchema = graph(
    { "@type": "CreativeWork", "@id": origin + "/dossier/#work", name: "The Garnier Dossier", description: "Seven-leaf companion reader dossier mapping Dijon Garnier, Tecca, BankIt, and NeuroClick in Dillon Mohr's novel The Ironic Ineptocracy.", url: origin + "/dossier/", author, publisher, isPartOf: { "@id": bookId }, datePublished: published, dateModified: modified, image: card.url, inLanguage: "en-US" },
    faqPage("/dossier/", dossierFaqs),
    breadcrumbs("/dossier/", ["The Garnier Dossier", "/dossier/"]),
  );
  return <div className="shell sub publication"><StructuredData value={dossierSchema}/><Folio label="READER FILE / DG–04"/><header className="docket-head"><div><span className="micro over"><b/> EVIDENCE ROOM / PRIVATE CAPITAL</span><h1>The Garnier <em>Dossier.</em></h1><p>“It is not a biography. It is a pressure map.”</p></div><a className="subject-stub" href="/characters/dijon-garnier/"><img src="/images/cast/char-garnier.webp" alt="Dijon Garnier" width="86" height="110"/><span><small className="micro">SUBJECT / 04</small>Dijon Garnier<small className="stub-link">Open profile ↗</small></span></a></header>
  <div className="dossier-desk"><DossierReader/><aside className="delivery-column"><Request compact/><Voice src="garnier" label="Garnier’s voice file"/><a className="pub-link" href="/dispatches/the-garnier-position/">Read The Garnier Position <Icon name="right" size={15}/></a></aside></div><ArchiveFAQ entries={dossierFaqs}/><LiveArchivist/></div>}
