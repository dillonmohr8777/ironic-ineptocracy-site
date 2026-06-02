import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "dist");
const excluded = new Set([
  ".git",
  ".vercel",
  "dist",
  "node_modules",
  "scripts",
  "package.json",
  "package-lock.json"
]);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for await (const entry of await import("node:fs/promises").then((fs) => fs.opendir(root))) {
  if (excluded.has(entry.name)) continue;
  await cp(join(root, entry.name), join(out, entry.name), { recursive: true });
}

for (const required of ["index.html", "characters/index.html", "world/index.html", "images/characters/darnell.png", "vercel.json"]) {
  if (!existsSync(join(out, required))) {
    throw new Error(`Static build missing required file: ${required}`);
  }
}

console.log("Static Vercel output copied to dist.");
