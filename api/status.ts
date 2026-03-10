export const config = {
  runtime: "nodejs"
};

import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_utils";
import { route } from "../src/core/router";

export default async function handler(
  req: IncomingMessage | any,
  res: ServerResponse | any
) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const core = route({
    type: "status",
    action: "get",
    requestedBy: "api:status"
  });

  const now = new Date().toISOString();

  const dashboard = {
    meta: {
      now,
      uptime: core.uptime ?? "unknown",
      version: core.version ?? "v3",
      mode: core.mode ?? "active",
      cycleClock: {
        decisionCycleMs: core.decisionCycleMs ?? 1200,
        lastCycle: core.lastCycle ?? now,
        nextCycleEta: core.nextCycleEta ?? null,
        cycleArc: core.cycleArc ?? 0.0
      },
      matriarchOversight: {
        active: true,
        mode: "sovereign",
        glyph: "✶",
        colorPrimary: "#f7e08a",
        colorAccent: "#3df2ff",
        glowIntensity: 0.85,
        pulseSpeed: 1.15,
        fractalSeed: 777,
        presence: "ambient"
      }
    },

    background: {
      type: "animated-fractal",
      style: "star-forged-nebula",
      parallax: 0.35,
      fractalBloomIntensity: 0.55,
      colorSet: ["#f7e08a", "#3df2ff", "#7b2ff7"],
      panelSeams: true,
      substrateGeometry: "hex-fractal"
    },

    aiGrid: (core.agents ?? []).map((agent: any, index: number) => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      archetype: agent.archetype ?? "PrimeForge Agent",
      status: agent.status,
      load: agent.load,
      tileDepth: agent.tileDepth ?? 2,
      gridPosition: {
        row: Math.floor(index / 3),
        col: index % 3
      },
      avatar: {
        enabled: agent.avatarEnabled ?? true,
        glyph: agent.avatarGlyph ?? "◆",
        style: agent.avatarStyle ?? "hologram",
        colorPrimary: agent.avatarColor ?? "#3df2ff",
        glowIntensity: agent.avatarGlow ?? 0.6,
        fractalSeed: agent.fractalSeed ?? index * 13 + 1
      },
      motion: {
        pulseSpeed: agent.pulseSpeed ?? (1 + agent.load * 0.5),
        shimmer: agent.shimmer ?? 0.4,
        rotation: agent.rotation ?? agent.load * 45
      },
      decisionSignature: {
        lastDecision: agent.lastDecision,
        confidence: agent.confidence,
        path: agent.path ?? [],
        cycleArc: agent.cycleArc ?? 0.0
      },
      metrics: {
        tpm: agent.tpm,
        dpm: agent.dpm,
        memorySize: agent.memorySize,
        errorRate: agent.errorRate
      },
      controls: {
        autonomyModes: agent.autonomyModes ?? [
          "default",
          "cautious",
          "aggressive",
          "matriarch-guided"
        ],
        routingProfiles: agent.routingProfiles ?? [
          "balanced",
          "fast-path",
          "safety-first",
          "matriarch-oracle"
        ],
        avatarThemes: agent.avatarThemes ?? [
          "glyph",
          "portrait",
          "hologram",
          "fractal-light"
        ],
        actions: ["pause", "boost", "isolate", "resetContext", "toggleAvatar"]
      }
    })),

    conduits: {
      enabled: true,
      links: core.conduits ?? [],
      glowColor: "#3df2ff",
      pulseSpeed: 1.2
    },

    panels: {
      memory: {
        ok: core.memoryOk,
        files: core.memoryFiles,
        lastWrite: core.memoryLastWrite,
        size: core.memorySize,
        depthLevel: 1
      },
      router: {
        ok: core.routerOk,
        routes: core.routes,
        lastRoute: core.lastRoute,
        depthLevel: 2
      },
      audit: {
        ok: core.auditOk,
        eventsLastHour: core.eventsLastHour,
        lastEvent: core.lastAuditEvent,
        depthLevel: 1
      }
    },

    timeline: core.timeline ?? [],

    controls: {
      avatarsEnabled: core.avatarsEnabled ?? true,
      animationsEnabled: core.animationsEnabled ?? true,
      liveStreaming: core.liveStreaming ?? true,
      memoryPersistence: core.memoryPersistence ?? true,
      auditLogging: core.auditLogging ?? true
    }
  };

  return sendJson(res, core.ok ? 200 : 500, dashboard);
}
