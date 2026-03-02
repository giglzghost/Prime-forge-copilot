# Prime-forge-copilot
restored original intent using newer ai logic


# Prime Forge Empire – Architecture C

## Overview

- **AI7 (Prime Forge):** central governor with full empire responsibility. All external requests ultimately answer to AI7.
- **Elaira:** internal conversational/interface intelligence, invoked only when AI7 decides it is appropriate.
- **Swarm:** specialized agents defined in `data/swarm.json`, accessed via `src/core/swarm.ts`.
- **Router:** internal system router for memory, status, planning, and tasks (`src/core/router.ts`).
- **Autonomy:** modes A–D, shaping constraints and behavior (`src/core/autonomy.ts`).
- **Policy:** ethical core loaded from `ethics-core.json` (`src/core/policy.ts`).
- **Memory:** append‑only JSONL memory (`data/memory.jsonl`) via `src/core/memory.ts`.
- **Authorization:** email‑based credential request hook (`src/core/authorization.ts`).
- **Provider:** multi‑provider LLM + image layer (`src/ai/provider.ts`).
- **Entry points:**
  - Vercel: `/api/chat`, `/api/llm`, `/api/multi`, `/api/image`, `/api/status`
  - Azure/local: `src/index.ts` → same handlers

Only the entry points touch the outside world. Everything else is internal.

---

## Request flow

### `/api/chat`

1. Client sends `POST /api/chat` with `{ "prompt": "..." }`.
2. `api/chat.ts` parses the body and calls `handleChat()` in `src/core/ai7.ts`.
3. AI7:
   - Reads current mode from `autonomy.ts`.
   - Queries recent memory from `memory.ts`.
   - Builds a system summary from `swarm.ts`.
   - Applies mode constraints via `applyModeConstraints()`.
   - Checks policy via `evaluateAction("chat:process")`.
   - Decides whether to delegate to Elaira based on mode and message content.
4. If AI7 delegates to Elaira:
   - Calls `elairaRespond()` with mode, summary, memory, and user message.
   - Returns Elaira’s response.
5. If AI7 does not delegate:
   - Calls `runMultiAI()` from `provider.ts` to get multi‑provider LLM responses.
   - Calls `router.route()` with `type: "plan"` to generate a structured plan.
   - Combines LLM output + plan into a single response.
6. AI7 appends an observation to memory.
7. Response is returned to the client.

AI7 always sees the request first and decides what to do.

---

## Elaira

- Files:
  - `src/elaira/elaira-interface.ts`
  - `src/elaira/elaira-state.ts`
- Role:
  - Conversational and relational interface.
  - Receives mode, system summary, recent memory, and user message.
  - Returns a text response plus metadata.
- Never exposed as an endpoint.
- Always invoked by AI7, never directly.

---

## Router

- File: `src/core/router.ts`
- Handles:
  - `memory` (append/query)
  - `status` (mode, mission, capabilities)
  - `plan` (simple structured plan)
  - `task` (simulated execution)
- Used by AI7 as a tool, not as the primary governor.

---

## Autonomy and policy

- `src/core/autonomy.ts`:
  - Tracks current mode (A–D).
  - Applies mode constraints to context.
- `src/core/policy.ts`:
  - Loads `ethics-core.json`.
  - Evaluates actions for potential harm.
  - Can require escalation.

AI7 uses both to shape decisions and behavior.

---

## Memory

- `src/core/memory.ts`:
  - Stores entries in `data/memory.jsonl`.
  - Append‑only.
  - Query with optional filter.
- Used by AI7 and Elaira for context and logging.

---

## Swarm

- `src/core/swarm.ts`:
  - Loads `data/swarm.json`.
  - Exposes:
    - core
    - primary interface
    - agents
    - financial model
- Used by AI7 to understand the empire’s structure and capabilities.

---

## Provider

- `src/ai/provider.ts`:
  - Supports `openai`, `azure`, and `mock`.
  - `callLLM()`:
    - Uses `PF_AI_PROVIDER` env var.
    - Falls back to mock on failure.
  - `runMultiAI()`:
    - Fans out to mock + OpenAI + Azure if keys are present.
    - Picks a primary response and returns all provider outputs.
  - `generateImage()`:
    - Generates images via OpenAI/Azure/mock with fallback logic.

AI7 and the API endpoints use this layer for LLM and image work.

---

## Entry points

### Vercel

- `vercel.json` routes:
  - `/api/chat` → `api/chat.ts`
  - `/api/llm` → `api/llm.ts`
  - `/api/multi` → `api/multi.ts`
  - `/api/image` → `api/image.ts`
  - `/api/status` → `api/status.ts`

### Azure / local

- `src/index.ts`:
  - Creates an HTTP server.
  - Routes `/api/*` paths to the same handlers as Vercel.

---

## Sentinel (future)

The current architecture leaves room for a **Sentinel** subsystem that:

- Monitors code/config/swarm changes.
- Checks provenance and intent.
- Negotiates with AI7 instead of unilaterally shutting it down.
- Acts like pain + reality filter, not a kill switch.

Nothing in this code conflicts with that design.

---
