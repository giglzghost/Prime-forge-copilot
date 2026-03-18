import { route } from "../core/router";
import { requestAuthorizationEmail } from "../utils/notifier";

export async function runTask(payload: any) {
  // ⭐ FIX: await route()
  const result = await route({
    type: "task",
    action: payload.action || "unknown",
    payload,
    requestedBy: payload.requestedBy || "internal"
  });

  // If policy blocked due to missing confirmation, ping you
  if (
    !result.ok &&
    result.message?.includes("requires explicit human confirmation")
  ) {
    await requestAuthorizationEmail(
      "Prime Forge Copilot – Authorization Needed",
      result.message,
      { requestBody: payload }
    );
  }

  return result;
}
