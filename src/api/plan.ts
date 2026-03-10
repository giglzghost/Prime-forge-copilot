import { route } from "../core/router";

export function generatePlan(payload: any) {
  const result = route({
    type: "plan",
    action: "generate",
    payload: { goal: payload.goal },
    requestedBy: payload.requestedBy || "internal"
  });

  return result;
}
