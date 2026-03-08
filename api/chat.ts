export const config = {
  runtime: "nodejs"
};

import { IncomingMessage, ServerResponse } from "http";
import { readJsonBody, sendJson } from "./_utils";
import { handleChat } from "../src/core/ai7";

export default async function handler(
  req: IncomingMessage | any,
  res: ServerResponse | any
) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = await readJsonBody(req);
  const prompt = body?.prompt || body?.message || "";

  if (!prompt) {
    return sendJson(res, 400, { error: "Missing prompt" });
  }

  const result = await handleChat({
    userMessage: prompt,
    requestedBy: body?.requestedBy || "api:chat"
  });

  return sendJson(res, 200, result);
}
