import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateImage } from "../ai/provider";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  const body = req.body || {};
  const prompt = body.prompt;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ ok: false, message: "Missing 'prompt'." });
  }

  const img = await generateImage({
    prompt,
    size: body.size || "1024x1024"
  });

  res.status(200).json({
    ok: true,
    message: "Image generation request processed.",
    data: img
  });
}
