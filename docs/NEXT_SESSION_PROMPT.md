Use this prompt in the next session:

---

You are continuing work in `/Users/jacob/DentAI-Assist`.

Read:
- `docs/VOICE_DEMO_EXECUTION_PLAN.md`
- `docs/CHAT_PEARL_TODO.md`

Current state:
1. Chat Pearl demo is implemented on `/pro`.
2. Demo visibility is admin-only via Clerk metadata role (`publicMetadata.role === "admin"`) with `ADMIN_EMAIL` fallback.
3. Pricing/payment section remains visible on `/pro`.
4. Live captions are in-memory only (no local persistence).
5. Three manual tabbed variants exist:
   - Premium Medical Clean
   - Futuristic AI Orb
   - Warm Dental Friendly

Primary next-session objective:
- Run remaining TODO validation checks and complete follow-up enhancements from backlog (if requested).

Execution instructions:
1. Do not regress `/voice` route behavior.
2. Keep `@vapi-ai/web` as frontend runtime SDK.
3. Use `@vapi-ai/server-sdk` only for explicit server orchestration tasks.
4. Validate with:
   - `npm run build`
5. Update:
   - `docs/DEMO_RUNBOOK.md`
   - `docs/CHAT_PEARL_TODO.md`
6. Commit and push with a clear change summary.

---
