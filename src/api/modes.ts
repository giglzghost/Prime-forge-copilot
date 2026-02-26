import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCurrentMode, getCurrentModeDescription, setMode } from "../core/autonomy";
import { requestAuthorizationEmail } from "../utils/notifier";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Current mode.",
      data: {
        mode: getCurrentMode(),
        description: getCurrentModeDescription()
      }
    });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const requestedBy = body.requestedBy || "http-api";
    const mode = body.mode;

    const result = setMode(mode, {
      requestedBy,
      reason: body.reason
    });

    // Optional: email on mode escalation to C or D
    if (result.ok && (mode === "C" || mode === "D")) {
      await requestAuthorizationEmail(
        "Prime Forge Copilot – Mode Escalation",
        `Mode changed to ${mode} by ${requestedBy}`,
        { reason: body.reason }
      );
    }

    return res.status(result.ok ? 200 : 400).json(result);
  }

  return res.status(405).json({ ok: false, message: "Use GET or POST." });
}
