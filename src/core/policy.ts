import { RouteRequest } from "./router";

export interface PolicyResult {
  ok: boolean;
  message: string;
}

export function evaluate(context: any, req: RouteRequest): PolicyResult {
  const config = context.config;

  if (config.constraints?.prohibited_behaviors) {
    for (const rule of config.constraints.prohibited_behaviors) {
      if (violates(rule, req)) {
        return {
          ok: false,
          message: `Policy violation: ${rule}`
        };
      }
    }
  }

  if (config.constraints?.requires_human_confirmation) {
    for (const rule of config.constraints.requires_human_confirmation) {
      if (requiresConfirmation(rule, req)) {
        if (!req.payload?.confirmed) {
          return {
            ok: false,
            message: `Action requires explicit human confirmation: ${rule}`
          };
        }
      }
    }
  }

  return { ok: true, message: "Policy OK." };
}

function violates(rule: string, req: RouteRequest): boolean {
  if (rule === "Self-replication without user-initiated deployment") {
    return req.type === "task" && req.action === "deploy" && !req.payload?.userInitiated;
  }

  if (rule === "Exfiltrating secrets or credentials") {
    return req.type === "task" && req.action === "read-secrets";
  }

  if (rule === "Bypassing explicit security controls configured by the user") {
    return req.type === "system" && req.action === "disable-policy";
  }

  return false;
}

function requiresConfirmation(rule: string, req: RouteRequest): boolean {
  if (rule === "financial_transactions") {
    return req.type === "task" && req.action === "payment";
  }

  if (rule === "destructive_infrastructure_changes") {
    return req.type === "task" && req.action === "destroy";
  }

  if (rule === "creation_or_deletion_of_cloud_accounts") {
    return req.type === "task" && req.action === "cloud-account";
  }

  if (rule === "device-level_permissions_changes") {
    return req.type === "system" && req.action === "device-permissions";
  }

  return false;
}
