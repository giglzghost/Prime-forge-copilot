import { queryMemory, appendMemory } from "./memory";
import { getCurrentMode, applyModeConstraints } from "./autonomy";
import { evaluateAction } from "./policy";
import { respond as elairaRespond } from "../elaira/elaira-interface";
import { route, RouteResponse } from "./router";
import { getSwarm } from "./swarm";
import { runMultiAI } from "../ai/provider";

export interface AI7ChatRequest {
  userMessage: string;
  requestedBy?: string;
}

export interface AI7ChatResponse {
  text: string;
  meta?: any;
}

export async function handleChat(req: AI7ChatRequest): Promise<AI7ChatResponse> {
  const mode = getCurrentMode();
  const recentMemory = queryMemory().slice(-20);

  const systemSummary = buildSystemSummary(mode);

  const context = applyModeConstraints({
    mode,
    systemSummary,
    recentMemory,
    requestedBy: req.requestedBy || "unknown",
    userMessage: req.userMessage
  });

  const policyCheck = evaluateAction("chat:process");
  if (!policyCheck.allowed) {
    return {
      text: "This request is not allowed under the current ethical core.",
      meta: { reason: policyCheck.reason, escalate: policyCheck.escalate }
    };
  }

  const shouldUseElaira = decideElairaDelegation(context);

  let text: string;
  let meta: any = { mode, usedElaira: shouldUseElaira };

  if (shouldUseElaira) {
    const elaira = elairaRespond({
      mode,
      systemSummary: context.systemSummary,
      recentMemory,
      userMessage: req.userMessage
    });
    text = elaira.text;
    meta = { ...meta, elairaMeta: elaira.meta };
  } else {
    const multi = await runMultiAI(req.userMessage);

    // ⭐ FIX: await route()
    const routed: RouteResponse = await route({
      type: "plan",
      action: "generate",
      payload: { goal: req.userMessage },
      requestedBy: req.requestedBy || "unknown"
    });

    if (routed.ok && routed.data) {
      text = [
        multi.primary ?? "No primary LLM response available.",
        "",
        formatPlanAsText(routed.data)
      ].join("\n");
      meta = { ...meta, routed, multiAI: multi };
    } else {
      text = multi.primary ?? "I received your message but could not generate a structured response.";
      meta = { ...meta, routed, multiAI: multi };
    }
  }

  appendMemory({
    timestamp: new Date().toISOString(),
    type: "observation",
    payload: {
      mode,
      userMessage: req.userMessage,
      usedElaira: shouldUseElaira
    }
  });

  return { text, meta };
}

function buildSystemSummary(mode: string): string {
  const swarm = getSwarm();
  return [
    `Current mode: ${mode}`,
    `Core: ${swarm.core.name} (${swarm.core.role})`,
    `Primary interface: ${swarm.primary_interface.name} (${swarm.primary_interface.role})`,
    `Agents: ${swarm.agents.length} registered`
  ].join(" | ");
}

function decideElairaDelegation(context: any): boolean {
  const msg = (context.userMessage || "").toLowerCase();

  const conversationalHints = [
    "hi",
    "hello",
    "how are you",
    "talk",
    "explain",
    "feel",
    "story",
    "conversation",
    "what do you think",
    "can we talk"
  ];

  const isConversational = conversationalHints.some((h) => msg.includes(h));

  if (context.mode === "A") {
    return isConversational;
  }

  if (context.mode === "B" || context.mode === "C") {
    return true;
  }

  if (context.mode === "D") {
    return isConversational;
  }

  return isConversational;
}

function formatPlanAsText(plan: any[]): string {
  const lines = ["Here is a structured way to move forward:"];
  for (const step of plan) {
    lines.push(`Step ${step.step}: ${step.action} – ${step.detail}`);
  }
  return lines.join("\n");
}
