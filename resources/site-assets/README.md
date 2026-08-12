# Site static assets (tracked)

These files are the **source of truth** for URLs under `/assets/...`.

Build-generated paths under `public/` (`build/`, `assets/`, PWA service worker) are gitignored. **Bootstrap files** (`index.php`, `.htaccess`, favicons, PWA icons, `offline.html`) stay tracked so deploys always include Laravel’s entry point.

Assets here are copied into `public/assets` by:

- `npm run build` / `npm run dev` (via `scripts/sync-site-assets.mjs`)
- `php artisan sawtee:sync-site-assets`
- `php artisan sawtee:seed-content` (runs sync first)

On production deploy, CI already runs `npm run build`, then uploads the resulting `public/assets` tree.
