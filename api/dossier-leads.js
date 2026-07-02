// Vercel serverless function backing the site-wide signup form.
// The SPA bundle POSTs JSON here (see cg()/nh() in assets/index-*.js) and
// requires an { ok: true } JSON body on success.
//
// Delivery targets, controlled by environment variables set in Vercel:
//   MAILERLITE_API_KEY   - MailerLite "connect" API token (required for MailerLite)
//   MAILERLITE_GROUP_ID  - numeric group id to subscribe leads into (optional)
//   LEADS_WEBHOOK_URL    - Google Apps Script (or any) webhook that accepts the raw
//                          lead JSON; used as a second copy / fallback (optional)
//
// At least one target must be configured, otherwise the function answers 503 so
// broken wiring is loud instead of silently dropping readers.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readConfig() {
  return {
    mailerliteKey: process.env.MAILERLITE_API_KEY?.trim() || null,
    mailerliteGroup: process.env.MAILERLITE_GROUP_ID?.trim() || null,
    webhookUrl: process.env.LEADS_WEBHOOK_URL?.trim() || null,
  };
}

async function sendToMailerLite(lead, config) {
  const body = {
    email: lead.email,
    fields: {
      name: lead.firstName || undefined,
      source: lead.source || undefined,
      utm_source: lead.utmSource || undefined,
      utm_medium: lead.utmMedium || undefined,
      utm_campaign: lead.utmCampaign || undefined,
    },
  };
  if (config.mailerliteGroup) body.groups = [config.mailerliteGroup];

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${config.mailerliteKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 409) {
    const detail = await res.text().catch(() => "");
    throw new Error(`MailerLite ${res.status}: ${detail.slice(0, 300)}`);
  }
}

async function sendToWebhook(lead, config) {
  const res = await fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    redirect: "follow",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Webhook ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export default async function handler(req, res) {
  const config = readConfig();

  if (req.method === "GET") {
    // Health check: visit /api/dossier-leads in a browser to verify wiring.
    res.status(200).json({
      ok: true,
      mailerliteConfigured: Boolean(config.mailerliteKey),
      mailerliteGroupConfigured: Boolean(config.mailerliteGroup),
      webhookConfigured: Boolean(config.webhookUrl),
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = null;
    }
  }
  const email = payload?.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    res.status(400).json({ ok: false, error: "A valid email is required." });
    return;
  }

  const lead = {
    email,
    firstName: payload.firstName?.trim() || null,
    source: payload.source || null,
    project: payload.project || "The Ironic Ineptocracy",
    capturedAt: payload.capturedAt || new Date().toISOString(),
    pageUrl: payload.pageUrl || null,
    sourcePage: payload.sourcePage || null,
    utmSource: payload.utmSource || null,
    utmMedium: payload.utmMedium || null,
    utmCampaign: payload.utmCampaign || null,
    utmContent: payload.utmContent || null,
    utmTerm: payload.utmTerm || null,
  };

  if (!config.mailerliteKey && !config.webhookUrl) {
    console.error("dossier-leads: no delivery target configured", { email: lead.email });
    res.status(503).json({
      ok: false,
      error: "Signup is temporarily offline. Please try again soon.",
    });
    return;
  }

  const failures = [];
  let delivered = false;

  if (config.mailerliteKey) {
    try {
      await sendToMailerLite(lead, config);
      delivered = true;
    } catch (err) {
      failures.push(String(err));
    }
  }
  if (config.webhookUrl) {
    try {
      await sendToWebhook(lead, config);
      delivered = true;
    } catch (err) {
      failures.push(String(err));
    }
  }

  if (!delivered) {
    console.error("dossier-leads: all delivery targets failed", failures);
    res.status(502).json({
      ok: false,
      error: "Signup is temporarily offline. Please try again soon.",
    });
    return;
  }

  if (failures.length) console.warn("dossier-leads: partial delivery", failures);
  res.status(200).json({ ok: true });
}
