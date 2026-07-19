# SMS Application

Next.js application for the School Management System.

**Read [`../Brain/README.md`](../Brain/README.md) before writing code.**

## Prerequisites

- Node.js LTS (≥20.x)
- npm

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local when database and auth are configured
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Structure

See [`../Brain/03_FOLDER_STRUCTURE.md`](../Brain/03_FOLDER_STRUCTURE.md).

## Scaffold Note

Created manually to match `create-next-app` defaults (Next.js 15, TypeScript, Tailwind, App Router) because the `Project/` folder name blocks npm package naming in `create-next-app`.
