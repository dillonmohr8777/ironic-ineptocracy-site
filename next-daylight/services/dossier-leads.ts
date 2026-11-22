/** Shared, opt-in delivery adapter. Neither addresses nor upstream responses are logged. */
export async function deliver(
  payload: unknown,
  endpoint?: string,
  auth?: string,
): Promise<[number, { ok: boolean }]> {
  if (!endpoint) return [503, { ok: false }];
  if (
    !payload ||
    typeof payload !== "object" ||
    !("email" in payload) ||
    typeof payload.email !== "string"
  )
    return [400, { ok: false }];
  const email = payload.email.trim();
  if (email.length > 254 || !/^\S+@[^\s@]+\.[^\s@]+$/.test(email))
    return [400, { ok: false }];
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") return [503, { ok: false }];
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      },
      body: JSON.stringify({ email, source: "dossier-request" }),
      redirect: "error",
      signal: AbortSignal.timeout(7000),
    });
    return upstream.ok ? [200, { ok: true }] : [502, { ok: false }];
  } catch {
    return [503, { ok: false }];
  }
}
