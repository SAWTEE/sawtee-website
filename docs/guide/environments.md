# Environments

| Environment | Branch | Env file | SSR | Notes |
| --- | --- | --- | --- | --- |
| **Local** | feature branches | `.env` from `.env.example` | Usually off | `APP_DEBUG=true` |
| **Staging** | `staging` | `.env` on server (from `.env.staging.example` / CI secrets) | **On** | Validates Inertia SSR before production |
| **Production** | `main` | server `.env` | Off until staging SSR is proven | `APP_DEBUG=false` |

## Staging checklist

1. Subdomain e.g. `staging.sawtee.org` → document root `public/`  
2. Separate MySQL database  
3. GitHub Environment `staging` + `STAGING_*` secrets (see main README)  
4. Node available for `php artisan inertia:start-ssr` (cPanel Node App or VPS)  
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
