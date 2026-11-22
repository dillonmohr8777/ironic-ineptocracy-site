import { deliver } from "../../services/dossier-leads";
type Env = { DOSSIER_LEADS_URL?: string; DOSSIER_LEADS_TOKEN?: string };
export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ ok: false }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ ok: false }, { status: 415 });
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 2048)
      return Response.json({ ok: false }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const [status, result] = await deliver(
    body,
    env.DOSSIER_LEADS_URL,
    env.DOSSIER_LEADS_TOKEN,
  );
  return Response.json(result, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
