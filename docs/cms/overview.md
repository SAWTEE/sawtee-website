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
| **Pages & sections** | Static/custom pages and building blocks |
| **Menus** | Header and footer navigation |
| **Homepage sections** | Show/hide blocks on the home page |
| **Sliders & slides** | Home carousel |
| **Team / fellows / institutes** | People and member networks |
| **Dashboard** | Content counts with month-over-month trends, plus first-party page-view analytics (views / top paths) |
| **Maintenance** | Find orphaned media/files; dry-run or delete unused uploads |
| **Link Checker** | Crawl the public site and list broken links |

## Publishing basics

1. Create or edit the record.  
2. Set **status** to published when ready (posts).  
3. Add a **featured image** where the design expects one.  
4. Fill **meta title / description** for SEO when possible.  
5. Save — the public site picks up changes (home/menus may cache for a few minutes).

Titles are validated for uniqueness where it matters (e.g. post titles must be unique **within the same category**).

## Permissions

Admin routes require an authenticated, verified user. Abuse-IP blocking runs globally; whitelist office IPs via `ABUSEIP_WHITELIST` if needed.
