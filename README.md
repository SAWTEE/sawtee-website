
## About SAWTEE CMS

  <p align="center"><a href="https://laravel.com" target="_blank"><img src="https://ankursingh.com.np/assets/logo-sawtee.svg" width="400" alt="Laravel Logo"></a></p>

SAWTEE CMS is a custom content management system built using [Laravel](https://laravel.com/) and [Inertia](https://inertiajs.com/) to suit the needs of [SAWTEE](https://sawtee.org).

The app has two parts, a [backend](https://ankursingh.com.np/admin) necessary to manage content for the website and a [frontend](https://ankursingh.com.np)(website).


# Setup local development

These are the steps required to setup the local development.

This is a Laravel + Inertia + React application. Requirements:

- PHP **8.3+** (Laravel 13)
- HTTP server with PHP support (eg: Apache, Nginx, Caddy, Herd/Valet)
- Composer
- MySQL
- Node.js 20+ (for building frontend assets; not required on the production host if you deploy a pre-built `public/build`)

Stack: **Laravel 13**, **Inertia 3** (`inertiajs/inertia-laravel` + `@inertiajs/react`), **React 19**, **Vite 7**, **TypeScript**, **Tailwind CSS 4**.

## Architecture

**Inertia is the primary data path.** Page and shared props come from Laravel controllers / `HandleInertiaRequests` into React via Inertia — not a parallel JSON REST API. That matches Laravel’s Inertia + React guidance for this CMS: one backend, typed shared props (`resources/js/types`), and no duplicated controllers for a second HTTP surface.

A separate public API would only be justified for mobile apps or third-party consumers. This repo has neither, so we keep Inertia and invest in TypeScript prop contracts instead of REST resources.

TypeScript runs with `strict: true`. Shared/core files are fully checked; remaining legacy pages/components are listed in `resources/js/types/TYPECHECK_ALLOWLIST.md` (`// @ts-nocheck`) and should be migrated over time.

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

1. **PHP 8.3+** with common extensions (OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, Fileinfo, etc.)
2. Document root pointed at the app’s `public/` directory
3. MySQL (or compatible) database access

Recommended deploy flow:

1. Build assets locally/CI: `npm ci && npm run build` (client-only; do **not** rely on Node SSR on shared hosting)
2. Keep `INERTIA_SSR_ENABLED=false` (default in `config/inertia.php`)
3. Upload/deploy code + `vendor/` (or run `composer install --no-dev` via SSH) and the built `public/build` directory
4. Set `.env` for production (`APP_ENV=production`, `APP_DEBUG=false`, correct `APP_URL` / DB credentials)
5. Run `php artisan migrate --force`, `php artisan storage:link`, `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`
6. Schedule via host cron: `* * * * * php /path/to/artisan schedule:run`

Do not set `ASSET_URL=public` — leave `ASSET_URL` empty unless you use a CDN with a full absolute URL.



## Caching (shared-hosting safe)

Menus, home page sections, and the XML sitemap use **explicit cache keys** with TTLs (not Redis cache tags), so the site works on typical shared hosting with `file` or `array` cache drivers.

- Menus: ~1 hour (`menus.location.{header|footer}`)
- Home assembler payload: ~5 minutes (`home.page.data`)
- Sitemap XML: ~1 hour (`sitemap.xml`)

Observers clear these keys when pages, posts, publications, articles, categories, menus, or home sections are saved/deleted.

**Optional advanced tip:** If you later run Redis and want tag-based invalidation, you can introduce cache tags around the same keys — but tags are **not required** for production on shared hosting.

## License

The project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
