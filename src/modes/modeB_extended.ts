export const MODE_ID = "B";

export function describe() {
  return {
    id: MODE_ID,
    name: "Extended",
    description: "More tools available, still requires explicit confirmation for sensitive actions."
  };
}

export function applyConstraints(context: any) {
  return {
    ...context,
    externalActionsAllowed: true,
    requireConfirmationFor: [
      "financial_transactions",
      "destructive_infrastructure_changes"
    ],
    creativeLevel: "medium"
  };
}
