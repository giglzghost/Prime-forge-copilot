export const MODE_ID = "C";

export function describe() {
  return {
    id: MODE_ID,
    name: "Creative",
    description: "Creative generation prioritized, still bound by policy and constraints."
  };
}

export function applyConstraints(context: any) {
  return {
    ...context,
    externalActionsAllowed: true,
    creativeLevel: "high"
  };
}
