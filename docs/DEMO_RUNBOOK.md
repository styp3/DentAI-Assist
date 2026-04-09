# DentAI Assist Demo Runbook

## Goal
Run a stable, interactive product demo for dentist clients with:
- appointment booking,
- admin dashboard,
- Chat Pearl voice demo on `/pro`,
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
5. Chat Pearl demo (`/pro`):
   - Show admin-only interactive voice panel.
   - In admin access panel, enable tester access and add selected tester emails if needed.
   - Switch between 3 styles using tabs.
   - Start call and demonstrate live captions.
   - Show mute/caption controls and session summary.
   - If mic permission is blocked, use the text fallback mode.
   - Confirm pricing/payment section remains visible below.

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

## Post-Demo Reset (Optional)
- Run `npm run demo:reset -- --yes` to remove demo appointments and restore baseline doctor state.
