# mani-sample-vibe-fix

A small Vite + React + Supabase-style notes app that was **broken on purpose** with five problems
we often see in apps built with Lovable, Bolt, Replit, Cursor or Claude Code — then diagnosed,
fixed one commit at a time, and redeployed to Cloudflare Pages.

| | Link |
|---|---|
| After (fixed, `main`) | https://mani-sample-vibe-fix.pages.dev |
| Before (3 bugs still live: auth loop, RLS, 404) | https://before.mani-sample-vibe-fix.pages.dev |
| Diagnosis report | [docs/DIAGNOSIS.md](docs/DIAGNOSIS.md) |
| Fix pull request | see the closed PR "Fix five launch blockers" |

The very first state (tag `before`) does not build at all and, when forced through `vite build`,
shows a blank page — that is why the live "before" link starts from commit `9d80311`.

## The five problems
1. **Build failure** — TypeScript error stops every deploy.
2. **Missing env var** — `SUPABASE_URL` without the `VITE_` prefix is `undefined` in the browser.
3. **Auth redirect loop** — session cleared on each route change.
4. **RLS blocks reads** — insert policy only, so select returns an empty list with no error.
5. **Routing 404** — a stray `404.html` stops SPA fallback on Cloudflare Pages.

## Run it
```bash
cp .env.example .env
npm install
npm run dev
```
Any email signs in (demo only, nothing is sent). Data stays in your browser's localStorage.

## How we work on a real app
Diagnosis report first (what breaks, why, what we will change) → fixes as separate commits in a
pull request → deploy and check on the live URL. We never ask for your passwords or secret keys:
you add them in your own hosting settings.

---
**한국어 요약** — 바이브코딩으로 만든 앱에서 자주 나오는 고장 5가지(빌드 실패·환경변수 누락·인증 루프·RLS 막힘·라우팅 404)를 일부러 넣은 데모입니다. 진단 리포트 → 고장별 수정 커밋 → Cloudflare Pages 재배포 순서를 그대로 보여 줍니다. 비밀값은 저장소에 없습니다.
