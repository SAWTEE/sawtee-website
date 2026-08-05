# Introduction

SAWTEE’s website is a **Laravel + Inertia + React** application with two surfaces:

| Surface | URL (typical) | Audience |
| --- | --- | --- |
| **Public website** | `https://www.sawtee.org` / staging host | Visitors, researchers, partners |
| **CMS / Admin** | `/admin` | Staff who create and publish content |

This documentation explains:

1. How editors use the **CMS** day to day  
2. How that content shows up on the **frontend**  
3. How **local / staging / production** environments fit together  

It is **not** a full developer API reference. Engineering notes stay in the main [README](https://github.com/SAWTEE/sawtee-website/blob/staging/README.md).

## Mental model

```
Admin CMS  →  database + media library  →  Inertia pages  →  public React UI
```

Editors never edit React files. They edit posts, publications, pages, menus, and homepage toggles in `/admin`. The public site reads that data on each request (with short caching for home/menus/sitemap).

## Where to go next

- New to the project → [Local setup](./local-setup)  
- Editor handbook → [CMS overview](/cms/overview)  
- How the public site is structured → [Website overview](/website/overview)  
- Staging vs production → [Environments](./environments)
