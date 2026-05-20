# Recovery Notes

This repository was created after the Ironic Ineptocracy website was already live on Vercel.

## What is in this commit

- A recovery of the currently live static site shell from `https://www.ironicineptocracy.com/`.
- The live built JavaScript/CSS bundles under `assets/`.
- The live image assets discovered from the deployed HTML/CSS/JS under `images/`.
- A minimal Vite package wrapper so the site can be built/previewed safely from GitHub.

## Safety

This repo is **not yet connected to the production Vercel project**. Creating and pushing this repo does not alter the live website.

Before any production reconnect/redeploy:

1. Run `npm run build`.
2. Preview the output.
3. Compare against the current live site.
4. Use Vercel preview first.
5. Promote to production only with Dillon's explicit approval.

## Future cleanup

The current app logic is recovered from the deployed/minified bundle. A later cleanup pass should recreate readable React source components under `src/` while preserving the live design and copy.
