import type { VercelRequest, VercelResponse } from "@vercel/node";
import { route } from "../core/router";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  const body = req.body || {};
  const result = route({
    type: "plan",
    action: "generate",
    payload: { goal: body.goal },
    requestedBy: body.requestedBy || "http-api"
  });

  res.status(result.ok ? 200 : 400).json(result);
}
