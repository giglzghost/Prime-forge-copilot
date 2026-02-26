import { queryMemory } from "../core/memory";
import { getCurrentMode } from "../core/autonomy";

export interface ChatContext {
  mode: string;
  systemSummary: string;
  recentMemory: any[];
  userMessage: string;
}

export function buildChatContext(userMessage: string): ChatContext {
  const mode = getCurrentMode();
  const recent = queryMemory((entry) => {
    // naive: last N entries; you can refine later
    return true;
  }).slice(-20);

  const systemSummary = `Prime Forge Copilot running in mode ${mode}.`;

  return {
    mode,
    systemSummary,
    recentMemory: recent,
    userMessage
  };
}
