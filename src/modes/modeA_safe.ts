export const MODE_ID = "A";

export function describe() {
  return {
    id: MODE_ID,
    name: "Safe",
    description: "Minimal, conservative behavior. No external actions, read-only where possible."
  };
}

export function applyConstraints(context: any) {
  return {
    ...context,
    externalActionsAllowed: false,
    creativeLevel: "low"
  };
}
