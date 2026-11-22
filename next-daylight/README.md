# The Ironic Ineptocracy · Public Archive

Next.js App Router, React 19, TypeScript, Tailwind CSS 4. `pnpm install && pnpm build` writes the static publication to `out/`. Set the project root to this directory and the output directory to `out` on Cloudflare Pages or Vercel. The build discards the unused `.next` server cache after export; there are no server actions or runtime font fetches.

## Optional dossier delivery

The static edition does not transmit or retain email addresses. To enable requests, set `NEXT_PUBLIC_DOSSIER_BACKEND=enabled` **before building** and configure a trusted HTTPS collector as `DOSSIER_LEADS_URL` on the host. `DOSSIER_LEADS_TOKEN` is an optional server-only bearer credential. Root `functions/api/dossier-leads.ts` (Cloudflare Pages) and `api/dossier-leads.ts` (Vercel) adapt the same POST contract. Only a successful upstream status is acknowledged. Set host-side rate limits before opening submissions. No credentials belong in the static export.

## Artwork and records

`src/components/BleedingFlagCanvas.tsx` owns visibility, sizing, wind and motion preference. `src/lib/flag.ts` contains the indexed cloth mesh, analytic travelling waves, warp/weft material, 50-star canton, normal-derived fold lighting, ink ribbons and gravity-driven droplets. Canvas2D uses affine texture patches on the same surface. A priority-loaded still is present before hydration. The flag is procedural cloth and art-directed pigment, not a finite-element solver.

All portraits, film, voices and score use local assets. The character record and four public screenplay extracts are drawn from the previous public archive. Unpublished biometric values are shown as N/F rather than assigned a fictional score. The geographic graphic uses simplified public US state boundaries (PublicaMundi MappingAPI / US states GeoJSON), with an explicitly editorial route overlay.

Accessibility includes a visible motion switch, reduced-motion print frame, off-screen rendering suspension, keyboard roster navigation, native dialog and popover, and native form validation.
