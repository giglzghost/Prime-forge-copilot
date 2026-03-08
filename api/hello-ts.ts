export const config = {
  runtime: "nodejs"
};

import { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_utils";

export default function handler(req, res) {
  return sendJson(res, 200, {
    language: "TypeScript",
    message: "TS serverless function OK",
    time: new Date().toISOString()
  });
}
