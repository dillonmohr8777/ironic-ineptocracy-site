import { access, rm } from "node:fs/promises";
// Static publication needs no RSC signing material, preview keys, or server cache.
await Promise.all(
  ["index.html", "characters/mark/index.html", "dossier/index.html"].map((f) =>
    access(`out/${f}`),
  ),
);
await rm(".next", { recursive: true, force: true });
console.log(
  "Static delivery complete. Removed the unused Next server build cache.",
);
