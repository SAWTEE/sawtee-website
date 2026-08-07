
## About SAWTEE CMS

  <p align="center"><a href="https://laravel.com" target="_blank"><img src="https://ankursingh.com.np/assets/logo-sawtee.svg" width="400" alt="Laravel Logo"></a></p>

SAWTEE CMS is a custom content management system built using [Laravel](https://laravel.com/) and [Inertia](https://inertiajs.com/) to suit the needs of [SAWTEE](https://sawtee.org).

The app has two parts, a [backend](https://ankursingh.com.np/admin) necessary to manage content for the website and a [frontend](https://ankursingh.com.np)(website).

## Documentation

Editor and website guides live in a **separate VitePress site** under [`docs/`](./docs/). It is meant to be hosted on **GitHub Pages** (not on the Laravel/cPanel host):

- Published URL (after enabling Pages): `https://SAWTEE.github.io/sawtee-website/`
- Local preview: `npm install --prefix docs && npm run docs:dev`
- Workflow: [`.github/workflows/deploy-docs.yml`](./.github/workflows/deploy-docs.yml)

In the GitHub repo: **Settings → Pages → Source: GitHub Actions**.

### Environment files

| File | Purpose |
| --- | --- |
| `.env.example` | Fresh Laravel defaults for local installs (`cp .env.example .env`) |
| `.env.staging.example` | Staging template (`cp .env.staging.example .env.staging`) — no secrets |
| `.env` / `.env.staging` | Real credentials — **gitignored**, never commit |

# Setup local development

These are the steps required to setup the local development.

This is a Laravel + Inertia + React application. Requirements:

- PHP **8.3+** (Laravel 13; staging/CI and current `composer.lock` expect **PHP 8.4+** because Symfony 8.1 requires `>=8.4.1`)
- HTTP server with PHP support (eg: Apache, Nginx, Caddy, Herd/Valet)
- Composer
- MySQL
- Node.js 20+ (for building frontend assets; not required on the production host if you deploy a pre-built `public/build`)

Stack: **Laravel 13**, **Inertia 3** (`inertiajs/inertia-laravel` + `@inertiajs/react`), **React 19**, **Vite 7**, **TypeScript**, **Tailwind CSS 4**.

## Architecture

**Inertia is the primary data path.** Page and shared props come from Laravel controllers / `HandleInertiaRequests` into React via Inertia — not a parallel JSON REST API. That matches Laravel’s Inertia + React guidance for this CMS: one backend, typed shared props (`resources/js/types`), and no duplicated controllers for a second HTTP surface.

A separate public API would only be justified for mobile apps or third-party consumers. This repo has neither, so we keep Inertia and invest in TypeScript prop contracts instead of REST resources.

TypeScript runs with `strict: true`. Shared/core files are fully checked; remaining legacy pages/components are listed in `resources/js/types/TYPECHECK_ALLOWLIST.md` (`// @ts-nocheck`) and should be migrated over time.

## Inertia layouts

`createInertiaApp` (client + SSR) sets a default layout from `resources/js/lib/resolve-layout.ts` by page name:

| Page prefix | Default layout |
| --- | --- |
| `Backend/Auth/*` | `GuestLayout` |
| `Backend/*` | `AuthenticatedLayout` |
| `Frontend/*` | `MainLayout` |
| `Errors/*` | none (page chooses) |

Nested public chrome uses helpers in `resources/js/lib/page-layouts.ts`:

- `mainWithPageLayout` → `MainLayout` + `PageLayout` (pages/archives)
- `mainWithPostLayout` → `MainLayout` + `PostLayout` (post singles)

Pages that set `Component.layout` override the default. The branded error page sets `ErrorPage.layout` to `GuestLayout` for admin URLs and `MainLayout` for the public site.

Page resolution uses Inertia’s `pages: { path, extension, lazy }` shorthand in `resources/js/app.tsx` / `ssr.tsx` (code-split per page via `@inertiajs/vite`).

## Branded error pages

HTTP errors that have visitor copy (403, 404, 500, 503 — and 419 via redirect/flash) can render the Inertia page `Errors/Error`, wired from `app/Exceptions/Handler.php`.

**Local preview:** branded pages are **skipped** when `APP_DEBUG=true` **and** the app environment is `local` or `development` (`shouldRenderBrandedError`). That keeps Ignition / detailed exceptions for day-to-day debugging.

To preview the branded page locally, temporarily set `APP_DEBUG=false` (or use a non-`local`/`development` env), then hit an unknown URL. JSON clients (non-Inertia) still get framework JSON payloads.

Covered by `tests/Feature/ErrorPagesTest.php`.

## Inertia v3 performance / UX

Notable patterns already in the app:

- **History encryption (admin):** admin routes use the `inertia.encrypt` middleware (`routes/web.php`). Logout calls `Inertia::clearHistory()` so the browser back button cannot surface admin page JSON.
- **Slim shared auth:** `HandleInertiaRequests` shares only `id`, `name`, `email`, `email_verified_at` for `auth.user`.
- **Ziggy trimming:** full Ziggy is shared on full document / SSR requests; Inertia XHR navigations get `{ location }` only.
- **Menus `shareOnce`:** `primaryMenu` / `footerMenu` are once-props on the public site (not shared on `/admin`).
- **Deferred props:** dashboard `analytics` (`Inertia::defer`); home “below the fold” blocks (events, publications, media, newsletters, webinars).
- **Prefetch:** admin sidebar / nav links prefetch on hover/mount.
- **Partial reloads:** Posts index filters reload only `posts`, `categories`, and `categoryID`.

## First-party page analytics

Lightweight DB-backed page views for the public site (shared-hosting friendly):

- Middleware: `RecordPageView` (web stack) → `App\Support\Analytics`
- Model: `PageView` (IP / user-agent stored as hashes)
- Config: `config/analytics.php` — env keys `ANALYTICS_ENABLED`, `ANALYTICS_DEDUPE_MINUTES`, `ANALYTICS_HASH_SALT` (also listed in `.env.staging.example`)
- Admin **Dashboard** shows month-over-month content counts (`TrendBadge`) plus deferred analytics (views / top pages)

Admin / tooling paths are ignored (`admin`, `api`, `_debugbar`, …). Session/path views are deduped for `ANALYTICS_DEDUPE_MINUTES` (default 30).

Tests: `tests/Feature/AnalyticsTest.php`, `tests/Feature/DashboardStatsTest.php`.

## Admin maintenance tools

Under `/admin` (authenticated):

- **Maintenance** — scan/delete orphaned uploads; can also run Spatie `media-library:clean` (dry-run or delete)
- **Link Checker** — crawl the public site for broken links (optional external checks; capped page/link limits)
- **Posts trash** — soft-delete, restore, and permanent delete (`SoftDeletes` on `Post`)

You can find more details on the [Laravel documentation website](https://laravel.com/docs/13.x/installation).

Here are the steps that we suggest you to follow:

1. Install PHP and a web server like Nginx. If you are on macOS, or linux we recommend [Valet](https://laravel.com/docs/9.x/valet) or [Linux Valet](https://cpriego.github.io/valet-linux/) and [Linux Valet Plus](https://valetlinux.plus/).
2. Install MySQL.
3. Clone the repo into your local machine

```bash
git clone https://github.com/SAWTEE/sawtee-website.git && cd sawtee-website
```

4. install composer dependencies

```bash
# inside the projects root folder 
composer install --no-progress --no-interaction --prefer-dist --optimize-autoloader
```

5. install node dependencies

```bash
# using npm, pnpm or yarn
npm install
```

6. generate and configure `.env` file
	1. `cp .env.example .env`
    2. `php artisan key:generate --no-interaction` (generates APP_KEY)
8. run database migrations `php artisan migrate --force`
9. generate dummy data
    1. `php artisan db:seed`
10. `npm run build` to generate the proper JS and CSS files
11. `npm run dev` and head to your browser and enter http://localhost:3000 for the frontend and http://localhost:3000/admin for backend.

## Shared hosting deploy checklist

Laravel 13 can run on shared hosting when the host provides:

1. **PHP 8.4+** on staging/production shared hosting (matches CI; Symfony 8.1 in the lockfile needs `>=8.4.1`) with common extensions (OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, Fileinfo, etc.)
2. Document root pointed at the app’s `public/` directory
3. MySQL (or compatible) database access

Recommended deploy flow:

1. Build assets locally/CI: `npm ci && npm run build` (client-only; do **not** rely on Node SSR on production shared hosting until staging proves it)
2. Keep `INERTIA_SSR_ENABLED=false` on production (default in `config/inertia.php`)
3. Upload/deploy code + `vendor/` (or run `composer install --no-dev` via SSH) and the built `public/build` directory
4. Set `.env` for production (`APP_ENV=production`, `APP_DEBUG=false`, correct `APP_URL` / DB credentials)
5. Run `php artisan migrate --force`, `php artisan storage:link`, `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`
6. Schedule via host cron: `* * * * * php /path/to/artisan schedule:run`

Do not set `ASSET_URL=public` — leave `ASSET_URL` empty unless you use a CDN with a full absolute URL.

## Inertia SSR (v3)

| Context | What you run | Separate Node SSR process? |
| --- | --- | --- |
| **Local dev** | `npm run dev` | **No** — `@inertiajs/vite` exposes SSR on the Vite dev server |
| **Staging / production** (SSR on) | `npm run build:ssr` then `php artisan inertia:start-ssr` | **Yes** — Node.js **22+** background process (Supervisor, cPanel Node App, or `scripts/ssr-restart.sh`) |
| **Production** (current) | `npm run build` only | N/A — `INERTIA_SSR_ENABLED=false` (client-only) |

Do **not** confuse “no separate SSR server in Vite dev” with staging/production: those still need a persistent Node process when SSR is enabled.

## Staging + Inertia SSR

Branch: **`staging`**. Workflow: `.github/workflows/deploy-staging.yml` (CI on PR/push; deploy on push to `staging`).

Staging enables **`INERTIA_SSR_ENABLED=true`** and uploads the Vite SSR bundle (`npm run build:ssr` → `bootstrap/ssr`). After deploy, `scripts/ssr-restart.sh` starts `php artisan inertia:start-ssr` (required for staging SSR).

### cPanel shared hosting (staging subdomain)

1. Create subdomain e.g. `staging.sawtee.org` → document root `…/staging.sawtee.org/public` (or symlink `public` as the docroot).
2. Create a **separate MySQL database** for staging (never point staging at production DB).
3. Add GitHub Actions `STAGING_*` secrets for app/DB (except password)/drivers/`SSH_TARGET_DIR` (and optional `STAGING_INERTIA_SSR_URL`, default `http://127.0.0.1:13714`). Reuse production secrets for SSH (`SSH_HOST`/`USERNAME`/`KEY`/`PORT`), mail (`MAIL_*`), and `DB_PASSWORD`. Use [`.env.staging.example`](./.env.staging.example) as the checklist of values (never commit a real `.env.staging`).
4. Create a GitHub **Environment** named `staging` (optional protection rules).
5. **Node for SSR (required on staging):** classic shared PHP hosting cannot keep Inertia SSR alive. You need one of:
   - cPanel **Setup Node.js App** (Application root = Laravel root, startup via `php artisan inertia:start-ssr` or a wrapper), or
   - SSH + Node **22+** binary + `bash scripts/ssr-restart.sh` after each deploy, or
   - A small VPS / Cloudways / Forge staging box (recommended if Node App is unavailable).
6. Push to `staging` to deploy. Confirm View Source shows server-rendered markup (not an empty `#app` only). If SSR fails, Inertia falls back to client render unless `INERTIA_SSR_THROW_ON_ERROR=true`.

Production (`main`) stays client-rendered (`npm run build`, `INERTIA_SSR_ENABLED=false`) until staging SSR is verified.



## Caching (shared-hosting safe)

Menus, home page sections, and the XML sitemap use **explicit cache keys** with TTLs (not Redis cache tags), so the site works on typical shared hosting with `file` or `array` cache drivers.

- Menus: ~1 hour (`menus.location.{header|footer}`)
- Home assembler payload: ~5 minutes (`home.page.data`)
- Sitemap XML: ~1 hour (`sitemap.xml`)

Observers clear these keys when pages, posts, publications, articles, categories, menus, or home sections are saved/deleted.

**Optional advanced tip:** If you later run Redis and want tag-based invalidation, you can introduce cache tags around the same keys — but tags are **not required** for production on shared hosting.

## Frontend tooling

- **Import sorting:** `eslint-plugin-simple-import-sort` is enabled in `eslint.config.js`. Sort imports across the React app with `npm run lint:imports` (or `npm run lint`).
- **Unused code:** [Knip](https://knip.dev) is configured in `knip.config.ts` for this Vite + React + Inertia layout. Laravel PHP, public assets, and vendor are ignored; `resources/js/Pages/**` are treated as entry points (Inertia dynamic pages) so they are not flagged unused while their imports are still traced. Run `npm run find-unused` (alias: `npm run knip`) and review results before deleting — only remove high-confidence unused components, never Pages.

## License

The project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
