# Security and Key Rotation Checklist

## Why this matters
This project uses third-party keys (Clerk, Vapi, Neon, Resend). Keys can leak via screenshots, chats, terminal history, or accidental commits.

## Rotate now (recommended after demos)
1. Clerk:
   - Regenerate publishable/secret keys in Clerk dashboard.
2. Resend:
   - Revoke and create a new API key.
3. Vapi:
   - Revoke and reissue API key.
4. Neon:
   - Rotate database password/connection string.

## After rotating keys
1. Update `.env.local` with new values.
2. Restart app: `npm run dev`.
3. Run a smoke check:
   - sign in,
   - load appointments,
   - create a test appointment,
   - confirm voice widget initializes,
   - confirm email route returns success.

## Guardrails
1. Never commit `.env.local` or any secret file.
2. Keep `.env.example` as template only.
3. Use `DEMO_MODE=true` when running demos where email delivery reliability is more important than real sends.
