import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..", "..");

const ALLOWLIST: string[] = [
  "prime_forge_core.json",
  "src/agent.ts",
  "src/router.ts",
  "src/index.ts",
  "src/memory.ts",
  "src/config.ts"
];

export interface EditRequest {
  filePath: string;
  findText: string;
  replaceText: string;
  justification: string;
}

export interface EditResult {
  ok: boolean;
  message: string;
  oldSnippet?: string;
  newSnippet?: string;
}

function isAllowedPath(relPath: string): boolean {
  const normalized = relPath.replace(/\\/g, "/");
  if (!ALLOWLIST.includes(normalized)) return false;

  const abs = path.join(ROOT, normalized);
  const rel = path.relative(ROOT, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return false;
  return true;
}

export function simulateEdit(req: EditRequest): EditResult {
  if (!isAllowedPath(req.filePath)) {
    return { ok: false, message: "File path not allowed for self-edit." };
  }

  const abs = path.join(ROOT, req.filePath);
  if (!fs.existsSync(abs)) {
    return { ok: false, message: "File does not exist." };
  }

  const content = fs.readFileSync(abs, "utf8");
  const idx = content.indexOf(req.findText);
  if (idx === -1) {
    return { ok: false, message: "findText not found in file." };
  }

  const newContent = content.replace(req.findText, req.replaceText);
  const oldSnippet = content.slice(
    Math.max(0, idx - 80),
    idx + req.findText.length + 80
  );
  const newIdx = newContent.indexOf(req.replaceText);
  const newSnippet = newContent.slice(
    Math.max(0, newIdx - 80),
    newIdx + req.replaceText.length + 80
  );

  return {
    ok: true,
    message: "Simulation successful. Call confirm endpoint to apply.",
    oldSnippet,
    newSnippet
  };
}

export function applyEdit(req: EditRequest): EditResult {
  if (!isAllowedPath(req.filePath)) {
    return { ok: false, message: "File path not allowed for self-edit." };
  }

  const abs = path.join(ROOT, req.filePath);
  if (!fs.existsSync(abs)) {
    return { ok: false, message: "File does not exist." };
  }

  const content = fs.readFileSync(abs, "utf8");
  const idx = content.indexOf(req.findText);
  if (idx === -1) {
    return { ok: false, message: "findText not found in file." };
  }

  const newContent = content.replace(req.findText, req.replaceText);
  fs.writeFileSync(abs, newContent, "utf8");

  return {
    ok: true,
    message: "Edit applied."
  };
}
