import http from "http";
import url from "url";
import path from "path";
import fs from "fs";
import next from "next";

import chatHandler from "./api/chat";
import llmHandler from "./api/llm";
import multiHandler from "./api/multi";
import imageHandler from "./api/image";
import statusHandler from "./api/status";
import chatStreamHandler from "./api/chat-stream";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse, pathname: string) {
  const publicDir = path.join(process.cwd(), "public");
  let filePath = path.join(publicDir, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) return false;

  const ext = path.extname(filePath).toLowerCase();
  const type =
    ext === ".html" ? "text/html" :
    ext === ".css" ? "text/css" :
    ext === ".js" ? "application/javascript" :
    ext === ".json" ? "application/json" :
    ext === ".png" ? "image/png" :
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
    "text/plain";

  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

nextApp.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url || "/", true);
    const pathname = parsed.pathname || "/";

    // API ROUTES (preserved exactly)
    if (pathname === "/api/chat") return chatHandler(req as any, res as any);
    if (pathname === "/api/chat-stream") return chatStreamHandler(req as any, res as any);
    if (pathname === "/api/llm") return llmHandler(req as any, res as any);
    if (pathname === "/api/multi") return multiHandler(req as any, res as any);
    if (pathname === "/api/image") return imageHandler(req as any, res as any);
    if (pathname === "/api/status") return statusHandler(req as any, res as any);

    // STATIC FILES
    if (serveStatic(req, res, pathname)) return;

    // EVERYTHING ELSE → NEXT.JS
    return handle(req, res, parsed);
  });

  server.listen(PORT, () => {
    console.log(`Prime Forge hybrid server running on port ${PORT}`);
  });
});
