# Local setup

## Requirements

- PHP **8.3+** (use **8.4+** to match staging/CI and the locked Symfony 8.1 packages)
- Composer
- Node.js **20+**
- MySQL (or SQLite for a quick smoke test)
- Herd, Valet, or `php artisan serve`

## Install

```bash
git clone https://github.com/SAWTEE/sawtee-website.git
cd sawtee-website
composer install
cp .env.example .env
php artisan key:generate
# Configure DB_* in .env, then:
php artisan migrate
npm install
npm run build   # or npm run dev
```

Open the site at your local URL (e.g. `https://sawtee.test`) and the CMS at `/admin`.

For PWA install / offline testing, use a **production** asset build (`npm run build`) over HTTPS, then DevTools → Application. `npm run dev` does not register the service worker.

## Staging env file (optional locally)

```bash
cp .env.staging.example .env.staging
# fill secrets, then:
php artisan --env=staging about
```

On the staging **server**, install secrets as `.env` (GitHub Actions does this from `STAGING_*` secrets). Keep `.env.staging` gitignored.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite HMR (optional Inertia SSR via `@inertiajs/vite` in local only) |
| `npm run build` | Production **client-only** assets (+ PWA files) |
| `npm run build:ssr` | Optional: also emit `bootstrap/ssr` (not used by cPanel deploy) |
| `php artisan test` | PHP test suite |
| `npm run docs:dev` | Run this documentation site locally (`cd docs && npm i && npm run docs:dev`) |

## Preview branded error pages

With the usual local `.env` (`APP_ENV=local`, `APP_DEBUG=true`), unknown URLs show Laravel’s detailed exception UI — not the branded Inertia page. To preview `Errors/Error`, set `APP_DEBUG=false` temporarily, then visit a missing path. Details: [Environments](./environments#branded-errors-vs-debug) and the main README.
