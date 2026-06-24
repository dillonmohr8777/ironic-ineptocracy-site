# VA Claims — Front-End Design Capabilities Starter Brief

A branded, draft "Front-End Design Capabilities — Starter Brief" for the **VA Claims**
custom-software project (built by **Momentum Digital**). Prepared by Dillon Mohr for James (VA Claims).

> This is unrelated to the rest of this repository. It lives under `docs/va-claims/` to keep it separate.

## Files

| File | What it is |
| --- | --- |
| `front-end-capabilities-brief.html` | Editable HTML + CSS source for the brief. |
| `front-end-capabilities-brief.pdf` | The rendered, branded PDF — the deliverable (8 pages). |
| `assets/va-claims-logo.jpeg` | VA Claims emblem, referenced by the HTML. Dark baked-in background, so it is placed on dark bands only. |

## Notes

- This is a **starter draft** for review. Items marked `[TBD]` / "concept — to confirm" are placeholders to refine.
- Phase positioning per the signed roadmap: **Phase 2 = environment, tools & core setup (no front-end design)**.
  Front-end UI design and build are delivered in **Phase 3**, refined in **Phase 4 (UX improvements)**.
- The "Payment Watch" concept layout uses sample placeholder rows to illustrate the two-group view; it is not real client data.

## Re-rendering the PDF

The PDF is generated from the HTML with [WeasyPrint](https://weasyprint.org/) (best `@page` / CSS fidelity).

```bash
# from the repo root
pip install weasyprint
python3 -c "from weasyprint import HTML; HTML(filename='docs/va-claims/front-end-capabilities-brief.html').write_pdf('docs/va-claims/front-end-capabilities-brief.pdf')"
```

The logo is referenced relatively (`assets/va-claims-logo.jpeg`), so run the command from a location where that path resolves, or keep the `assets/` folder next to the HTML. Edit the HTML and re-run to regenerate.
