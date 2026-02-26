import { handleChatTurn } from "./chat-elaira";

export async function chat(message: string, options?: { requestedBy?: string }) {
  const result = await handleChatTurn(message);

  return {
    ok: true,
    message: "Chat response generated.",
    data: {
      text: result.text,
      meta: result.meta
    }
  };
}
