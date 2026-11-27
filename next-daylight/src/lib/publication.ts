import type { Metadata } from "next";
export const origin = "https://ironicineptocracy.com";
export const site = "The Ironic Ineptocracy";
export const homeTitle = `${site} | The Public Archive`;
export const summary = "Enter Dillon Mohr’s satirical political thriller through ten subject files, nine dispatches, four cold opens, and the Garnier Dossier.";
export const card = { url: `${origin}/images/social/ineptocracy-og.png`, width: 1200, height: 630, alt: "The Ironic Ineptocracy: The Bleeding Standard on alabaster paper" };
export function edition(path: string, title: string, description: string, article = false): Metadata {
  const full = path === "/" || title.endsWith(` | ${site}`) ? title : `${title} | ${site}`;
  return {
    title: { absolute: full }, description,
    alternates: { canonical: origin + path, types: { "application/rss+xml": `${origin}/feed.xml` } },
    openGraph: { siteName: site, locale: "en_US", title: full, description, url: origin + path, images: [card], ...(article ? { type: "article" as const, authors: ["Dillon Mohr"], publishedTime: "2026-07-30T12:00:00Z", modifiedTime: "2026-11-27T12:00:00Z" } : { type: "website" as const }) },
    twitter: { card: "summary_large_image", title: full, description, images: [card] },
  };
}
