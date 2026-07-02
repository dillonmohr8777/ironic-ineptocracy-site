// Stamps analytics/verification IDs into every prerendered HTML page.
//
// Usage:
//   node scripts/set-analytics-ids.mjs --ga4 G-XXXXXXXXXX --gsc <token> --pixel <id>
//
// Any flag you omit keeps the current value. Running with no flags just makes
// sure the meta tags and the /assets/site-analytics.js include exist everywhere.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const SKIP_DIRS = new Set([".git", ".vercel", "dist", "node_modules", "scripts", "api", "assets"]);

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1].trim() : null;
}
const ids = {
  "ga4-measurement-id": flag("ga4"),
  "google-site-verification": flag("gsc"),
  "meta-pixel-id": flag("pixel"),
};
const PLACEHOLDERS = {
  "ga4-measurement-id": "REPLACE-WITH-GA4-ID",
  "google-site-verification": "REPLACE-WITH-GSC-TOKEN",
  "meta-pixel-id": "REPLACE-WITH-PIXEL-ID",
};

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (dir === root && SKIP_DIRS.has(entry.name)) continue;
      found.push(...(await htmlFiles(join(dir, entry.name))));
    } else if (entry.name.endsWith(".html")) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

function upsertMeta(html, name, value) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, "i");
  const tag = `<meta name="${name}" content="${value}">`;
  if (re.test(html)) {
    // Only overwrite when a new value was passed; otherwise leave as-is.
    return value === null ? html : html.replace(re, tag);
  }
  const insert = `${tag.replace(`content="null"`, `content="${PLACEHOLDERS[name]}"`)}\n    `;
  return html.replace(/<\/head>/i, `${insert}</head>`);
}

function upsertLoader(html) {
  if (html.includes("/assets/site-analytics.js")) return html;
  return html.replace(
    /<\/head>/i,
    `<script defer src="/assets/site-analytics.js"></script>\n  </head>`
  );
}

const files = await htmlFiles(root);
let touched = 0;
for (const file of files) {
  const before = await readFile(file, "utf8");
  let after = before;
  for (const [name, value] of Object.entries(ids)) {
    const current = after.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i"));
    if (value !== null) {
      after = upsertMeta(after, name, value);
    } else if (!current) {
      after = upsertMeta(after, name, PLACEHOLDERS[name]);
    }
  }
  after = upsertLoader(after);
  if (after !== before) {
    await writeFile(file, after);
    touched++;
  }
}
console.log(`Checked ${files.length} HTML pages, updated ${touched}.`);
