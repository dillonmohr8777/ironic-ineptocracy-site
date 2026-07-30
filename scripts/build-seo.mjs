import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const origin = "https://ironicineptocracy.com";
const lastmod = "2026-07-30";

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function textFrom(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["dist", ".git", "node_modules"].includes(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name === "index.html") files.push(absolute);
  }
  return files;
}

const pages = [];
for (const file of await walk(root)) {
  const html = await readFile(file, "utf8");
  const rel = relative(root, file).split(sep).join("/");
  const route = rel === "index.html" ? "/" : `/${rel.replace(/\/index\.html$/, "")}`;
  const canonical = textFrom(html, /<link rel="canonical" href="([^"]+)"/i) || `${origin}${route === "/" ? "" : route}`;
  const title = textFrom(html, /<title>([\s\S]*?)<\/title>/i);
  const description = textFrom(html, /<meta name="description" content="([^"]+)"/i);
  const h1 = textFrom(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  pages.push({ route, canonical, title, description, h1 });
}

pages.sort((a, b) => a.route.localeCompare(b.route));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>
    <loc>${escapeXml(page.canonical)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>
`;
await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");

const dispatches = pages
  .filter((page) => page.route.startsWith("/dispatches/"))
  .sort((a, b) => a.route.localeCompare(b.route));

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Ironic Ineptocracy Blog and Dispatches</title>
    <link>${origin}/dispatches</link>
    <description>Political satire essays, reading guides, character files, and evidence drops from Dillon Mohr's The Ironic Ineptocracy.</description>
    <language>en-us</language>
    <lastBuildDate>Thu, 30 Jul 2026 12:00:00 GMT</lastBuildDate>
    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />
${dispatches.map((page) => `    <item>
      <title>${escapeXml(page.h1 || page.title)}</title>
      <link>${escapeXml(page.canonical)}</link>
      <guid isPermaLink="true">${escapeXml(page.canonical)}</guid>
      <pubDate>Thu, 30 Jul 2026 12:00:00 GMT</pubDate>
      <description>${escapeXml(page.description)}</description>
    </item>`).join("\n")}
  </channel>
</rss>
`;
await writeFile(join(root, "feed.xml"), rss, "utf8");

const llms = `# The Ironic Ineptocracy

> The official website for The Ironic Ineptocracy, a satirical political thriller by Dillon Mohr about brilliance, friendship, private money, public failure, propaganda, and manipulated memory.

## Canonical site

- Home: ${origin}/
- Book overview: ${origin}/book
- Blog and dispatches: ${origin}/dispatches
- Character dossiers: ${origin}/characters
- World file: ${origin}/world
- Reader guide: ${origin}/reader-guide
- Press and author information: ${origin}/press
- XML sitemap: ${origin}/sitemap.xml
- RSS feed: ${origin}/feed.xml

## Editorial content

${dispatches.map((page) => `- [${page.h1 || page.title}](${page.canonical}): ${page.description}`).join("\n")}

## Character files

${pages.filter((page) => page.route.startsWith("/characters/")).map((page) => `- [${page.h1 || page.title}](${page.canonical}): ${page.description}`).join("\n")}

## Attribution

- Author: Dillon Mohr
- Work: The Ironic Ineptocracy
- Content language: English
- Public pages are spoiler-safe unless explicitly labeled otherwise.
- This is a work of fiction. Names, characters, places, and incidents are products of the author's imagination.
`;
await writeFile(join(root, "llms.txt"), llms, "utf8");

const llmsFull = `# The Ironic Ineptocracy: complete public content index

${pages.map((page) => `## ${page.h1 || page.title}

- URL: ${page.canonical}
- Description: ${page.description}
`).join("\n")}
`;
await writeFile(join(root, "llms-full.txt"), llmsFull, "utf8");

console.log(`SEO outputs generated for ${pages.length} canonical pages and ${dispatches.length} dispatch articles.`);
