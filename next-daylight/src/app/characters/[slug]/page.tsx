import { notFound } from "next/navigation";
import cast from "@/lib/cast.json";
import { Stats } from "@/components/Cast";
import { Folio } from "@/components/Folio";
import { Voice } from "@/components/Voice";
import { Icon } from "@/components/Icon";
import { edition } from "@/lib/publication";
type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return cast.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const s = cast.find((s) => s.slug === slug);
  if (!s) notFound();
  return edition(`/characters/${slug}/`, s.name, s.lead);
}
export default async function Profile({ params }: Params) {
  const { slug } = await params;
  const idx = cast.findIndex((s) => s.slug === slug),
    s = cast[idx];
  if (!s) notFound();
  const prev = cast[(idx + 9) % 10],
    next = cast[(idx + 1) % 10];
  return (
    <div className="shell sub">
      <Folio label={"SUBJECT " + s.number} />
      <div className="profile-grid">
        <figure>
          <div className="profile-photo">
            <img
              src={s.image}
              fetchPriority="high"
              alt={"35mm portrait of " + s.name}
              width="896"
              height="1200"
            />
          </div>
          <figcaption className="img-caption">
            <em>{s.name}.</em>
            <span className="micro">PORTRAIT / {s.number}</span>
          </figcaption>
        </figure>
        <div className="profile-lead">
          <span className="micro over">
            <b />
            {s.group.toUpperCase()} / SUBJECT {s.number}
          </span>
          <h1>
            {s.name}
            <i className="terminal">.</i>
          </h1>
          <p className="tagline">{s.role}</p>
          <p className="intro">{s.lead}</p>
          <Voice src={s.audio} label="Subject voice audition" />
          <Stats subject={s} />
        </div>
      </div>
      <article className="reading-grid">
        <div>
          <span className="micro over">
            <b />
            PUBLIC RECORD
          </span>
          <h2>Inside the file.</h2>
        </div>
        <div className="prose">
          {s.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h3>Key themes</h3>
          <ul className="themes">
            {s.themes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </article>
      <nav className="prevnext">
        <a href={"/characters/" + prev.slug + "/"}>
          <small className="micro">← PREVIOUS SUBJECT</small>
          {prev.name}
        </a>
        <a href="/characters/" className="micro allfiles">
          ALL FILES
        </a>
        <a href={"/characters/" + next.slug + "/"}>
          <small className="micro">NEXT SUBJECT →</small>
          {next.name}
        </a>
      </nav>
    </div>
  );
}
