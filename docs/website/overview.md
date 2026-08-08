# Public website overview

The public site is an **Inertia (React) + Laravel** app:

- Blade shells only where needed; almost all pages are React under `resources/js/Pages/Frontend`
- Default shell: `MainLayout` (header/footer menus from the CMS, shared SEO head tags)
- Nested chrome: archives/pages use `PageLayout`; post singles use `PostLayout`
- Content is loaded from the same database editors manage in `/admin`
- Common HTTP errors (403, 404, 500, 503) use a branded Inertia error page when debug mode is off

## Main content areas visitors see

- Home (carousel, featured pubs, blogs, media, newsletter, webinars, …)  
- Category archives and single posts  
- Publications and research downloads  
- Custom pages (Contact, Our Work, …)  
- Team / fellows / institutes  
- Search  

Home “below the fold” blocks (events, publications, media, newsletters, webinars) load as deferred Inertia props so the first paint stays lighter.

## Progressive Web App

Visitors can install the public site as a PWA (home screen / standalone window). Offline, they see a branded fallback page — not cached CMS articles or admin screens. Editors using `/admin` are unaffected; that area is never service-worker cached.

Editors do not edit React files for day-to-day content — they use the CMS. Developers change templates when design or new page types are required.
