// src/api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Existing engine (kept for compatibility)
import { chat as legacyChat } from "../chat/chat-engine";

// Elaira
import { chatWithElaira } from "../chat/chat-elaira";

// Multi‑AI provider (Prime Forge / AI7)
import { runMultiAI } from "../ai/provider";

// Swarm
import { handleSwarmMessage } from "../core/swarm";

// Modes
import modeA from "../modes/modeA_safe";
import modeB from "../modes/modeB_extended";
import modeC from "../modes/modeC_creative";
import modeD from "../modes/modeD_autonomous";

// Governance
import { checkAuthorization } from "../core/authorization";
import { applyPolicy } from "../core/policy";
import { routeMessage } from "../core/router";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  try {
    const body = req.body || {};
    const message = body.message;
    const target = body.target || "elaira"; // elaira | prime | swarm
    const mode = body.mode || "A"; // A | B | C | D

    if (!message || typeof message !== "string") {
      return res.status(400).json({ ok: false, message: "Missing 'message'." });
    }

    // 1. Authorization
    const auth = checkAuthorization({ target, mode, message });
    if (!auth.allowed) {
      return res.status(403).json({ ok: false, message: auth.reason });
    }

    // 2. Policy enforcement
    const policy = applyPolicy({ target, mode, message });
    if (!policy.allowed) {
      return res.status(400).json({ ok: false, message: policy.reason });
    }

    // 3. Mode selection
    let modeHandler;
    switch (mode) {
      case "A":
        modeHandler = modeA;
        break;
      case "B":
        modeHandler = modeB;
        break;
      case "C":
        modeHandler = modeC;
        break;
      case "D":
        modeHandler = modeD;
        break;
      default:
        modeHandler = modeA;
    }

    // 4. Routing to correct AI
    let reply: string;

    if (target === "elaira") {
      reply = await chatWithElaira(message, modeHandler);
    } else if (target === "prime") {
      const results = await runMultiAI(message, modeHandler);
      reply = results.primary ?? "[no response]";
    } else if (target === "swarm") {
      reply = await handleSwarmMessage(message, modeHandler);
    } else {
      // fallback to legacy engine
      const legacy = await legacyChat(message, {
        requestedBy: body.requestedBy || "http-api",
      });
      reply = legacy?.reply || "[legacy engine reply missing]";
    }

    // 5. Final router pass (Prime Forge OS)
    const routed = await routeMessage({
      target,
      mode,
      message,
      reply,
    });

    return res.status(200).json({
      ok: true,
      reply: routed,
      target,
      mode,
    });
  } catch (err: any) {
    console.error("CHAT API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal error in /api/chat",
      detail: err?.message,
    });
  }
}
