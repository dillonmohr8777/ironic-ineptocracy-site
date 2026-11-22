import BleedingFlagCanvas from "@/components/BleedingFlagCanvas";
import { Redaction, Gallery } from "@/components/Gallery";
import { CastDeck } from "@/components/Cast";
import { Reader } from "@/components/Reader";
import { Atlas } from "@/components/Atlas";
import { Request } from "@/components/Request";
import { Icon } from "@/components/Icon";
export default function Home() {
  return (
    <div className="shell">
      <div className="folio micro">
        <span>
          <i className="folio-cross">✳</i> THE PUBLIC ARCHIVE <b>/</b> CASE NO.
          017
        </span>
        <span>
          VOL. 01 <b>—</b> DAYLIGHT EDITION
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="micro over">
            <b /> A NOVEL BY DILLON MOHR
          </span>
          <h1>
            The <em>Ironic</em>
            <br />
            Ineptocracy<span className="title-dot">.</span>
          </h1>
          <p className="tagline">Failure isn’t an accident. It’s policy.</p>
          <p className="intro">
            A perfect SAT score brings Darnell Covington to Harvard, and to the
            attention of people who confuse promise with property.
          </p>
          <div className="actions">
            <a className="btn primary" href="/dossier/">
              Enter the dossier <Icon name="right" size={17} />
            </a>
            <a className="btn secondary" href="#cast">
              <Icon name="play" size={13} /> Audition the cast
            </a>
          </div>
        </div>
        <BleedingFlagCanvas />
      </section>
      <Redaction />
      <Gallery />
      <CastDeck />
      <Reader />
      <Atlas />
      <Request />
    </div>
  );
}
