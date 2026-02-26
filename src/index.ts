import express from "express";
import path from "path";
import { spawn } from "child_process";

const app = express();
const root = path.join(__dirname, "..");

// Serve static HTML and public files
app.use(express.static(root));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

// Diagnostics route
app.get("/diagnostics", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    runtime: process.version,
    platform: process.platform,
    environment: process.env.VERCEL ? "vercel" : "azure"
  });
});

// Python example
app.get("/py", (req, res) => {
  const py = spawn("python3", ["src/ai/engine.py"]);
  let output = "";

  py.stdout.on("data", data => output += data.toString());
  py.on("close", () => res.send(output));
});

// Java example
app.get("/java", (req, res) => {
  const j = spawn("java", ["-cp", "src/java", "AI7Core"]);
  let output = "";

  j.stdout.on("data", data => output += data.toString());
  j.on("close", () => res.send(output));
});

// --- Unified runtime logic ---
// Vercel: export the app (no listen)
// Azure: run the server normally
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Prime Forge Copilot running on port ${port}`);
  });
}

export default app;  const j = spawn("java", ["-cp", "src/java", "AI7Core"]);
  let output = "";

  j.stdout.on("data", data => output += data.toString());
  j.on("close", () => res.send(output));
});

app.listen(process.env.PORT
