import * as ModeA from "../modes/modeA_safe";
import * as ModeB from "../modes/modeB_extended";
import * as ModeC from "../modes/modeC_creative";
import * as ModeD from "../modes/modeD_autonomous";

export type ModeId = "A" | "B" | "C" | "D";

let currentMode: ModeId = "A";

export function getCurrentMode(): ModeId {
  return currentMode;
}

export function getCurrentModeDescription() {
  return getModeModule(currentMode).describe();
}

export function setMode(
  mode: ModeId,
  options?: { requestedBy: string; reason?: string }
): { ok: boolean; message: string } {
  if (!getModeModule(mode)) {
    return { ok: false, message: `Unknown mode: ${mode}` };
  }

  // this is where policy + auth will plug in later
  currentMode = mode;
  return {
    ok: true,
    message: `Mode set to ${mode} by ${options?.requestedBy || "unknown"}`
  };
}

export function applyModeConstraints(context: any): any {
  const mod = getModeModule(currentMode);
  return mod.applyConstraints(context);
}

function getModeModule(mode: ModeId) {
  switch (mode) {
    case "A":
      return ModeA;
    case "B":
      return ModeB;
    case "C":
      return ModeC;
    case "D":
      return ModeD;
    default:
      return ModeA;
  }
}
