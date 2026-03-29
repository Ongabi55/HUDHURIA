# Hudhuria — Campus Event Booking & Management

A mobile-first platform for university students and organizers in Kenya to discover, book, and manage campus events.

---

## Quick overview

- Backend: Node + Express + Prisma (Postgres/SQLite during development). Located at `apps/backend`.
- Mobile: Expo (React Native) app in `apps/mobile` (legacy, may be broken in this repo).
- New Web: Next.js app scaffold in `hudhuria-web` (Next + Prisma + NextAuth). This is the target for migration.
- Shared types/validators: `packages/shared`.

---

## How to run the project (step-by-step, macOS / zsh)

This repo is a monorepo. Use the steps below depending on which app you want to run.

Prerequisites
- Node 20+ (use nvm or Volta)
- Yarn 4+ (for workspace installs) and/or npm
- PostgreSQL 15+ or a Supabase project for the Next.js migration
- Xcode command line tools (for native module builds): `xcode-select --install`

A. Run the existing backend (apps/backend)

1. Install dependencies from repo root (yarn workspaces):
   cd /Users/markmunuhe/Desktop/Hudhuria2
   yarn install

2. Configure environment for backend:
   cd apps/backend
   cp .env.example .env
   # Edit .env — set DATABASE_URL and generate JWT secrets
   # Generate JWT secrets:
   openssl rand -base64 64

3. Migrate & seed the database (from repo root):
   # If backend uses Prisma & you want to run migrations:
   yarn db:migrate
   yarn db:seed
   # If you prefer Prisma Studio:
   yarn db:studio

4. Start backend (from repo root):
   yarn backend
   # Backend will run by default on http://localhost:3000

Notes / Troubleshooting (backend):
- If you see native module errors for bcrypt, run:
  cd apps/backend && npm rebuild bcrypt --update-binary || npm rebuild
  or install `bcryptjs` and update seed/helpers to use the pure-JS implementation.
- If Prisma complains about the datasource url in the schema or Prisma version, run:
  npx prisma generate --schema=./apps/backend/prisma/schema.prisma

B. Run the Expo mobile app (apps/mobile)

1. From the mobile folder install deps (this repo uses Yarn workspaces but you can install within mobile):
   cd /Users/markmunuhe/Desktop/Hudhuria2/apps/mobile
   yarn install

2. Ensure web deps present (for web build):
   yarn add react-dom react-native-web

3. Start Expo (recommended for debugging without minify):
   yarn web
   # or
   npx expo start --web

4. If `npx` is slow, install Expo CLI globally once:
   npm install -g expo-cli

Common issues (Expo web hangs):
- Yarn PnP / hoisting can cause resolution problems for react-dom/react-native-web — add them to the mobile workspace or switch yarn to node-modules linker by adding `.yarnrc.yml` with:
  nodeLinker: "node-modules"
  then run `yarn install` again.
- Avoid running `--no-dev --minify` while debugging — use the plain `expo start --web` first and inspect terminal/browser console for errors.

C. Run the new Next.js app (hudhuria-web)

1. Create `.env.local` in `hudhuria-web` with values (example created for you at `hudhuria-web/.env.local`):
   - DATABASE_URL (Postgres / Supabase connection string)
   - NEXTAUTH_SECRET (32-byte hex): `openssl rand -hex 32`
   - NEXTAUTH_URL=http://localhost:3000

2. From the hudhuria-web folder install dependencies (use npm for this project):
   cd /Users/markmunuhe/Desktop/Hudhuria2/hudhuria-web
   npm install --legacy-peer-deps --no-audit --no-fund

3. Generate Prisma Client (only needed before DB usage):
   npx prisma generate --schema=./prisma/schema.prisma

4. Run migrations (first time only):
   npx prisma migrate dev --schema=./prisma/schema.prisma --name init

5. Start dev server:
   npm run dev
   # App will be available at http://localhost:3000

Notes / Troubleshooting (hudhuria-web):
- If `npm install` hangs or errors with ETARGET, check the registry and network:
  npm config get registry
  # should be https://registry.npmjs.org/
  npm cache clean --force
- If `bcrypt` raises native build errors, either install Xcode CLI tools or switch code to `bcryptjs` (pure JS). The repo contains a lazy Prisma loader so the dev server can run even before `prisma generate` completes — but DB calls will error until the client exists.

---

## Helpful commands summary

From repo root:
- yarn install                # install all workspaces
- yarn backend                # start backend server
- yarn db:migrate             # run prisma migrations for backend
- yarn db:seed                # seed backend database

Mobile (apps/mobile):
- cd apps/mobile
- yarn web                    # start Expo web

New web app (hudhuria-web):
- cd hudhuria-web
- npm install --legacy-peer-deps --no-audit --no-fund
- npx prisma generate --schema=./prisma/schema.prisma
- npm run dev

---

If you hit specific errors during any step, copy the first 150 lines of the terminal output and paste them here — I will diagnose the exact failing step and fix it. Keep the output short (first error block) and I’ll respond with a one-action fix.

---

## Test Accounts

All accounts use the password: `Password123!`

| Role | Email |
|---|---|
| Admin | admin@hudhuria.co.ke |
| Organizer | brian@uon.ac.ke |
| Organizer | cynthia@strathmore.edu |
| Student | david@student.uon.ac.ke |
| Student | esther@student.strathmore.edu |
| Student (streak: 12) | hassan@student.strathmore.edu |

---

## If you want me to run these steps for you

Tell me which folder to run in (e.g. `hudhuria-web`) and whether I should:
- run `npm install` only, or
- run `npm install` + `npx prisma generate` + `npm run dev` (I can stream logs)

I will run one chosen flow and fix the first blocking error automatically.
