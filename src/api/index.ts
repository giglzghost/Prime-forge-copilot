import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    message: "Prime Forge Copilot API root.",
    endpoints: [
      "/api/status",
      "/api/plan",
      "/api/run-task",
      "/api/memory",
      "/api/modes"
    ]
  });
}
