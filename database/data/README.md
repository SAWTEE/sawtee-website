# Content seed fixtures

JSON fixtures used by `php artisan sawtee:seed-content` (and `DatabaseSeeder`).

| File | Seeds |
|------|--------|
| `media-fellowships.json` | Fellowships, fellows, published stories (+ media from `resources/site-assets`) |
| `member-institutes.json` | Members, institutes; syncs About page `pageData` |
| `home-features.json` | Home feature cards |
| `site-settings.json` | About mega-menu intro + social links |

Static images for `/assets/...` live in **`resources/site-assets`** (tracked) and are synced to `public/assets` on build/deploy.

All seeders are **idempotent** (`updateOrCreate`) and safe to re-run on production after deploy:

```bash
php artisan migrate --force
php artisan sawtee:seed-content
# or subset:
php artisan sawtee:seed-content --only=fellowships,institutes
```
