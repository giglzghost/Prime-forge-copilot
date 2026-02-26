import type { VercelRequest, VercelResponse } from "@vercel/node";
import { chat } from "../chat/chat-engine";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  const body = req.body || {};
  const message = body.message;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ ok: false, message: "Missing 'message'." });
  }

  const result = await chat(message, {
    requestedBy: body.requestedBy || "http-api"
  });

  res.status(result.ok ? 200 : 400).json(result);
}
