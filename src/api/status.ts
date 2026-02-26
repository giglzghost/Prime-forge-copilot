import type { VercelRequest, VercelResponse } from "@vercel/node";
import { route } from "../core/router";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const result = route({
    type: "status",
    action: "get",
    requestedBy: "http-api"
  });

  res.status(result.ok ? 200 : 400).json(result);
}
