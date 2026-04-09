# DentAI Assist - Agent Working Guide

## Project Intent
This repository is a demo-ready dental assistant product used to show dentist clients:
- branded landing and onboarding,
- appointment booking with real dentist profiles,
- admin control panel,
- voice-agent experience (Vapi),
- email confirmations (Resend).

Primary success criterion: reliable demos over perfect enterprise hardening.

## Stack and Architecture
- Framework: Next.js 16 (App Router, Turbopack)
- Language: TypeScript
- Auth/Billing: Clerk
- Data: PostgreSQL (Neon) via Prisma + Prisma Neon adapter
- Voice: Vapi Web SDK
- Email: Resend + React Email
- UI/Data: Tailwind v4, Shadcn UI, TanStack Query

Key directories:
- `src/app/*` route-level pages and API routes
- `src/lib/actions/*` server actions for doctors, users, appointments
- `src/components/*` UI by domain (landing, appointments, admin, voice)
- `prisma/schema.prisma` core data model

Chat Pearl access config persistence:
- `AppSetting` model (`app_settings` table) stores:
  - `chatPearlTesterAccessEnabled`
  - `chatPearlTesterAllowlist`

## Critical Runtime Contract
Required env vars in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `DATABASE_URL`
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
- `NEXT_PUBLIC_VAPI_API_KEY`
- `ADMIN_EMAIL`
- `RESEND_API_KEY`
- `DEMO_MODE` (optional, for resilient demos)
- `NEXT_PUBLIC_APP_URL`

Notes:
- `prisma.config.ts` explicitly loads `.env.local`.
- Admin access uses Clerk metadata role first (`publicMetadata.role === "admin"`), with `ADMIN_EMAIL` fallback.
- Resend test mode may only allow specific recipient addresses.

## Core User Flows
1. Public landing (`/`) -> auth via Clerk.
2. Authenticated user -> `/dashboard`.
3. Booking flow at `/appointments`:
   - choose dentist,
   - choose date/time/type,
   - confirm and create appointment row.
4. Confirmation email via `POST /api/send-appointment-email`.
5. Voice demo at `/voice` (gated by Clerk plan check).
6. Admin panel at `/admin` for doctor and appointment management.
7. Admin-only Chat Pearl demo at `/pro`:
   - 3 manual-switch visual styles,
   - live captions during calls,
   - no local transcript persistence.

## Commands
- Install: `npm install`
- Generate Prisma client: `npx prisma generate`
- Sync schema: `npx prisma db push`
- Dev: `npm run dev`
- Build validation: `npm run build`
- Demo reset baseline: `npm run demo:reset -- --yes`
- Lint (currently noisy legacy issues): `npm run lint`

## Agent Rules For This Repo
When editing:
- Preserve demo behavior first; avoid broad refactors unless asked.
- Keep seed dentist demo data stable unless user requests change.
- Do not commit secrets or modify `.env.local` in git-tracked output.
- Prefer small focused patches with clear behavior impact.
- Validate with `npm run build` after meaningful changes.

When diagnosing email issues:
- First verify `RESEND_API_KEY` presence.
- Check whether `DEMO_MODE=true` should bypass outbound sends for demos.
- Then verify account/domain restrictions from Resend response.
- If restricted, explain that this is account-level, not app-code failure.

When diagnosing auth/admin issues:
- Confirm Clerk sign-in works.
- Confirm either `publicMetadata.role === "admin"` or `ADMIN_EMAIL` exact match.
- Confirm redirects and middleware behavior via browser (curl may not represent Clerk browser context).

When working on voice demo features:
- Keep frontend call runtime on `@vapi-ai/web` (already integrated in app).
- Do not introduce transcript storage in local DB unless explicitly requested.
- Keep `/pro` pricing/payment block intact while modifying demo UI.
- Preserve admin access controls API (`/api/chat-pearl-access`) and email allowlist behavior.

## Known Demo Constraints
- Curl-only auth checks can be misleading due to Clerk middleware/browser requirements.
- Resend in free/test mode may block non-allowed recipients.
- Voice feature depends on Clerk plan claims and Vapi config.

## Recommended Next Improvements
- Add a `demo_mode` toggle that bypasses outbound email and returns mocked success in staging demos.
- Add a no-auth health endpoint (`/api/health`) for stable CLI smoke tests.
- Add deterministic seed/reset scripts for instant demo environment restores.
