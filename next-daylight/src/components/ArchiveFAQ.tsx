import type { Answer } from "@/lib/schema";

/** Native disclosures keep the filed answers readable without a client bundle. */
export function ArchiveFAQ({ entries }: { entries: readonly Answer[] }) {
  return <section className="aeo-faq" aria-labelledby="faq-heading">
    <header>
      <span className="micro over"><b /> READER INQUIRIES</span>
      <h2 id="faq-heading">Frequently asked questions.</h2>
    </header>
    <div className="aeo-inquiries">{entries.map(({ q, a }) => <details key={q}>
      <summary>{q}</summary>
      <p>{a}</p>
    </details>)}</div>
  </section>;
}
