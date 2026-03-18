import http from "http";
import url from "url";
import path from "path";
import fs from "fs";

import chatHandler from "./api/chat";
import llmHandler from "./api/llm";
import multiHandler from "./api/multi";
import imageHandler from "./api/image";
import statusHandler from "./api/status";
import chatStreamHandler from "./api/chat-stream";

const PORT = process.env.PORT || 3000;

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse, pathname: string) {
  const publicDir = path.join(process.cwd(), "public");

  // Normalize path
  let filePath = path.join(publicDir, pathname);

  // If path is a directory, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // If file doesn't exist, return false so server continues
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

function createServer() {
  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url || "/", true);
    const pathname = parsed.pathname || "/";

    // API ROUTES
    if (pathname === "/api/chat") return chatHandler(req as any, res as any);
    if (pathname === "/api/chat-stream") return chatStreamHandler(req as any, res as any);
    if (pathname === "/api/llm") return llmHandler(req as any, res as any);
    if (pathname === "/api/multi") return multiHandler(req as any, res as any);
    if (pathname === "/api/image") return imageHandler(req as any, res as any);
    if (pathname === "/api/status") return statusHandler(req as any, res as any);

    // STATIC ROUTES (fixed)
    if (serveStatic(req, res, pathname)) return;

    // 404 fallback
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return server;
}

const server = createServer();
server.listen(PORT, () => {
  console.log(`Prime Forge server running on port ${PORT}`);
});

export default createServer;
