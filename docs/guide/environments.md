# Environments

| Environment | Branch | Env file | SSR | Notes |
| --- | --- | --- | --- | --- |
| **Local** | feature branches | `.env` from `.env.example` | Via Vite when enabled | `npm run dev` + `@inertiajs/vite` — **no** separate `inertia:start-ssr` |
| **Staging** | `staging` | `.env` on server (from `.env.staging.example` / CI secrets) | **On** | Needs Node **22+** + `inertia:start-ssr` (see `scripts/ssr-restart.sh`) |
| **Production** | `main` | server `.env` | Off until staging SSR is proven | Client-only `npm run build`; `APP_DEBUG=false` |

Inertia v3 only removes the separate Node SSR process for **local Vite development**. Staging/production with SSR enabled still require a background Node process.

## Staging checklist

1. Subdomain e.g. `staging.sawtee.org` → document root `public/`  
2. Separate MySQL database  
3. GitHub Environment `staging` + `STAGING_*` secrets for app/DB/target dir; reuse prod `SSH_*`, `MAIL_*`, and `DB_PASSWORD` (see main README)  
4. Node **22+** available for `php artisan inertia:start-ssr` (cPanel Node App or VPS)  
5. Push to `staging` → `.github/workflows/deploy-staging.yml`

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
