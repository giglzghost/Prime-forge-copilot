import fs from "fs";
import path from "path";
import { applyModeConstraints, getCurrentMode } from "./autonomy";
import * as Policy from "./policy";
import * as Memory from "./memory";

const CORE_PATH = path.resolve(__dirname, "..", "..", "prime_forge_core.json");

export interface RouteRequest {
  type: string;
  action: string;
  payload?: any;
  requestedBy?: string;
}

export interface RouteResponse {
  ok: boolean;
  message: string;
  data?: any;
}

let coreConfig: any = null;

export function loadCoreConfig() {
  if (!coreConfig) {
    const raw = fs.readFileSync(CORE_PATH, "utf8");
    coreConfig = JSON.parse(raw);
  }
  return coreConfig;
}

export function route(req: RouteRequest): RouteResponse {
  const config = loadCoreConfig();

  const context = {
    mode: getCurrentMode(),
    config,
    timestamp: new Date().toISOString(),
    requestedBy: req.requestedBy || "unknown",
    payload: req.payload || {}
  };

  const constrained = applyModeConstraints(context);

  const policyCheck = Policy.evaluate(constrained, req);
  if (!policyCheck.ok) {
    return { ok: false, message: policyCheck.message };
  }

  switch (req.type) {
    case "memory":
      return handleMemory(req);
    case "status":
      return handleStatus(constrained);
    case "plan":
      return handlePlan(req);
    case "task":
      return handleTask(req);
    default:
      return { ok: false, message: `Unknown route type: ${req.type}` };
  }
}

function handleMemory(req: RouteRequest): RouteResponse {
  if (req.action === "append") {
    Memory.appendMemory({
      timestamp: new Date().toISOString(),
      type: req.payload?.type || "observation",
      payload: req.payload?.data || {}
    });
    return { ok: true, message: "Memory appended." };
  }

  if (req.action === "query") {
    const entries = Memory.queryMemory();
    return { ok: true, message: "Memory retrieved.", data: entries };
  }

  return { ok: false, message: `Unknown memory action: ${req.action}` };
}

function handleStatus(context: any): RouteResponse {
  return {
    ok: true,
    message: "System status retrieved.",
    data: {
      mode: context.mode,
      timestamp: context.timestamp,
      capabilities: context.config.capabilities,
      mission: context.config.mission
    }
  };
}

function handlePlan(req: RouteRequest): RouteResponse {
  if (!req.payload?.goal) {
    return { ok: false, message: "Missing goal for planning." };
  }

  const plan = [
    { step: 1, action: "Analyze goal", detail: req.payload.goal },
    { step: 2, action: "Identify resources", detail: "Internal + external tools" },
    { step: 3, action: "Draft multi-step plan", detail: "Structured output" }
  ];

  return {
    ok: true,
    message: "Plan generated.",
    data: plan
  };
}

function handleTask(req: RouteRequest): RouteResponse {
  return {
    ok: true,
    message: "Task execution simulated (real execution in V4).",
    data: {
      task: req.payload?.task || "unknown",
      status: "completed"
    }
  };
}
