# BharatRailGo landing site

A static marketing site built with Vite, React and TypeScript. It needs no server of its own. Upload `dist/` to any static host.

## Configure

Copy `.env.example` to `.env`:

| Variable | What |
|---|---|
| `VITE_SITE_URL` | Public URL of this site (canonical and Open Graph tags) |
| `VITE_APP_URL` | Web app URL. The Sign in and Free trial buttons link to `/login` and `/signup?plan=` |
| `VITE_API_URL` | Backend `/api` URL. Pricing is read live from `GET /plans` |

Contact email, WhatsApp number, features and FAQ are in `src/config.ts`.

The backend's `CORS_ORIGIN` must include this site's origin, or the live pricing is not loaded. If it can't be loaded, the site quietly shows the built-in price list instead.

## Commands

```
npm install
npm run dev        # local dev server
npm run build      # typecheck + build to dist/
node tools/verifyLanding.mjs   # Playwright gate (15 checks) — evidence in ../verify-evidence/phase6/landing
```
