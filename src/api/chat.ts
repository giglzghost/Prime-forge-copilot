import type { VercelRequest, VercelResponse } from "@vercel/node";
import { route } from "../core/router";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  try {
    const body = req.body || {};

    const payload = {
      type: "chat",
      action: "process",
      message: body.message,
      requestedBy: body.requestedBy || "http-api"
    };

    const result = await route("chat", payload);

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      message: "Chat handler error.",
      error: err?.message ?? String(err)
    });
  }
}
