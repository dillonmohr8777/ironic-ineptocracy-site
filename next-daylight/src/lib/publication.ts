import type { Metadata } from "next";
import archive from "./archive.json";

export const { origin, title: site } = archive;
export const homeTitle = `${site} | The Public Archive`;
export const summary = "Enter Dillon Mohr’s satirical political thriller through ten subject files, nine dispatches, four cold opens, and the Garnier Dossier.";
export const card = {
  url: `${origin}/images/social/ineptocracy-og.png`, width: 1200, height: 630,
  alt: "The Ironic Ineptocracy: The Bleeding Standard on alabaster paper",
};
export const published = "2026-07-30T12:00:00Z";
export const modified = "2026-11-27T12:00:00Z";

export function edition(path: string, title: string, description: string, article = false, keywords?: string[]): Metadata {
  const full = path === "/" || title.endsWith(` | ${site}`) ? title : `${title} | ${site}`;
  const url = origin + path;
  return {
    title: { absolute: full }, description, keywords,
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    alternates: { canonical: url, types: { "application/rss+xml": `${origin}/feed.xml` } },
    openGraph: {
      siteName: site, locale: "en_US", title: full, description, url, images: [card],
      ...(article ? { type: "article", authors: [archive.author], publishedTime: published, modifiedTime: modified, tags: keywords } : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title: full, description, images: [card] },
  };
}
