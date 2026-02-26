import type { VercelRequest, VercelResponse } from "@vercel/node";
import { route } from "../core/router";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const result = route({
      type: "memory",
      action: "query",
      requestedBy: "http-api"
    });
    return res.status(result.ok ? 200 : 400).json(result);
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const result = route({
      type: "memory",
      action: "append",
      payload: {
        type: body.type,
        data: body.data
      },
      requestedBy: body.requestedBy || "http-api"
    });
    return res.status(result.ok ? 200 : 400).json(result);
  }

  return res.status(405).json({ ok: false, message: "Use GET or POST." });
}
