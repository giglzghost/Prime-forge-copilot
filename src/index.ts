import express from "express";
import path from "path";
import { spawn } from "child_process";

const app = express();
const root = path.join(__dirname, "..");

// Serve static HTML and other public files
app.use(express.static(root));

// Root route (public-facing)
app.get("/", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

// Diagnostics route (programmatic)
app.get("/diagnostics", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    runtime: process.version,
    platform: process.platform
  });
});

// Python integration example
app.get("/py", (req, res) => {
  const py = spawn("python3", ["src/ai/engine.py"]);
  let output = "";

  py.stdout.on("data", data => output += data.toString());
  py.on("close", () => res.send(output));
});

// Java integration example
app.get("/java", (req, res) => {
  const j = spawn("java", ["-cp", "src/java", "AI7Core"]);
  let output = "";

  j.stdout.on("data", data => output += data.toString());
  j.on("close", () => res.send(output));
});

app.listen(process.env.PORT
