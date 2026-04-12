# Signature Polish Pass — Chat Pearl + Premium Surfaces

## Changelog
- Chat Pearl header was simplified to stop overlap and improve scanning at normal desktop widths.
- The top bar now separates orientation from utility actions, with a lighter mode-switch row beneath it.
- Mode pills were reduced from descriptive cards to cleaner labels so the header feels less dense.
- The stage polish still preserves the darker, black-first look and the updated CircleWaveform, Siri, and Glob motion language.
- Build verification passed after the layout and hierarchy updates.

## Remaining Notes
- No new backend, auth, or data-model work was needed.
- If you want the rest of the app to adopt this cleaner top-bar treatment later, that should be a separate pass.

## Mandatory Skill Stack
Use and apply together:
- using-superpowers
- top-design
- frontend-design
- ux-heuristics
- microinteractions
- refactoring-ui
- web-typography

## Mandatory External Reference
Review and align to:
- https://github.com/cameronking4/VapiBlocks
- Focus on CircleWaveform, Siri, Glob behavior patterns.

## Objectives
1. Make background near-solid shadcn-black.
2. Tone down bloom/color spill around interactive components.
3. Keep core Vapi visuals vibrant so they pop more.
4. Add polished per-mode idle/loading animations (alive + reactive).
5. Push micro-interactions from premium to signature:
   - timing curves
   - hover physics
   - transition choreography
   - state handoffs

## Constraints
- No backend/auth/data-model changes unless blocker.
- Preserve call lifecycle behavior.
- Preserve transcript robustness and role distinction:
  - You
  - Pearl
  - System
- Preserve reduced-motion support.
- No clipping/overflow desktop/mobile.

## Execution Checklist
1. Audit bloom sources (global premium background + stage glow + per-mode overlays). [done]
2. Implement black-first token rebalance. [done]
3. Reduce ambient bloom globally and per mode. [done]
4. Add/refine mode-specific idle/loading animations. [done]
5. Standardize motion timings and interaction physics. [done]
6. Validate mode switching across idle/connecting/active. [done]
7. Verify transcript readability/behavior. [done]
8. Run `npm run build` before completion. [done]

## Acceptance Criteria
- Stage surroundings are darker and less colorful.
- Vapi components appear more prominent and cleaner.
- Animations are polished, non-buggy, and responsive.
- Build passes and key routes work (`/chat-pearl`, `/dashboard`, `/appointments`, `/admin`).
