# Site static assets (tracked)

These files are the **source of truth** for URLs under `/assets/...`.

`public/` is gitignored, so assets here are copied into `public/assets` by:

- `npm run build` / `npm run dev` (via `scripts/sync-site-assets.mjs`)
- `php artisan sawtee:sync-site-assets`
- `php artisan sawtee:seed-content` (runs sync first)

On production deploy, CI already runs `npm run build`, then uploads the resulting `public/assets` tree.
