# Chat Pearl TODO Tracker

Use this checklist during implementation/maintenance of the `/pro` voice demo.

## Core Delivery
- [x] Add admin-only demo section to `/pro` while keeping pricing/payment visible.
- [x] Gate access by Clerk `publicMetadata.role === "admin"` with `ADMIN_EMAIL` fallback.
- [x] Build modular voice demo components under `src/components/voice-demo/`.
- [x] Add three manual-switch variants (no auto-rotation):
  - [x] Premium Medical Clean
  - [x] Futuristic AI Orb
  - [x] Warm Dental Friendly
- [x] Add live captions panel with partial-to-final transcript handling.
- [x] Keep transcripts in-memory only (no local DB persistence).
- [x] Use `NEXT_PUBLIC_VAPI_ASSISTANT_ID` and existing `@vapi-ai/web` runtime.

## UX / Quality
- [x] Add voice feedback effects for speaking/listening states.
- [x] Add reduced-motion support for animation-heavy elements.
- [x] Ensure touch-friendly controls and keyboard-accessible tabs.
- [x] Add session summary card for demo wrap-up.

## Validation
- [ ] Run local manual smoke test on `/pro` as admin and non-admin users.
- [ ] Validate tester access toggle + allowlist behavior.
- [ ] Validate mic-denied scenario triggers fallback text chat.
- [ ] Validate on mobile viewport and desktop viewport.
- [x] Run `npm run build`.

## Future Enhancements (Backlog)
- [ ] Add server-side admin tooling with `@vapi-ai/server-sdk` (assistant/call orchestration only).
