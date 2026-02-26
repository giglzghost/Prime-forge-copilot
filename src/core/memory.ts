import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");
const MEMORY_FILE = path.join(DATA_DIR, "memory.jsonl");

export interface MemoryEntry {
  timestamp: string;
  type: "mission" | "plan" | "observation" | "outcome" | "feedback" | string;
  payload: any;
}

export function ensureMemoryFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, "", "utf8");
  }
}

export function appendMemory(entry: MemoryEntry): void {
  ensureMemoryFile();
  const line = JSON.stringify(entry);
  fs.appendFileSync(MEMORY_FILE, line + "\n", "utf8");
}

export function queryMemory(
  filter?: (entry: MemoryEntry) => boolean
): MemoryEntry[] {
  ensureMemoryFile();
  const raw = fs.readFileSync(MEMORY_FILE, "utf8");
  const lines = raw.split("\n").filter(Boolean);
  const entries: MemoryEntry[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      entries.push(parsed);
    } catch {
      // ignore malformed lines, preserve history
    }
  }

  return filter ? entries.filter(filter) : entries;
}
