<h1 align="center">🦷 DentAI Assist</h1>

<p align="center">
  <b>AI-Powered Dental Assistant with Voice Agent, Appointment Booking & Admin Dashboard</b>
</p>

## ✨ Features

- 🏠 **Modern Landing Page** — Gradients, animations & testimonials
- 🔐 **Authentication via Clerk** — Google, GitHub, Email & Password
- 🔑 **Email Verification** — 6-digit code verification
- 📅 **Appointment Booking System** — 3-step booking flow
- 🦷 **3-Step Booking Flow** — Dentist → Service & Time → Confirm
- 📩 **Email Notifications** — Booking confirmations via Resend
- 📊 **Admin Dashboard** — Manage doctors & appointments
- 🗣️ **AI Voice Agent** — Powered by VAPI (Pro Plans only)
- 💎 **Chat Pearl Demo on `/chat-pearl`** — Premium interactive voice showcase with 3 modern styles + live captions (launched from `/pro`)
- 🧰 **Tester Access Controls** — Admin toggle + allowlist for selected non-admin Chat Pearl testers
- 💬 **Mic Fallback Mode** — Text-based fallback chat when browser mic permission is blocked
- 💳 **Subscription Plans** — Free, Basic ($9/mo), Pro ($19/mo) via Clerk Billing
- 📂 **PostgreSQL** — Data persistence via Neon
- 🎨 **Styling** — Tailwind CSS v4 + Shadcn UI
- ⚡ **Data Fetching** — TanStack Query
- 🚀 **Deployment** — Vercel

---

## 📚 Project Docs

- Demo runbook: [`docs/DEMO_RUNBOOK.md`](./docs/DEMO_RUNBOOK.md)
- Demo operator script: [`docs/DEMO_OPERATOR_SCRIPT.md`](./docs/DEMO_OPERATOR_SCRIPT.md)
- Agent implementation guide: [`AGENTS.md`](./AGENTS.md)
- Security/key rotation: [`docs/SECURITY_KEYS.md`](./docs/SECURITY_KEYS.md)
- Deferred tasks: [`docs/TODO.md`](./docs/TODO.md)
- Voice demo implementation plan: [`docs/VOICE_DEMO_EXECUTION_PLAN.md`](./docs/VOICE_DEMO_EXECUTION_PLAN.md)
- Chat Pearl task tracker: [`docs/CHAT_PEARL_TODO.md`](./docs/CHAT_PEARL_TODO.md)
- Next-session handoff prompt: [`docs/NEXT_SESSION_PROMPT.md`](./docs/NEXT_SESSION_PROMPT.md)

---

## 🌐 Live Demo

- Production URL: [https://dentai-assist.vercel.app](https://dentai-assist.vercel.app)
- Inspector (latest deploy): [Vercel deployment details](https://vercel.com/jayashiyan-gmailcoms-projects/dentai-assist/FUhi5YvhxMo83v4HLyxdBZWwPSri)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.1 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Auth | Clerk v7 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma v7 |
| Voice AI | VAPI |
| Email | Resend + React Email |
| Data Fetching | TanStack Query |
| Deployment | Vercel |

---

## 🧪 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL=your_neon_postgres_url

# VAPI Voice AI
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key

# Admin
ADMIN_EMAIL=your_admin_email
# Optional Clerk role metadata gate:
# publicMetadata.role = "admin"

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Demo mode (optional)
DEMO_MODE=false

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Quick start template:

```bash
cp .env.example .env.local
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dentai-assist.git
cd dentai-assist
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup database

```bash
npx prisma generate
npx prisma db push
```

`db push` is required for Chat Pearl access settings storage (`app_settings` table).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Optional demo data reset

```bash
npm run demo:reset -- --yes
```

### 6. Demo account notes

- `ADMIN_EMAIL` must exactly match the sign-in email that should access `/admin`.
- Resend test-mode accounts may only send to allowed recipients.
- For unrestricted sending, verify a domain in Resend and use a sender from that domain.
- If you want stable demos even when email providers are flaky, set `DEMO_MODE=true` to mock successful email sends.
- Run `npm run demo:preflight` before live demos to verify required env keys and DB reachability.
- Run `npm run demo:preflight:routes` (while app is running) for quick route smoke checks.

---

## 📁 Project Structure

```
dentai-assist/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── appointments/      # Booking system
│   │   ├── dashboard/         # User dashboard
│   │   ├── voice/             # AI voice agent
│   │   ├── pro/               # Pricing + Chat Pearl access control hub
│   │   ├── chat-pearl/        # Dedicated Chat Pearl full-page demo
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   ├── appointments/      # Booking components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── emails/            # Email templates
│   │   ├── landing/           # Landing page sections
│   │   ├── voice/             # Voice agent components
│   │   ├── voice-demo/        # Shared Chat Pearl demo components
│   │   └── ui/                # Shadcn UI components
│   ├── hooks/                 # TanStack Query hooks
│   ├── lib/
│   │   ├── actions/           # Server actions
│   │   ├── prisma.ts          # Prisma client
│   │   ├── vapi.ts            # VAPI client
│   │   ├── resend.ts          # Resend client
│   │   └── utils.ts           # Utility functions
│   └── generated/             # Prisma generated client
├── public/                    # Static assets
├── prisma.config.ts           # Prisma v7 config
└── next.config.ts             # Next.js config
```

---

## 🎯 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | User dashboard |
| `/appointments` | Book appointments |
| `/voice` | AI voice agent (Pro only) |
| `/pro` | Pricing + Chat Pearl access control hub |
| `/chat-pearl` | Dedicated Chat Pearl premium voice demo |
| `/admin` | Admin dashboard |

---

## 👨‍💻 Author

**Abhishek Kumar**

- Portfolio: [Portfolio](<https://dev-portfolio-sooty-rho.vercel.app>)
- GitHub: [@abhishekkumar](https://github.com/abhishekKumar253)
- LinkedIn: [Abhishek Kumar](www.linkedin.com/in/abhishek-kumar-a391a422a)

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built with ❤️ for the dental care industry</p>
