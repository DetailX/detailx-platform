# DetailVault Platform — Claude Guidelines

## Project Overview
DetailVault is a marketplace platform where architecture firms submit building construction details (paid via seed funding) and other companies browse and purchase access to those details. The core UX: users see a photo of the building area where a detail applies, and must pay to unlock the full technical drawings/specs.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Database**: Drizzle ORM + Turso (remote libsql/SQLite)
- **Auth**: Auth.js v5 (next-auth) with Credentials provider, JWT sessions
- **Storage**: AWS S3 (presigned URLs), with `MOCK_S3=true` for local dev
- **Payments**: Mock checkout flow (no real Stripe yet)

## Decision Authority
- **Claude decides**: All technical decisions — architecture, libraries, implementation patterns, database schema changes, API design, code structure, performance, security
- **User decides**: Product features, design/visual choices, user-facing copy, business logic, pricing, and anything that changes what the user sees or how the product behaves

## Workflow Rules

### Planning
- **Medium/large features**: Always create a plan first and get user approval before coding
- **Small changes** (bug fixes, copy changes, minor tweaks): Skip planning, just do it

### Testing and Deployment
- After making changes, tell the user to test locally with `npm run dev`
- Wait for the user to confirm everything looks good
- Only then commit and push to `origin main`
- Never push without user confirmation

### Communication Style
- The user is not technical — never assume knowledge of programming concepts
- When asking for input, explain the situation in plain language with enough context
- Instead of "Should we use SSR or CSR?", say "Should this page load all its content immediately (faster for search engines) or load some parts after the page appears (faster first load)?"
- Provide visual/behavioral descriptions, not technical ones
- When presenting options, explain what each one means for the user experience

## Project Structure
```
src/
├── app/              # Pages and API routes (Next.js App Router)
├── components/       # Reusable UI components
│   ├── ui/           # Primitives (button, card, input, modal, badge)
│   ├── layout/       # Header, footer, mobile nav
│   ├── landing/      # Landing page sections
│   ├── library/      # Browse page components
│   ├── detail/       # Detail page + paywall components
│   └── dashboard/    # Dashboard components
├── lib/
│   ├── db/           # Database client, schema, seed
│   ├── auth.ts       # Auth.js configuration
│   ├── s3.ts         # S3 client + helpers
│   └── utils.ts      # Shared utilities
└── types/            # TypeScript types and Zod schemas
```

## Database
- **Remote (Turso)**: Used in production and Vercel deployment
- **Local (SQLite file)**: Used as fallback when `TURSO_DATABASE_URL` is not set
- Migrations live in `drizzle/`, schema in `src/lib/db/schema.ts`
- Run `npm run db:seed` to populate mock data

## Key Commands
- `npm run dev` — Start local dev server
- `npm run build` — Production build
- `npm run db:generate` — Generate migration files after schema changes
- `npm run db:migrate` — Apply migrations
- `npm run db:seed` — Seed database with mock data

## Environment Variables
Stored in `.env.local` (gitignored). Required for deployment:
- `TURSO_DATABASE_URL` — Turso database connection URL
- `TURSO_AUTH_TOKEN` — Turso auth token
- `AUTH_SECRET` — NextAuth.js secret key
- `AUTH_URL` — Base URL of the application
- `MOCK_S3` — Set to "true" to bypass real S3 in development

## Demo Accounts (seeded data)
- **Buyer**: james@buildcorp.com / password123
- **Firm**: sarah@arcstudio.com / password123
