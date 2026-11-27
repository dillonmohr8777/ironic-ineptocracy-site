import { DossierReader } from "./DossierReader";
import { Folio } from "./Folio";
import { Request } from "./Request";
import { Voice } from "./Voice";
import { Icon } from "./Icon";
export function Dossier(){return <div className="shell sub publication"><Folio label="READER FILE / DG–04"/><header className="docket-head"><div><span className="micro over"><b/> EVIDENCE ROOM / PRIVATE CAPITAL</span><h1>The Garnier <em>Dossier.</em></h1><p>“It is not a biography. It is a pressure map.”</p></div><a className="subject-stub" href="/characters/dijon-garnier/"><img src="/images/cast/char-garnier.webp" alt="Dijon Garnier" width="86" height="110"/><span><small className="micro">SUBJECT / 04</small>Dijon Garnier<small className="stub-link">Open profile ↗</small></span></a></header>
  <div className="dossier-desk"><DossierReader/><aside className="delivery-column"><Request compact/><Voice src="garnier" label="Garnier’s voice file"/><a className="pub-link" href="/dispatches/the-garnier-position/">Read The Garnier Position <Icon name="right" size={15}/></a></aside></div></div>}
