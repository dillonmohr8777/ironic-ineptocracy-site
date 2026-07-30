import { access, readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const origin = "https://ironicineptocracy.com";
const errors = [];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", ".vercel", "dist", "node_modules"].includes(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function routeFor(file) {
  const rel = relative(root, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
  return `/${rel}`;
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const files = await walk(root);
const pages = [];
const titles = new Map();
const canonicals = new Map();

for (const file of files) {
  const html = await readFile(file, "utf8");
  const route = routeFor(file);
  const is404 = route === "/404.html";
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() ?? "";
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] ?? "";
  const h1s = matches(html, /<h1\b[^>]*>/gi);

  if (!title) errors.push(`${route}: missing title`);
  if (!description) errors.push(`${route}: missing meta description`);
  if (h1s.length !== 1) errors.push(`${route}: expected 1 h1, found ${h1s.length}`);

  if (!is404) {
    if (!canonical.startsWith(origin)) errors.push(`${route}: invalid canonical ${canonical || "(missing)"}`);
    if (!/<meta\s+name="robots"\s+content="[^"]*\bindex\b[^"]*\bfollow\b/i.test(html)) {
      errors.push(`${route}: missing index/follow robots directive`);
    }
    if (!html.includes("data-aeo-faq")) errors.push(`${route}: missing visible answer/FAQ block`);
    if (!html.includes('"@type":"FAQPage"')) errors.push(`${route}: missing FAQPage schema`);
  }

  if (/GSC_VERIFICATION_TOKEN|META_DOMAIN_VERIFICATION_TOKEN/.test(html)) {
    errors.push(`${route}: contains placeholder verification token`);
  }

  for (const script of matches(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }

  const ids = matches(html, /\sid="([^"]+)"/gi).map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) errors.push(`${route}: duplicate IDs ${duplicateIds.join(", ")}`);

  for (const image of matches(html, /<img\b[^>]*>/gi)) {
    if (!/\salt="[^"]*"/i.test(image[0])) errors.push(`${route}: image missing alt text`);
  }

  if (titles.has(title)) errors.push(`${route}: duplicate title also used by ${titles.get(title)}`);
  titles.set(title, route);
  if (canonical) {
    if (canonicals.has(canonical)) errors.push(`${route}: duplicate canonical also used by ${canonicals.get(canonical)}`);
    canonicals.set(canonical, route);
  }

  pages.push({ route, file, html, canonical, is404 });
}

for (const { route, html } of pages) {
  const references = matches(html, /\s(?:href|src)="([^"]+)"/gi).map((match) => match[1]);
  for (const reference of references) {
    if (
      !reference.startsWith("/") ||
      reference.startsWith("//") ||
      reference.startsWith("/api/") ||
      reference.startsWith("/_vercel/") ||
      reference === "/api/dossier"
    ) continue;

    const pathname = reference.split(/[?#]/)[0];
    if (!pathname) continue;
    const candidate = join(root, pathname.replace(/^\/+/, ""));
    const target = pathname.endsWith("/")
      ? join(candidate, "index.html")
      : pathname.match(/\.[a-z0-9]+$/i)
        ? candidate
        : join(candidate, "index.html");

    if (!await exists(target)) errors.push(`${route}: broken internal reference ${reference}`);
  }
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = matches(sitemap, /<loc>([^<]+)<\/loc>/g).map((match) => match[1].replaceAll("&amp;", "&"));
const expectedCanonicals = pages.filter((page) => !page.is404).map((page) => page.canonical).sort();
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("sitemap.xml: duplicate URLs");
if (JSON.stringify([...sitemapUrls].sort()) !== JSON.stringify(expectedCanonicals)) {
  errors.push("sitemap.xml: URL set does not match canonical indexable pages");
}

const robots = await readFile(join(root, "robots.txt"), "utf8");
for (const required of ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", `${origin}/sitemap.xml`]) {
  if (!robots.includes(required)) errors.push(`robots.txt: missing ${required}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} HTML files, ${expectedCanonicals.length} canonical pages, and ${sitemapUrls.length} sitemap URLs.`);
}
