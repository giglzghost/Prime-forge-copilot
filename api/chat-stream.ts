export const config = {
  runtime: "nodejs"
};

import type { IncomingMessage, ServerResponse } from "http";
import { route } from "../src/core/router";

export default async function handler(
  req: IncomingMessage | any,
  res: ServerResponse | any
) {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  const core = route({
    type: "chat",
    action: "subscribeStream",
    requestedBy: "api:chat-stream"
  });

  const unsubscribe =
    core.onMessage &&
    core.onMessage((msg: any) => {
      const payload = {
        text: msg.text ?? msg.reply ?? "",
        meta: msg.meta ?? {}
      };
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

  req.on("close", () => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });
}
