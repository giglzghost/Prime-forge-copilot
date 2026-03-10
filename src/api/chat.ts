import { evaluateAction } from "../core/policy";

export async function processChat(payload: any) {
  try {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : "(no message provided)";

    const policy = evaluateAction(message);

    if (!policy.allowed) {
      return {
        ok: false,
        message: "Action requires founder escalation.",
        reason: policy.reason,
        escalate: true
      };
    }

    return {
      ok: true,
      message: "Prime Forge V3 chat stub online.",
      data: {
        echo: message,
        meta: {
          source: "prime-forge-copilot",
          mode: "stub",
          ethics: "checked"
        }
      }
    };
  } catch (err: any) {
    return {
      ok: false,
      message: "Chat handler error.",
      error: err?.message ?? String(err)
    };
  }
}
