# DentAI Assist Demo Runbook

## Goal
Run a stable, interactive product demo for dentist clients with:
- appointment booking,
- admin dashboard,
- Chat Pearl voice demo on `/chat-pearl` (launched from `/pro`),
- email confirmation behavior.

## Pre-Demo Checklist (5 minutes)
1. Start app:
   - `npm run dev`
2. Open:
   - `http://localhost:3000`
3. Confirm env values exist in `.env.local`:
   - Clerk keys
   - `DATABASE_URL`
   - Vapi keys
   - `ADMIN_EMAIL`
   - `RESEND_API_KEY`
   - `DEMO_MODE` (recommended `true` for high-stakes demos)
4. Confirm admin login email equals `ADMIN_EMAIL`.
5. If using Clerk role metadata, confirm your user has `publicMetadata.role = "admin"`.
6. Ensure DB schema is current:
   - `npx prisma db push`

## Same-Day Go-Live Quick Check
1. Environment + DB preflight:
   - `npm run demo:preflight`
2. Build verification:
   - `npm run build`
3. Route smoke (signed-out expected behavior, app running):
   - `npm run dev:clean`
   - `npm run demo:preflight:routes`
   - `/` returns 200
   - `/pro` redirects to `/`
   - `/chat-pearl` redirects to `/`
4. Authenticated smoke in browser:
   - Admin can open `/pro` and then `/chat-pearl`
   - Non-admin non-allowlisted user cannot open `/chat-pearl`
   - Allowlisted tester can open `/chat-pearl` when toggle enabled

## Recommended Demo Script
1. Landing page:
   - Show brand, value proposition, and CTA.
2. Auth and dashboard:
   - Sign in and show user dashboard.
3. Appointments flow:
   - Select a dentist profile.
   - Choose date/time and appointment type.
   - Confirm booking.
4. Admin view:
   - Switch to admin account.
   - Show doctors management and appointments visibility.
5. Chat Pearl setup (`/pro`):
   - Show Chat Pearl launch card and admin tester-access panel.
   - If needed, enable tester access and add selected tester emails.
   - Confirm pricing/payment section remains visible below.
6. Chat Pearl live stage (`/chat-pearl`):
   - Open dedicated full-page demo.
   - Switch between 3 modes.
   - Start call and demonstrate live captions.
   - Show mute/caption controls and session summary.
   - If mic permission is blocked, use the text fallback mode.

## Expected Data for Demo
- 3 active demo dentists:
  - Dr. Sarah Johnson
  - Dr. Michael Chen
  - Dr. Emily Rodriguez

## If Something Fails
### Email fails
- Check API error message in terminal.
- If you are mid-demo, set `DEMO_MODE=true` and restart to mock successful sends.
- If error says recipient/domain restriction, this is Resend account policy, not app logic.

### Admin access fails
- Ensure either:
  - `publicMetadata.role` is `"admin"`, or
  - signed-in email exactly equals `ADMIN_EMAIL`.

### Voice widget fails
- Recheck:
  - `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
  - `NEXT_PUBLIC_VAPI_API_KEY`
  - microphone permissions in browser.
  - network access to Vapi.

### Tester access panel fails to save
- Run `npx prisma db push` to ensure `app_settings` table exists.
- Confirm the signed-in user is admin (metadata role or `ADMIN_EMAIL`).
- If `db push` fails with a Neon connectivity error (`P1001`), this is network/database reachability, not UI logic.

## Post-Demo Reset (Optional)
- Run `npm run demo:reset -- --yes` to remove demo appointments and restore baseline doctor state.
