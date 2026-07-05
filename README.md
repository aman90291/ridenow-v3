# ridenow-v3

Scaffold the RideNow v3 service repository from scratch.

**Stack:** TypeScript (strict mode, Node 20 LTS) · NestJS (backend API + WebSocket gateway) with Next.js for the driver web app (a matching rider app is planned but not yet scaffolded), in one pnpm/Turborepo workspace · PostgreSQL 16 + PostGIS, accessed via Drizzle ORM.

## Workspace layout

```
ridenow-v3/
├── apps/
│   ├── api/        NestJS backend — GET /healthz, Drizzle + PostGIS wiring
│   ├── rider/      Next.js rider web app   (port 3000, planned — not in this PR)
│   └── driver/     Next.js driver web app  (port 3002)
├── docker-compose.yml   Postgres 16 + PostGIS (postgis/postgis:16-3.4)
├── turbo.json           Turborepo task graph
├── pnpm-workspace.yaml  Workspace globs
├── tsconfig.base.json   Shared strict TypeScript config
└── .github/workflows/ci.yml   install · lint · typecheck · test · build
```

The `api` runs on port 3001; `driver` on 3002. The `rider` app (port 3000) is planned but not yet part of this scaffold.

## Quickstart

```bash
# Node 20 LTS (see .nvmrc) + pnpm 9
cp .env.example .env
pnpm install          # resolves deps and writes the committed pnpm-lock.yaml
pnpm db:up            # Postgres 16 + PostGIS on localhost:5432
pnpm dev              # api + driver together (Turborepo; rider added later)
```

## Health check

The backend exposes a liveness probe used by CI, Docker, and uptime checks:

```bash
curl -s http://localhost:3001/healthz
# {"status":"ok","service":"ridenow-api","uptimeSeconds":3,"timestamp":"..."}
```

## Scripts (run from the repo root)

| Command            | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Run api + driver in watch mode via Turbo          |
| `pnpm build`       | Build every package                               |
| `pnpm lint`        | Lint every package                                |
| `pnpm typecheck`   | `tsc --noEmit` across every package               |
| `pnpm test`        | Run tests (api health suite)                      |
| `pnpm db:up` / `db:down` | Start / stop the Postgres + PostGIS container |

Inside `apps/api`, `pnpm db:generate` / `pnpm db:migrate` drive Drizzle Kit
against `drizzle.config.ts`.

Scaffolded by DevAgent for SCRUM-212.
