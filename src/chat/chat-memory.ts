import { appendMemory } from "../core/memory";

export function logChatTurn(params: {
  role: "user" | "assistant" | "system";
  content: string;
  meta?: any;
}) {
  appendMemory({
    timestamp: new Date().toISOString(),
    type: "observation",
    payload: {
      role: params.role,
      content: params.content,
      meta: params.meta || {}
    }
  });
}
