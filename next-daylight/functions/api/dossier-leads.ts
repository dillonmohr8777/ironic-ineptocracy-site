import { deliver, health, type LeadEnv } from "../../services/dossier-leads";
export function onRequestGet({env}:{env:LeadEnv}) { return Response.json(health(env), {headers:{"Cache-Control":"no-store"}}); }
export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: LeadEnv;
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
  const [status, result] = await deliver(body, env);
  return Response.json(result, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
