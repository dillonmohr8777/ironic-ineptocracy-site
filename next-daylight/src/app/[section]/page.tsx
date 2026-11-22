import { notFound } from "next/navigation";
import briefs from "@/lib/briefs.json";
import { Folio } from "@/components/Folio";
import { Request } from "@/components/Request";
import { Reader } from "@/components/Reader";
import { Atlas } from "@/components/Atlas";
import { Voice } from "@/components/Voice";
import { Icon } from "@/components/Icon";
const pages: Record<string, [string, string, string, string]> = {
  book: [
    "Book file",
    "The book",
    "A country losing the ability to tell competence from authority.",
    "hero-daylight",
  ],
  world: [
    "Field geography",
    "The world",
    "The map is not geography. It is pressure.",
    "plate-harvard-daylight",
  ],
  dossier: [
    "Restricted reader file",
    "The Garnier Dossier",
    "Power rarely arrives under its own name. It arrives as funding, access, convenience, policy, and memory.",
    "/images/cast/char-garnier.webp",
  ],
  dispatches: [
    "Field correspondence",
    "Dispatches",
    "Four entries from the public record. Each opens a different pressure point.",
    "plate-capitol-daylight",
  ],
  press: [
    "For the record",
    "Press room",
    "Book facts, release status, and a spoiler-safe briefing for reviewers, podcasters, and booksellers.",
    "hero-daylight",
  ],
  "reader-guide": [
    "Reading companion",
    "Reader guide",
    "Questions for book clubs, classrooms, and launch readers.",
    "plate-harvard-daylight",
  ],
};
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.keys(pages).map((section) => ({ section }));
type P = { params: Promise<{ section: string }> };
export async function generateMetadata({ params }: P) {
  return { title: pages[(await params).section]?.[1] };
}
function List({ rows, title }: { rows: string[][]; title: string }) {
  return (
    <section className="reading-grid">
      <div>
        <span className="over micro">
          <b />
          CATALOGUE NOTES
        </span>
        <h2>{title}.</h2>
      </div>
      <div className="notes-list">
        {rows.map(([t, p], i) => (
          <article key={t}>
            <small className="micro">0{i + 1} / PUBLIC FILE</small>
            <h3>{t}</h3>
            <p>{p}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export default async function Page({ params }: P) {
  const { section } = await params,
    p = pages[section];
  if (!p) notFound();
  return (
    <div className="shell sub">
      <Folio label={p[0].toUpperCase()} />
      <section className="brief-hero">
        <div>
          <span className="micro over">
            <b />
            {p[0].toUpperCase()} / TIER 01
          </span>
          <h1>
            {p[1]}
            <i className="terminal">.</i>
          </h1>
          <p>{p[2]}</p>
          {section === "book" ? (
            <Voice src="narrator-premise" label="Narrator’s premise" />
          ) : section === "dossier" ? (
            <a className="btn primary" href="#request">
              Request access <Icon name="right" size={16} />
            </a>
          ) : (
            <span className="micro brief-ed">
              THE DAYLIGHT EDITION / VOLUME 01
            </span>
          )}
        </div>
        <figure>
          <img
            src={p[3][0] === "/" ? p[3] : "/images/editorial/" + p[3] + ".webp"}
            alt={
              p[3][0] === "/"
                ? "Portrait of Dijon Garnier"
                : p[3].includes("harvard")
                  ? "Sunlit archway at Harvard"
                  : p[3].includes("capitol")
                    ? "Capitol colonnade in daylight"
                    : "Daylight in the marble atrium"
            }
            width="900"
            height="600"
            fetchPriority="high"
          />
          <figcaption className="micro">
            CASE 017 / {p[0].toUpperCase()}
          </figcaption>
        </figure>
      </section>
      {section === "book" && (
        <>
          <List title="Book briefs" rows={briefs.book.map((r) => r.slice(1))} />
          <Reader />
        </>
      )}
      {section === "world" && (
        <>
          <Atlas />
          <List
            title="Route files"
            rows={briefs.world.map((r) => r.slice(1))}
          />
        </>
      )}
      {section === "dossier" && (
        <>
          <Request />
          <article className="reading-grid">
            <div>
              <span className="micro over">
                <b />
                SUBJECT DG–04
              </span>
              <h2>Public mask.</h2>
            </div>
            <div className="prose">
              <p>
                The Garnier Dossier maps Dijon Garnier, the French-born
                billionaire behind Tecca, BankIt, and NeuroClick. His public
                language is order and mercy. His private logic is ownership and
                jurisdiction.
              </p>
              <Voice src="garnier" label="Garnier’s voice file" />
              <a className="text-link" href="/characters/dijon-garnier/">
                Read the subject profile <Icon name="up" size={15} />
              </a>
            </div>
          </article>
        </>
      )}
      {section === "dispatches" && (
        <List rows={briefs.dispatches} title="Evidence drops" />
      )}
      {section === "reader-guide" && (
        <List rows={briefs.reader} title="For discussion" />
      )}
      {section === "press" && (
        <>
          <List rows={briefs.facts} title="Book facts" />
          <div className="reading-grid">
            <h2>Short description.</h2>
            <div className="prose">
              {briefs.press.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <a href="/dossier/" className="text-link">
                Open the reader briefing <Icon name="right" size={15} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
