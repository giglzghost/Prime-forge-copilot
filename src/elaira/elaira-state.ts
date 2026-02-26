let lastMode: string | null = null;
let lastSummary: string | null = null;

export function updateElairaState(params: {
  mode: string;
  summary: string;
}) {
  lastMode = params.mode;
  lastSummary = params.summary;
}

export function getElairaState() {
  return {
    lastMode,
    lastSummary
  };
}
