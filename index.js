import express from "express";
import path from "path";

const app = express();
app.use(express.json());

// API routes
app.use("/api/status", require("./api/status").default);
app.use("/api/chat", require("./api/chat").default);
app.use("/api/llm", require("./api/llm").default);
app.use("/api/image", require("./api/image").default);
app.use("/api/multi", require("./api/multi").default);

// Optional static files
app.use(express.static(path.join(__dirname, "public")));

// Port binding for Azure
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Prime Forge server running on port", port);
});
