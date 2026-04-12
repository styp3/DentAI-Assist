# Voice Demo Execution Plan (Implemented Baseline)

## Goal
Deliver a premium interactive **Chat Pearl** demo on `/chat-pearl` for dentist client walkthroughs, with `/pro` as the access-control and launch surface while preserving pricing/payment there.

## Locked Decisions
- Access:
  - Signed-in users can access `/pro`.
  - Signed-in users can open `/chat-pearl` only if they are:
    - admins always,
    - selected tester emails when tester access toggle is enabled by admin.
  - Admin check priority:
    1. `user.publicMetadata.role === "admin"`
    2. Fallback exact match to `ADMIN_EMAIL`
- Demo styles:
  - Premium Medical Clean
  - Futuristic AI Orb
  - Warm Dental Friendly
- Switching:
  - Manual tab switch only (no auto-rotate)
- Transcript policy:
  - Live captions shown in UI
  - No local transcript persistence
  - Vapi-side transcript storage remains source of truth
- Fallback mode:
  - Provide text chat fallback when mic permission is denied.

## Integration Strategy
- Runtime voice layer:
  - Use existing `@vapi-ai/web` client (`src/lib/vapi.ts`)
  - This aligns with `VapiAI/client-sdk-web` usage
- UI inspiration:
  - Leverage interaction/state patterns inspired by `VapiBlocks`
- Server SDK posture:
  - `VapiAI/server-sdk-typescript` is reserved for future server-only orchestration tasks (not required for current UI demo runtime)

## Implemented Architecture
- Route integration:
  - `src/app/pro/page.tsx`
  - Adds Chat Pearl launch section above pricing for eligible users.
  - Adds admin access panel to manage tester toggle + allowlist.
  - `src/app/chat-pearl/page.tsx`
  - Enforces server-side access gate and renders dedicated full-page Chat Pearl stage.
- Access config persistence:
  - `AppSetting` table in Prisma (`app_settings`)
  - Settings keys:
    - `chatPearlTesterAccessEnabled`
    - `chatPearlTesterAllowlist`
  - Admin API:
    - `GET/POST /api/chat-pearl-access`
- New modular component system:
  - `src/components/voice-demo/VoiceDemoShell.tsx`
  - `src/components/voice-demo/VoiceDemoAdminAccessPanel.tsx`
  - `src/components/voice-demo/VoiceDemoVariantSelector.tsx`
  - `src/components/voice-demo/VoiceDemoStatus.tsx`
  - `src/components/voice-demo/VoiceDemoControls.tsx`
  - `src/components/voice-demo/VoiceDemoCaptions.tsx`
  - `src/components/voice-demo/VoiceDemoFallbackChat.tsx`
  - `src/components/voice-demo/VoiceDemoSessionSummary.tsx`
  - `src/components/voice-demo/variants/*`
- Session hook:
  - `src/hooks/use-voice-demo-session.ts`
  - Handles Vapi events:
    - `call-start`, `call-end`
    - `speech-start`, `speech-end`
    - `volume-level`
    - `message` (partial/final transcript flow)
    - `error`
- Styling + motion:
  - Added dedicated voice visual classes and reduced-motion behavior in `src/app/globals.css`

## Acceptance Checklist
- Admin sees Chat Pearl launch card on `/pro` and can open `/chat-pearl`
- Selected tester emails can access `/chat-pearl` when admin enables toggle
- Non-selected non-admin users cannot access `/chat-pearl`
- Pricing/payment section remains visible on `/pro`
- Start/end call works
- Mute toggle works
- Live captions update during calls
- Text fallback chat appears for mic-permission denial and manual fallback toggle
- No transcript DB writes introduced
- `npm run build` passes

## Follow-up Backlog
- Optional server-side orchestration endpoints with `@vapi-ai/server-sdk`
