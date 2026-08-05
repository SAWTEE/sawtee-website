# Public website overview

The public site is an **Inertia (React) + Laravel** app:

- Blade shells only where needed; almost all pages are React under `resources/js/Pages/Frontend`
- Layout: header/footer menus from the CMS, shared SEO head tags
- Content is loaded from the same database editors manage in `/admin`

## Main content areas visitors see

- Home (carousel, featured pubs, blogs, media, newsletter, webinars, …)  
- Category archives and single posts  
- Publications and research downloads  
- Custom pages (Contact, Our Work, …)  
- Team / fellows / institutes  
- Search  

Editors do not edit React files for day-to-day content — they use the CMS. Developers change templates when design or new page types are required.
