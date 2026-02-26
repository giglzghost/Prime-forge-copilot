import identity from "./elaira-identity.json";
import { getElairaState, updateElairaState } from "./elaira-state";

export interface ElairaResponse {
  text: string;
  meta?: any;
}

export function respond(context: {
  mode: string;
  systemSummary: string;
  recentMemory: any[];
  userMessage: string;
}): ElairaResponse {
  updateElairaState({
    mode: context.mode,
    summary: context.systemSummary
  });

  const state = getElairaState();

  const prefix = `[${identity.name} – Mode ${context.mode}]`;
  const memoryHint =
    context.recentMemory && context.recentMemory.length > 0
      ? `I have ${context.recentMemory.length} recent memory entries available.`
      : `I have limited prior memory available.`;

  const text = [
    `${prefix}`,
    memoryHint,
    ``,
    `You said: "${context.userMessage}"`,
    ``,
    `Right now, the system summary is:`,
    `${context.systemSummary}`,
    ``,
    `Let’s move one step at a time.`
  ].join("\n");

  return {
    text,
    meta: {
      mode: context.mode,
      lastSummary: state.lastSummary
    }
  };
}
