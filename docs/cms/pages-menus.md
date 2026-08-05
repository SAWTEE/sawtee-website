# Pages, sections & menus

## Pages

Static or template-driven pages (`/{slug}`). Examples: Contact, Our Work, Reform Monitor.

Fields include name/slug, content or JSON page data, template key, featured image, and SEO meta.

## Sections

Reusable content blocks that can nest under a page or parent section (title, type, description, order, image). Used by some custom page templates.

## Menus

1. Create a **menu** with a unique **location** (`header` or `footer`).  
2. Add **menu items** (label, URL, order, optional parent for dropdowns).  
3. Nested items appear as dropdowns on the public header.

Clear menu cache after large edits if the site still shows old links (or wait for the ~1 hour menu TTL / save again to trigger observers).
