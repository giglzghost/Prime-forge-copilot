const express = require("express");
const path = require("path");

const app = express();

// Parse JSON bodies
app.use(express.json());

// API routes
app.use("/api/status", require("./api/status").default);
app.use("/api/chat", require("./api/chat").default);
app.use("/api/llm", require("./api/llm").default);
app.use("/api/image", require("./api/image").default);
app.use("/api/multi", require("./api/multi").default);

// Optional: serve static frontend if you add one later
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Prime Forge server running on port", port);
});
