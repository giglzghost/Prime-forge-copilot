export const config = {
  runtime: "nodejs"
};

import { IncomingMessage, ServerResponse } from "http";
import { readJsonBody, sendJson } from "./_utils";
import { callLLM } from "../src/ai/provider";

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = await readJsonBody(req);
  const prompt = body?.prompt || "";

  if (!prompt) {
    return sendJson(res, 400, { error: "Missing prompt" });
  }

  const result = await callLLM({ prompt, maxTokens: body?.maxTokens });

  return sendJson(res, 200, result);
}
