import { getCurrentMode, getCurrentModeDescription, setMode } from "../core/autonomy";
import { requestAuthorizationEmail } from "../utils/notifier";

export async function getModeInfo() {
  return {
    ok: true,
    message: "Current mode.",
    data: {
      mode: getCurrentMode(),
      description: getCurrentModeDescription()
    }
  };
}

export async function changeMode(payload: any) {
  const requestedBy = payload.requestedBy || "internal";
  const mode = payload.mode;

  const result = setMode(mode, {
    requestedBy,
    reason: payload.reason
  });

  // Optional: email on mode escalation to C or D
  if (result.ok && (mode === "C" || mode === "D")) {
    await requestAuthorizationEmail(
      "Prime Forge Copilot – Mode Escalation",
      `Mode changed to ${mode} by ${requestedBy}`,
      { reason: payload.reason }
    );
  }

  return result;
}
