import http from "http";
import url from "url";
import chatHandler from "../api/chat";
import llmHandler from "../api/llm";
import multiHandler from "../api/multi";
import imageHandler from "../api/image";
import statusHandler from "../api/status";

const PORT = process.env.PORT || 3000;

function createServer() {
  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url || "/", true);
    const path = parsed.pathname || "/";

    if (path === "/api/chat") return chatHandler(req as any, res as any);
    if (path === "/api/llm") return llmHandler(req as any, res as any);
    if (path === "/api/multi") return multiHandler(req as any, res as any);
    if (path === "/api/image") return imageHandler(req as any, res as any);
    if (path === "/api/status") return statusHandler(req as any, res as any);

    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return server;
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Prime Forge server running on port ${PORT}`);
  });
}

export default createServer;
