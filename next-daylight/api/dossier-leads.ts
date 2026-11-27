import { deliver, health, type LeadEnv } from "../services/dossier-leads";
import type { IncomingMessage, ServerResponse } from "node:http";
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
) {
  function reply(status: number, body: { ok: boolean; error?: string }) {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(body));
  }
  const env: LeadEnv = process.env as LeadEnv;
  if (req.method === "GET") return reply(200, health(env));
  if (req.method !== "POST") return reply(405, { ok: false });
  if (!req.headers["content-type"]?.includes("application/json"))
    return reply(415, { ok: false });
  try {
    if (
      req.headers.origin &&
      new URL(req.headers.origin).host !== req.headers.host
    )
      return reply(403, { ok: false });
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const [status, result] = await deliver(body, env);
    reply(status, result);
  } catch {
    reply(400, { ok: false });
  }
}
