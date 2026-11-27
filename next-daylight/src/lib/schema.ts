import archive from "./archive.json";
import cast from "./cast.json";
import { card, origin, site, summary } from "./publication";

export type Answer = { q: string; a: string };
type Entry = { name: string; path: string };
type Node = Record<string, unknown>;
export const graph = (...nodes: Node[]) => ({ "@context": "https://schema.org", "@graph": nodes });
export const topics = (names: string[]) => names.map(name => ({ "@type": "Thing", name }));
export const author = { "@type": "Person", "@id": `${origin}/#author`, name: archive.author };
export const publisher = { "@type": "Organization", "@id": `${origin}/#archive`, name: archive.archive, url: `${origin}/` };
const websiteId = `${origin}/#website`;
export const bookId = `${origin}/#book`;
export const characterPath = (slug: string) => `/characters/${slug}/`;
export const characterRef = ({ name, slug }: { name: string; slug: string }) => ({
  "@type": "Person", "@id": origin + characterPath(slug) + "#person", name, url: origin + characterPath(slug),
});
export const website = {
  "@type": "WebSite", "@id": websiteId, name: archive.archive, url: `${origin}/`, inLanguage: "en-US",
  description: summary, publisher, about: { "@id": bookId },
};
export const book = {
  "@type": "Book", "@id": bookId, name: site, author, url: `${origin}/book/`, sameAs: [`${origin}/`],
  description: archive.premise, inLanguage: "en-US", genre: archive.genres, keywords: archive.keywords,
  about: topics(archive.about), character: cast.map(characterRef), image: card.url,
};

// The page and its evidence use stable, distinct identifiers on every route.
export function breadcrumbs(path: string, ...trail: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList", "@id": origin + path + "#breadcrumbs",
    itemListElement: [["Public archive", "/"], ...trail].map(([name, href], i) => ({
      "@type": "ListItem", position: i + 1, name, item: origin + href,
    })),
  };
}
export function faqPage(path: string, entries: readonly Answer[]) {
  return {
    "@type": "FAQPage", "@id": origin + path + "#faq", url: origin + path, inLanguage: "en-US",
    mainEntity: entries.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
export function collection(path: string, name: string, description: string, entries: Entry[]) {
  const url = origin + path;
  const list = {
    "@type": "ItemList", "@id": url + "#list", numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({ "@type": "ListItem", position: i + 1, url: origin + entry.path, name: entry.name })),
  };
  const page = {
    "@type": "CollectionPage", "@id": url, url, name, description, isPartOf: { "@id": websiteId },
    mainEntity: { "@id": list["@id"] }, breadcrumb: { "@id": url + "#breadcrumbs" },
  };
  return graph(page, list, breadcrumbs(path, [name, path]));
}
