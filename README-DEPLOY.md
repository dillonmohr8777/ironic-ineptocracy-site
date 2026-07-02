# Deploy Notes: Lead Capture + Analytics

## What's wired now

• `api/dossier-leads.js` backs the signup form on every page. Vercel deploys root-level `api/` as serverless functions automatically, and function routes win over the SPA catch-all rewrite, so no `vercel.json` change was needed.
• `assets/site-analytics.js` loads GA4 and the Meta Pixel from meta tags on each page and fires a `generate_lead` / `Lead` event when the signup form submits.
• All 18 prerendered pages carry three meta tags: `ga4-measurement-id`, `google-site-verification`, `meta-pixel-id`. They ship with REPLACE placeholders and stay inert until real IDs go in.

## One-time setup (about 15 minutes)

### 1. Lead delivery (pick one or both)
Set environment variables in Vercel → Project → Settings → Environment Variables:

• `MAILERLITE_API_KEY` — from MailerLite → Integrations → API. Leads become subscribers.
• `MAILERLITE_GROUP_ID` — optional numeric group id to file them under (make a "Garnier Dossier" group).
• `LEADS_WEBHOOK_URL` — optional Google Apps Script web-app URL if you also want every lead appended to a Sheet.

With neither set, the form answers 503 on purpose so a broken pipe is loud. Health check: open `/api/dossier-leads` in a browser and confirm the three `configured` flags.

### 2. GA4
Create a GA4 web property for ironicineptocracy.com, copy the `G-` measurement id, then:

```
node scripts/set-analytics-ids.mjs --ga4 G-XXXXXXXXXX
```

Commit and push. Realtime report should show you within a minute of visiting the site.

### 3. Google Search Console
Add ironicineptocracy.com as a URL-prefix property, choose the HTML tag method, copy the content token, then:

```
node scripts/set-analytics-ids.mjs --gsc <token>
```

Push, verify in GSC, then submit `https://ironicineptocracy.com/sitemap.xml` under Sitemaps.

### 4. Meta Pixel (when ads start)
```
node scripts/set-analytics-ids.mjs --pixel <pixel-id>
```

The submit listener already fires the `Lead` event, so the pixel is conversion-ready the moment the id lands.

## Verifying end to end

1. `/api/dossier-leads` GET shows delivery configured.
2. Submit the form with a test email; confirm it appears in MailerLite (and the Sheet if wired).
3. GA4 Realtime shows `page_view` on navigation and `generate_lead` on submit.
4. Make sure the MailerLite group has the automation that sends the Garnier Dossier download.
