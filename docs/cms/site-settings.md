# Site settings

**Site Settings** (`/admin/settings`) is the editor for public wording that used to live in the site’s React files: footer text, social icons, newsletter URLs, search dialog copy, SEO fallbacks, error pages, and similar strings.

Each group on the form has a short note under the heading that says **where that copy appears** on the public site. Use those notes if you are unsure which field to change.

Home-page **block titles** still live under [Homepage sections](./homepage) (those win when both are set). Home **feature cards** live under [Features](./homepage#feature-cards).

## What belongs here

| Group | Public surface |
| --- | --- |
| **Know Us** | About intro in the header mega menu |
| **Social links** | Header and footer social icons on every public page |
| **Footer** | Tagline, About/Contact/Substack links, copyright, map modal |
| **Newsletter** | Homepage callout fallbacks, Substack embed/widget, footer Substack URL |
| **Home extras** | Screen-reader H1 and Media / Newsletter column labels |
| **Our Work** | Thematic Areas and Workstreams headings, intros, and sector images on `/our-work` |
| **Reform Monitor** | Title and disclaimer on `/reform-monitor` |
| **Contact extras** | Organisation name and working days on `/contact` |
| **About** | Member Institutions heading and intro on the About page |
| **Media fellows** | Intro (and related copy) on `/media-fellows` |
| **Search** | Header search dialog |
| **SEO defaults** | Fallback title/description when a page has none; homepage title/description |
| **Error pages** | Public 403, 404, 419, 500, and 503 screens |
| **Globe markers** | Country markers on the Know Us mega-menu globe |
| **Mobile menu fallback** | Mobile nav **only** when the CMS header menu is empty |

## What does *not* belong here

- **Phones, email, address, office hours** — edit the **Contact** page’s JSON (`pageData`) under [Pages](./pages-menus).
- **Header and footer labels** — [Menus](./pages-menus#menus).
- **Page body copy** — the page record itself.
- **Empty Site Settings fields** fall back to built-in defaults, so clearing a field does not “delete” the public string; it restores the default.

## After saving

Changes apply on the next public page load. Home/menus may cache for a few minutes. If a field does not appear to update, confirm you edited the group whose heading matches the page you are looking at.
