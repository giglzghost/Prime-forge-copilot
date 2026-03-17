
# Prime Forge Copilot

Restored original Prime Forge V3 intent using newer AI logic, with a modular, auditable architecture:

- **Core**: autonomy, policy, memory, swarm, funding, authorization
- **Chat**: context, engine, memory, Elaira integration
- **Modes**: safe, extended, creative, autonomous
- **API**: chat, avatar, image, memory, modes, plan, run-task, status, auth
- **UI**: static HTML status/diagnostics pages + Next.js dashboard

## Project Structure

- `.github/workflows/` – CI workflow
- `api/` – language demos (`hello-js`, `hello-py`, `hello-ts`)
- `app/` – Next.js app router (layout, landing, dashboard)
- `src/`
  - `ai/` – provider abstraction
  - `api/` – TypeScript API routes
  - `chat/` – chat engine, context, memory, Elaira chat
  - `core/` – autonomy, policy, router, memory, swarm, funding, authorization
  - `data/` – identity core, swarm config
  - `elaira/` – Elaira identity, interface, state
  - `modes/` – modeA_safe, modeB_extended, modeC_creative, modeD_autonomous
  - `utils/` – edit-guard, notifier
  - `index.ts` – main server entry

Top‑level HTML:

- `index.html` – landing
- `status.html` – system status
- `diagnostics.html` – diagnostics
- `404.html` – fallback

## Scripts

```jsonc
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "vercel-build": "tsc"
}
