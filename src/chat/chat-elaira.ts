import { buildChatContext } from "./chat-context";
import { logChatTurn } from "./chat-memory";
import { respond as elairaRespond } from "../elaira/elaira-interface";

export async function handleChatTurn(userMessage: string) {
  const ctx = buildChatContext(userMessage);

  logChatTurn({ role: "user", content: userMessage });

  const elaira = elairaRespond(ctx);

  logChatTurn({ role: "assistant", content: elaira.text, meta: elaira.meta });

  return elaira;
}
