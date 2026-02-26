import type { VercelRequest, VercelResponse } from "@vercel/node";
import { route } from "../core/router";
import { requestAuthorizationEmail } from "../utils/notifier";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  const body = req.body || {};
  const result = route({
    type: "task",
    action: body.action || "unknown",
    payload: body,
    requestedBy: body.requestedBy || "http-api"
  });

  // If policy blocked due to missing confirmation, ping you
  if (!result.ok && result.message?.includes("requires explicit human confirmation")) {
    await requestAuthorizationEmail(
      "Prime Forge Copilot – Authorization Needed",
      result.message,
      { requestBody: body }
    );
  }

  res.status(result.ok ? 200 : 400).json(result);
}
