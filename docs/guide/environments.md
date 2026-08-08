# Environments

| Environment | Branch | Env file | SSR | Notes |
| --- | --- | --- | --- | --- |
| **Local** | feature branches | `.env` from `.env.example` | Optional via Vite | `npm run dev` + `@inertiajs/vite` — no separate Node process |
| **Staging** | `staging` | `.env` on server (from `.env.staging.example` / CI secrets) | **Off** | Client-only on cPanel (`INERTIA_SSR_ENABLED=false`) |
| **Production** | `main` | server `.env` | **Off** | Client-only `npm run build`; `APP_DEBUG=false` |

Staging and production on cPanel stay client-rendered. Local Vite may still use Inertia’s built-in SSR during `npm run dev` only.

## Staging checklist

1. Subdomain e.g. `staging.sawtee.org` → document root `public/`  
2. Separate MySQL database  
3. GitHub Environment `staging` + `STAGING_*` secrets for app/DB/target dir; reuse prod `SSH_*`, `MAIL_*`, and `DB_PASSWORD` (see main README)  
4. Push to `staging` → `.github/workflows/deploy-staging.yml` (no cPanel Node.js App required)

## Env files in the repo

| File | Committed? | Role |
| --- | --- | --- |
| `.env.example` | Yes | Fresh Laravel-style defaults for new installs |
| `.env.staging.example` | Yes | Staging template (no secrets) |
| `.env` / `.env.staging` | **No** | Real secrets; never commit |

Copy templates:

```bash
cp .env.example .env
cp .env.staging.example .env.staging
```

## Analytics (optional)

First-party page views are controlled in `config/analytics.php`. Staging checklist keys (also in `.env.staging.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `ANALYTICS_ENABLED` | `true` | Record public page views |
| `ANALYTICS_DEDUPE_MINUTES` | `30` | Same session + path not counted again within this window |
| `ANALYTICS_HASH_SALT` | falls back to `APP_KEY` | Salt for IP / user-agent hashes — set a dedicated value in production |

Admin paths are never recorded. Dashboard analytics load as a deferred Inertia prop.

## Branded errors vs debug

With `APP_DEBUG=true` in `local` or `development`, Laravel’s detailed exception UI is kept (branded Inertia error pages are skipped). Staging/production should run `APP_DEBUG=false` so visitors see the branded `Errors/Error` page for common statuses (403, 404, 500, 503).

## Session cookies on HTTPS

Set `SESSION_SECURE_COOKIE=true` on Herd, staging, and production so the session cookie is only sent over HTTPS (required for a trustworthy PWA install surface). Leave unset only if you deliberately run plain HTTP locally.

## Progressive Web App

Production client builds emit a service worker and web manifest (`npm run build`). Deploy health checks should confirm `public/sw.js` and `public/manifest.webmanifest` exist after build. The PWA is public-site only — it does not extend admin sessions or cache `/admin`.
