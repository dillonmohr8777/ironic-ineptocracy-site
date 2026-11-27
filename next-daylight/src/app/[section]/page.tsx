import { notFound } from "next/navigation";
import briefs from "@/lib/briefs.json";
import { inbox } from "@/lib/contact";
import { ArchiveFAQ } from "@/components/ArchiveFAQ";
import { EditionLabel } from "@/components/Chrome";
import { Folio } from "@/components/Folio";
import { Dossier } from "@/components/Dossier";
import { Reader } from "@/components/Reader";
import { Atlas } from "@/components/Atlas";
import { StructuredData } from "@/components/StructuredData";
import { Voice } from "@/components/Voice";
import { Icon } from "@/components/Icon";
import { edition } from "@/lib/publication";
import { book, breadcrumbs, faqPage, graph, type Answer } from "@/lib/schema";
const sectionKeywords: Record<string, string[]> = {
  book: ["The Ironic Ineptocracy book", "Dillon Mohr novel", "satirical political thriller", "NeuroClick fiction", "Darnell Covington", "political satire novel"],
  world: ["The Ironic Ineptocracy world map", "East Atlanta to Harvard", "Washington DC political fiction", "Dijon Garnier Tecca BankIt", "NeuroClick worldbuilding"],
  dossier: ["The Garnier Dossier", "Dijon Garnier", "political thriller reader dossier", "Tecca BankIt NeuroClick", "The Ironic Ineptocracy free reader file"],
  press: ["The Ironic Ineptocracy press kit", "Dillon Mohr author press room", "satirical political thriller review copy", "ironicineptocracy@agentmail.to"],
  "reader-guide": ["The Ironic Ineptocracy reader guide", "political thriller book club questions", "satirical political fiction discussion guide", "classroom reading companion"],
};
const sectionFaqs: Partial<Record<string, readonly Answer[]>> = {
  book: [
    { q: "What is The Ironic Ineptocracy about?", a: "A perfect SAT score takes Darnell Covington from East Atlanta to Harvard, where his talent draws the attention of people who see promise as property. The novel blends political satire, political thriller tension, and dark humor around private capital and public memory." },
    { q: "Who wrote The Ironic Ineptocracy?", a: "The Ironic Ineptocracy is written by Dillon Mohr. The manuscript is in active revision while the author finishes the climax, and readers can explore ten character files, nine dispatches, and The Garnier Dossier online." },
    { q: "Where should new readers start in the public archive?", a: "Start with The Garnier Dossier for an interactive seven-leaf pressure map, listen to the narrator premise on this page, or open The File Opens in Dispatches." },
  ],
  "reader-guide": [
    { q: "Is this reader guide spoiler-safe for book clubs?", a: "Yes. Every prompt on the reader guide and across the public archive focuses on early character choices, institutional pressure, and thematic questions without revealing the ending." },
    { q: "How many questions should a book club cover in one meeting?", a: "Pick five to eight prompts from this guide and the twenty-question dispatch in Dispatches, grounding each point in a specific scene or institutional choice." },
  ],
};
const pages: Record<string, [string, string, string, string]> = {
  book: [
    "Book file",
    "The book",
    "Explore Dillon Mohr's satirical political thriller The Ironic Ineptocracy: a country losing the ability to tell competence from authority.",
    "hero-daylight",
  ],
  world: [
    "Field geography",
    "The world",
    "Explore the interactive pressure map of The Ironic Ineptocracy from East Atlanta and Harvard Yard to Washington, D.C. and the private donor rooms.",
    "plate-harvard-daylight",
  ],
  dossier: [
    "Restricted reader file",
    "The Garnier Dossier",
    "Power rarely arrives under its own name. Read all seven open leaves mapping Dijon Garnier, Tecca, BankIt, and NeuroClick.",
    "/images/cast/char-garnier.webp",
  ],
  press: [
    "For the record",
    "Press room",
    "Book facts, release status, official press contact (ironicineptocracy@agentmail.to), and a spoiler-safe briefing for reviewers, podcasters, and booksellers.",
    "hero-daylight",
  ],
  "reader-guide": [
    "Reading companion",
    "Reader guide",
    "Spoiler-safe political thriller discussion prompts and reading companion questions for book clubs, classrooms, and launch readers.",
    "plate-harvard-daylight",
  ],
};
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.keys(pages).map((section) => ({ section }));
type P = { params: Promise<{ section: string }> };
export async function generateMetadata({ params }: P) {
  const { section } = await params;
  const p = pages[section]; if (!p) notFound();
  return edition(`/${section}/`, p[1], p[2], false, sectionKeywords[section]);
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
  if (section === "dossier") return <Dossier />;
  const path = `/${section}/`;
  const faqs = sectionFaqs[section];
  const nodes: Record<string, unknown>[] = [breadcrumbs(path, [p[1], path])];
  if (section === "book" || section === "press") nodes.unshift(book);
  if (faqs) nodes.push(faqPage(path, faqs));
  return (
    <div className="shell sub">
      <StructuredData value={graph(...nodes)} />
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
          ) : (
            <span className="micro brief-ed">
              <EditionLabel/> / VOLUME 01
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
          {faqs && <ArchiveFAQ entries={faqs} />}
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
      {section === "reader-guide" && (
        <>
          <List rows={briefs.reader} title="For discussion" />
          {faqs && <ArchiveFAQ entries={faqs} />}
        </>
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
              <p>Press, review copies &amp; reader correspondence: <a className="contact" href={`mailto:${inbox}`}>{inbox}</a></p>
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
