# agent.md

## Purpose

This file is the project handbook for the AI/agent and new contributors. It captures architecture, conventions, and workflows so changes stay consistent. No secrets.

## Tech stack

- React 18+
- TypeScript
- Vite
- TailwindCSS (v4+)
- Zustand
- React Router DOM (v7+)

## Common commands

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`
- Typecheck (if present): `npm run typecheck`
- Tests (if present): `npm test`

## Entry points and constraints

- Entry file MUST be: `src/main.tsx`
- Do NOT create/use: `src/index.tsx`
- Do not assume CRA defaults.

## Recommended folder structure

Feature-based + shared:

- `src/pages/`: route-level pages (composition only)
- `src/routes/`: routing (`AppRoutes.tsx`, `ProtectedRoute.tsx`)
- `src/features/<feature>/`: domain/feature modules
  - `components/`, `hooks/`, `services/`, `types.ts`
- `src/components/`: shared components
  - `common/`: common building blocks
  - `ui/`: UI primitives (Button, Input, Modal, etc.)
- `src/services/`: shared API infrastructure (`httpClient.ts`, `api.ts`)
- `src/styles/`: CSS entrypoints (Tailwind + app styles)
- `src/utils/`, `src/hooks/`, `src/context/`: shared utilities

Principles:

- Pages are thin; business logic lives in hooks/stores/services.
- Avoid “god” modules; split by responsibility.

## TailwindCSS v4 + Vite

This project uses the Tailwind v4 Vite workflow:

- Use the Vite plugin: `@tailwindcss/vite`
- CSS entry uses: `@import "tailwindcss";` (do not default to Tailwind v3 `@tailwind base/components/utilities`)
  Reference: https://tailwindcss.com/docs/installation/using-vite

Style files convention:

- `src/styles/tailwind.css`: contains `@import "tailwindcss";`
- `src/styles/index.css`: imports app styles and `./tailwind.css`
- `src/main.tsx` imports `./styles/index.css`

## React conventions

- Function components + hooks only.
- No side effects during render.
- `useEffect` is for syncing with external systems (fetch/subscriptions/imperative APIs), not for long business logic.
- Extract components/hooks when files get large or responsibilities mix.

## React Router conventions

- Define routes in `src/routes/AppRoutes.tsx`.
- Auth gating lives in `src/routes/ProtectedRoute.tsx`.
- `src/pages/*` should be route-level composition (no heavy logic).

## Zustand conventions

Use Zustand for shared state; keep local UI state in components when possible.

- Organize stores by feature/domain (avoid one mega-store).
- In components, select the smallest slice (avoid whole-store subscription).
- Avoid storing derived state when it can be computed.
- For async actions, use typed status (`idle | loading | success | error`) and typed errors when UI needs them.

## Services / API conventions

- Put all I/O (fetch, localStorage, etc.) behind services (`src/services/**` or `src/features/**/services/**`).
- UI should not embed endpoint details; call services or store actions.
- Consistent error handling; do not leak sensitive info.
- Never log tokens/PII.

## TypeScript conventions

- No `any`. Use `unknown` + type guards when needed.
- Avoid unsafe `as SomeType` unless justified with runtime checks.
- Type boundaries clearly (services, public hooks, stores).
- Prefer discriminated unions for complex UI state.

## Lint / formatting

- Do not disable ESLint rules without a strong reason.
- If disabling is unavoidable:
  - smallest possible scope
  - add a comment explaining why.
- Keep imports clean (no unused, follow repo ordering).

## Testing (if present)

- Bug fixes should add regression tests when feasible.
- Features should include at least: happy path + one meaningful failure case.
- Prefer behavior tests over implementation details.

## Security & privacy

- Never commit real secrets. Use env vars and `.env.example` (no real values).
- Do not output or log tokens/PII.
- Redact sensitive values with `[REDACTED]`.
