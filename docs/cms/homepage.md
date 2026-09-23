# Homepage sections

**Homepage sections** show or hide major home blocks without a deploy, and now also store the **public heading** and optional **intro** for each block.

Examples of section names used by the frontend:

- Carousel  
- Featured Publication  
- Infocus  
- Policy Outreach  
- Latest Publications  
- Sawtee in Media  
- Newsletter  
- Webinar  
- Newsletter Callout  

Set **Show** on for sections that should appear. Order is for admin organisation; **visibility**, **heading**, and **intro** are what the home page reads.

## Public heading and intro

1. Open **Home Page Sections** and edit a row.  
2. **Public heading** is the title visitors see (e.g. “In focus”).  
3. **Intro** is the sentence under that title (optional).  

If a heading or intro is left blank, the home page uses a built-in fallback (and for the newsletter callout, [Site Settings → Newsletter](./site-settings) can also supply the text). **A filled homepage-section heading wins** over Site Settings.

### Featured publication rail

Needs:

1. Homepage section **Featured Publication** → show on  
2. Publications tagged **`featured`**  
3. Optional featured blog posts (opinion / commentary / blog with `featured` tag)

The section **heading** labels the publications rail. The section **intro** labels the blogs rail (a built-in fallback is used if intro is empty).

## Feature cards

**Features** in the sidebar (`/admin/features`) are the illustrated cards on the home page (title, description, image path, link).

- Toggle **Visible on the home page** to show or hide a card.  
- **Sort order** controls sequence.  
- **Key** is an internal id; leave it blank on create to generate one from the title.  
- Image path is usually an `/assets/...` file, not a media-library upload.

Only **active** features appear on the public home page.
