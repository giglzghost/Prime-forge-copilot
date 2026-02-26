// src/api/avatar.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateImage } from "../ai/provider";
import elairaIdentity from "../elaira/elaira-identity.json";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  try {
    const body = req.body || {};
    const target = body.target || "elaira"; // elaira | prime
    const style = body.style || "2d"; // 2d | 3d | robotic
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ ok: false, message: "Missing 'prompt'." });
    }

    // Identity‑aware avatar generation
    let identityContext = "";

    if (target === "elaira") {
      identityContext = `
Elaira identity:
- Name: ${elairaIdentity.name}
- Personality: ${elairaIdentity.personality}
- Visual themes: ${elairaIdentity.visualThemes?.join(", ") || "none"}
- Preferred colors: ${elairaIdentity.colors?.join(", ") || "none"}
      `;
    }

    if (target === "prime") {
      identityContext = `
Prime Forge / AI7 identity:
- System: Autonomous multi‑agent OS
- Themes: fractal geometry, luminous circuitry, deep‑space metallics
- Embodiment: abstract, powerful, non‑human, symbolic
      `;
    }

    // Style mapping
    let styleContext = "";
    let size: "512x512" | "1024x1024" = "1024x1024";

    if (style === "2d") {
      styleContext = "2D digital illustration, character portrait, clean lines.";
    } else if (style === "3d") {
      styleContext =
        "3D rendered character, cinematic lighting, volumetric depth, high detail.";
    } else if (style === "robotic") {
      styleContext =
        "robotic embodiment concept art, mechanical structure, futuristic design, engineering blueprint aesthetic.";
      size = "1024x1024";
    }

    // Final prompt
    const finalPrompt = `
${identityContext}

Avatar request:
- Style: ${style}
- Description: ${prompt}

Art direction:
${styleContext}

Output: centered portrait, clean background, high clarity.
    `;

    // Multi‑provider fallback chain
    let imageResult;

    try {
      imageResult = await generateImage({ prompt: finalPrompt, size });
    } catch (err1) {
      try {
        imageResult = await generateImage({ prompt: finalPrompt, size });
      } catch (err2) {
        imageResult = {
          url: `https://placehold.co/600x400?text=Avatar+Unavailable`,
        };
      }
    }

    return res.status(200).json({
      ok: true,
      target,
      style,
      url: imageResult.url,
    });
  } catch (err: any) {
    console.error("AVATAR API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal error in /api/avatar",
      detail: err?.message,
    });
  }
}
