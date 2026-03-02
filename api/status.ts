
export const config = {
  runtime: "nodejs18.x"
};
import { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_utils";
import { route } from "../src/core/router";

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const result = route({
    type: "status",
    action: "get",
    requestedBy: "api:status"
  });

  return sendJson(res, result.ok ? 200 : 500, result);
}
