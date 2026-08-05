# Local setup

## Requirements

- PHP **8.3+**
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
| `npm run dev` | Vite HMR while developing |
| `npm run build` | Production client assets |
| `npm run build:ssr` | Client + Inertia SSR bundle (staging) |
| `php artisan test` | PHP test suite |
| `npm run docs:dev` | Run this documentation site locally (`cd docs && npm i && npm run docs:dev`) |
