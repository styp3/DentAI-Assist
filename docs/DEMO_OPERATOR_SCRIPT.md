# DentAI Live Demo Operator Script

## T-15 Minutes
1. Run `npm run demo:preflight`.
2. Run `npx prisma db push`.
3. Start app with `npm run dev:clean`.
4. In a second terminal, run `npm run demo:preflight:routes`.

## T-5 Minutes
1. Sign in as admin account (`ADMIN_EMAIL` or Clerk `publicMetadata.role=admin`).
2. Open `/pro` and confirm:
   - Chat Pearl launch card is visible.
   - Admin tester-access panel is visible.
   - Pricing section is visible.
3. Open `/chat-pearl` and test one short call.
4. Confirm captions appear, mute works, and call ends cleanly.

## Live Narration Flow (5-8 Minutes)
1. `Landing` (`/`)
   - "This is the patient-facing AI dental assistant experience."
2. `Dashboard` (`/dashboard`)
   - "After sign-in, patients land in a guided dashboard."
3. `Appointments` (`/appointments`)
   - "Patients select a dentist, choose time/type, and confirm quickly."
4. `Admin` (`/admin`)
   - "Admins manage providers and monitor appointment activity."
5. `Pro Control Hub` (`/pro`)
   - "This is the premium control hub: access policy and pricing stay together."
   - "Admins can allow selected testers without making everyone admin."
6. `Chat Pearl Stage` (`/chat-pearl`)
   - "This is the dedicated premium voice stage."
   - Switch mode: CircleWaveform -> Siri -> Glob.
   - Start call and speak one realistic dental question.
   - Point out live captions and in-memory transcript behavior.
   - Toggle mute, then end call.

## Backup Lines For Common Issues
1. Mic blocked:
   - "Browser permissions blocked microphone access, so we immediately fall back to text guidance for continuity."
2. Resend restriction:
   - "This is a sender-account policy boundary in Resend, not application logic."
3. Temporary voice network issue:
   - "Voice transport is external; the app keeps the demo flow available and we can continue through controls and fallback mode."

## Hard Stop Checklist Before Sharing Screen
1. `npm run build` succeeded.
2. `npm run demo:preflight` succeeded.
3. `npm run demo:preflight:routes` succeeded while app running.
4. `/pro` and `/chat-pearl` verified in browser as admin.
