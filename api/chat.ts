
import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_utils";
import { route } from "../src/core/router";

export default async function handler(
  req: IncomingMessage | any,
  res: ServerResponse | any
) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, message: "Use POST." });
  }

  let body: any = {};
  try {
    body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};
  } catch {
    body = {};
  }

  // Poll channel
  if (body.action === "poll") {
    const core = route({
      type: "chat",
      action: "poll",
      requestedBy: "api:chat"
    });

    const messages = core.outgoingMessages ?? [];
    return sendJson(res, 200, { ok: true, messages });
  }

  // User → AI7
  const message = body.message ?? body.text ?? "";
  const core = route({
    type: "chat",
    action: "userMessage",
    requestedBy: "api:chat",
    payload: { message }
  });

  const reply = core.reply ?? core.text ?? "No reply.";
  return sendJson(res, 200, { ok: true, reply });
}
