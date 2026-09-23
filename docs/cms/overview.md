# CMS overview

The admin area lives at **`/admin`**. After login you get a sidebar of content types.

## What editors manage

| Area | What it controls on the site |
| --- | --- |
| **Posts** | News, blogs, events, newsletters, webinars, “in media”, etc. (by category). Soft-deleted posts go to **Trash** until restored or permanently deleted. |
| **Articles** | Pieces attached to a publication volume |
| **Publications** | Trade Insight / report volumes and PDFs |
| **Research** | Research reports and downloads |
| **Categories / tags / themes** | Organisation and filtering |
| **Pages & sections** | Static/custom pages and building blocks. Contact phones, email, and address live in the Contact page’s JSON. |
| **Menus** | Header and footer navigation |
| **Homepage sections** | Show/hide home blocks, plus the public heading and intro for each |
| **Features** | Illustrated home-page feature cards |
| **Site settings** | Footer, social icons, newsletter, search, SEO defaults, error pages, Know Us intro, and other public strings that used to live in code |
| **Sliders & slides** | Home carousel |
| **Team / fellows / institutes** | People and member networks |
| **Dashboard** | Content counts, analytics, and a notice pointing editors at the screens above |
| **Maintenance** | Find orphaned media/files; dry-run or delete unused uploads |
| **Link Checker** | Crawl the public site and list broken links |

## Publishing basics

1. Create or edit the record.  
2. Set **status** to published when ready (posts).  
3. Add a **featured image** where the design expects one.  
4. Fill **meta title / description** for SEO when possible.  
5. Save — the public site picks up changes (home/menus may cache for a few minutes).

Titles are validated for uniqueness where it matters (e.g. post titles must be unique **within the same category**).

## Where public wording lives

If you are looking for a sentence that is not a post or page body:

1. **[Site Settings](./site-settings)** — footer, search, SEO fallbacks, error pages, Our Work/Reform Monitor/Media fellows copy. Each form heading says where that group appears.  
2. **[Homepage sections](./homepage)** — titles and intros on home blocks (these win over Site Settings when both are filled).  
3. **[Features](./homepage#feature-cards)** — the illustrated cards on the home page.  
4. **[Pages](./pages-menus)** — Contact JSON (phones, email, address) and other template page data.

The dashboard banner lists the same map and links through to those screens. Dismiss it once you have tried them; it will return when the list of editable copy changes.

## Permissions

Admin routes require an authenticated, verified user. Abuse-IP blocking runs globally; whitelist office IPs via `ABUSEIP_WHITELIST` if needed.
