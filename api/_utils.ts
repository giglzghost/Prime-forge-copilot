export const config = {
  runtime: "nodejs"
};

import { IncomingMessage, ServerResponse } from "http";

export async function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function sendJson(res: ServerResponse | any, status: number, payload: any) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(status).json(payload);
  }
  res.statusCode = status;
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "application/json");
  }
  res.end(JSON.stringify(payload));
}
