import { route } from "../core/router";

export function queryMemory() {
  return route({
    type: "memory",
    action: "query",
    requestedBy: "internal"
  });
}

export function appendMemory(payload: any) {
  const result = route({
    type: "memory",
    action: "append",
    payload: {
      type: payload.type,
      data: payload.data
    },
    requestedBy: payload.requestedBy || "internal"
  });

  return result;
}
