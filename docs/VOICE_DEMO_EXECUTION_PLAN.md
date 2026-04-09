# Voice Demo Execution Plan (Implemented Baseline)

## Goal
Deliver a premium interactive **Chat Pearl** demo on `/pro` for dentist client walkthroughs, while preserving the existing pricing/payment section.

## Locked Decisions
- Access:
  - Signed-in users can access `/pro`.
  - Demo widget itself is **admin-only**.
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
  - Adds admin-only Chat Pearl section above pricing
- New modular component system:
  - `src/components/voice-demo/VoiceDemoShell.tsx`
  - `src/components/voice-demo/VoiceDemoVariantSelector.tsx`
  - `src/components/voice-demo/VoiceDemoStatus.tsx`
  - `src/components/voice-demo/VoiceDemoControls.tsx`
  - `src/components/voice-demo/VoiceDemoCaptions.tsx`
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
- Admin sees Chat Pearl on `/pro`
- Non-admin signed-in users do not see Chat Pearl widget
- Pricing/payment section remains visible on `/pro`
- Start/end call works
- Mute toggle works
- Live captions update during calls
- No transcript DB writes introduced
- `npm run build` passes

## Follow-up Backlog
- Optional fallback text mode when mic permissions are denied
- Optional admin control to grant demo access to selected testers
- Optional server-side orchestration endpoints with `@vapi-ai/server-sdk`

