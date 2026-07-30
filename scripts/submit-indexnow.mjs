import { readFile } from "node:fs/promises";

const host = "ironicineptocracy.com";
const key = "a7c9e2d4f6814b03b1e5a9c7d2f8460b";
const keyLocation = `https://${host}/${key}.txt`;
const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  match[1].replaceAll("&amp;", "&"),
);

if (!urlList.length) {
  throw new Error("No URLs found in sitemap.xml.");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${await response.text()}`);
}

console.log(`IndexNow accepted ${urlList.length} canonical URLs with HTTP ${response.status}.`);
