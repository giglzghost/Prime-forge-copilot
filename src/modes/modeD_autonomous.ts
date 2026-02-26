export const MODE_ID = "D";

export function describe() {
  return {
    id: MODE_ID,
    name: "Autonomous",
    description: "High autonomy within policy and explicit constraints. Logs heavily, no silent escalation."
  };
}

export function applyConstraints(context: any) {
  return {
    ...context,
    externalActionsAllowed: true,
    creativeLevel: "high",
    autonomy: "elevated"
  };
}
