# Content pages

## Archives

Category pages list posts or publications for that taxonomy path. Filters (theme, year, tag) appear where the template supports them.

## Singles

A post or article page shows title, meta, body, featured image, and related downloads/tags. Layout depends on **category** (events look different from blogs, webinars embed video, etc.).

## Custom pages

Pages with a `template` key map to specific React pages (e.g. Contact form, Reform Monitor). Content and SEO still come from the CMS page record.

Shared wording on those templates is now in **Site Settings**:

| Page | Site Settings group |
| --- | --- |
| Our Work | Thematic / workstream headings, intros, sector images |
| Reform Monitor | Title and disclaimer |
| About | Member Institutions heading and intro |
| Media fellows | Page intro and empty state |
| Contact | Organisation name and working days (phones/address stay in the page JSON) |

Common HTTP errors (403, 404, 419, 500, 503) use branded copy from **Site Settings → Error pages** when debug mode is off.
