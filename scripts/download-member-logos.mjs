#!/usr/bin/env node
/**
 * Download member institute logos from their websites.
 * Tries: og:image, apple-touch-icon, icon links, then common logo paths.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const outDir = join(root, 'public/assets/member-institutes');
mkdirSync(outDir, { recursive: true });

const data = JSON.parse(
  readFileSync(join(root, 'public/tmp/member_institutes.json'), 'utf8')
);

const institutes = data.flatMap(c =>
  c.institutes.map(i => ({
    ...i,
    country: c.country,
    slug: slugify(shortName(i.member_name)),
  }))
);

function shortName(name) {
  const m = name.match(/\(([^)]+)\)/);
  if (m) return m[1].split(',')[0].trim();
  return name.split(',')[0].trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function absUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function pickExt(url, contentType) {
  const pathExt = extname(new URL(url).pathname).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'].includes(pathExt)) {
    return pathExt === '.jpeg' ? '.jpg' : pathExt;
  }
  if (contentType?.includes('svg')) return '.svg';
  if (contentType?.includes('webp')) return '.webp';
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return '.jpg';
  if (contentType?.includes('gif')) return '.gif';
  if (contentType?.includes('icon')) return '.ico';
  return '.png';
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; SAWTEEBot/1.0; +https://www.sawtee.org)',
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { html: await res.text(), finalUrl: res.url };
}

function extractCandidates(html, baseUrl) {
  const candidates = [];
  const push = href => {
    const u = absUrl(baseUrl, href);
    if (u && !candidates.includes(u)) candidates.push(u);
  };

  const og = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  );
  if (og) push(og[1]);

  const apple = [
    ...html.matchAll(
      /<link[^>]+rel=["']apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/gi
    ),
    ...html.matchAll(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon[^"']*["']/gi
    ),
  ];
  for (const m of apple) push(m[1]);

  const icons = [
    ...html.matchAll(
      /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/gi
    ),
    ...html.matchAll(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/gi
    ),
  ];
  for (const m of icons) push(m[1]);

  // Prefer logo-ish img srcs
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    const tag = m[0].toLowerCase();
    if (
      /logo|brand|header/.test(src) ||
      /logo|brand/.test(tag) ||
      /alt=["'][^"']*logo/i.test(tag)
    ) {
      push(src);
    }
  }

  for (const path of [
    '/logo.png',
    '/logo.svg',
    '/images/logo.png',
    '/images/logo.svg',
    '/assets/logo.png',
    '/wp-content/uploads/logo.png',
    '/favicon.ico',
  ]) {
    push(path);
  }

  return candidates;
}

async function downloadImage(url, destBase) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; SAWTEEBot/1.0; +https://www.sawtee.org)',
      Accept: 'image/*,*/*',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('text/html')) throw new Error('Got HTML, not image');
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) throw new Error(`Too small (${buf.length}b)`);
  const ext = pickExt(res.url || url, ct);
  const file = `${destBase}${ext}`;
  writeFileSync(join(outDir, file), buf);
  return file;
}

const results = [];

for (const inst of institutes) {
  const entry = {
    id: inst.id,
    country: inst.country,
    member_name: inst.member_name,
    member_website_link: inst.member_website_link,
    slug: inst.slug,
    logo: null,
  };

  console.log(`\n→ ${inst.slug} (${inst.member_website_link})`);
  try {
    const { html, finalUrl } = await fetchText(inst.member_website_link);
    const candidates = extractCandidates(html, finalUrl);
    console.log(`  candidates: ${candidates.slice(0, 6).join(', ')}${candidates.length > 6 ? '…' : ''}`);

    for (const cand of candidates.slice(0, 8)) {
      try {
        const file = await downloadImage(cand, inst.slug);
        entry.logo = `/assets/member-institutes/${file}`;
        console.log(`  ✓ ${file} from ${cand}`);
        break;
      } catch (e) {
        console.log(`  ✗ ${cand}: ${e.message}`);
      }
    }
  } catch (e) {
    console.log(`  site fetch failed: ${e.message}`);
  }

  results.push(entry);
  // polite delay
  await new Promise(r => setTimeout(r, 400));
}

const manifestPath = join(outDir, 'manifest.json');
writeFileSync(manifestPath, JSON.stringify(results, null, 2) + '\n');
const ok = results.filter(r => r.logo).length;
console.log(`\nDone: ${ok}/${results.length} logos → ${manifestPath}`);
