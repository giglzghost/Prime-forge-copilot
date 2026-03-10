export function getApiIndex() {
  return {
    ok: true,
    message: "Prime Forge Copilot API root.",
    endpoints: [
      "/api/status",
      "/api/plan",
      "/api/run-task",
      "/api/memory",
      "/api/modes"
    ]
  };
}
