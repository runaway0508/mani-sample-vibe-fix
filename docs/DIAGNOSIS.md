# Diagnosis report — "Notes" app (sample)

App: Vite 5 + React 18 + React Router 6, Supabase-style auth and one `notes` table.
Host: Cloudflare Pages. Five problems, found in the order a user hits them.
Each fix is one commit on `fix/five-bugs` so it can be reviewed and reverted on its own.

| # | Symptom the owner saw | Root cause | Fix (commit) | Evidence |
|---|---|---|---|---|
| 1 | Every deploy fails at build | `tsc` error TS2551: code reads `note.createdAt`, the column is `created_at` | rename in `Dashboard.tsx` (`62b2d16`) | [build.log](before/build.log) |
| 2 | Blank white page after deploy | `import.meta.env.SUPABASE_URL` — Vite only exposes `VITE_*` vars, so it is `undefined` and the client throws on load | read `VITE_SUPABASE_URL`, clear error message, `.env.example` (`9d80311`) | [blank-page.txt](before/blank-page.txt) |
| 3 | Sign-in "works" but the page flickers between /login and /dashboard forever | `AuthProvider` resets the session to `null` on every route change; `Protected` redirects to /login before the session reloads, `Login` sends the user back | load the session once, add `loading`, follow `onAuthStateChange` (`0e4acc8`) | [auth-loop.txt](before/auth-loop.txt) |
| 4 | Notes save without error but the list is always empty | RLS enabled on `notes` with an INSERT policy only; with no SELECT policy Postgres returns zero rows, not an error | `0002_notes_select_policy.sql`: owners can read their own rows (`f89f740`) | [rls.txt](before/rls.txt) |
| 5 | Refreshing /dashboard or opening a shared link gives 404 | `public/404.html` makes Cloudflare Pages answer unknown paths with 404 instead of the SPA's `index.html` | delete `public/404.html` (`4911458`) | [routing-404.txt](before/routing-404.txt) |

## Verified after the fix
- `npm run build` passes (tsc + vite).
- https://mani-sample-vibe-fix.pages.dev/dashboard opened directly: redirects once to /login, sign-in lands on the dashboard and stays there.
- A note added on the dashboard is listed, and is still listed after a full page refresh on /dashboard (HTTP 200).

## Not changed (out of scope, noted for the owner)
- The demo uses a local stand-in for the Supabase client (`src/lib/localClient.ts`) so it runs without a project. With real Supabase, run both files in `supabase/migrations/` and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in the host's build settings.
- Secrets: only public values belong in `VITE_*` variables. The service_role key must never reach browser code.
