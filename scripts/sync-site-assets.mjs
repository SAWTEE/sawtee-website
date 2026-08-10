import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Copy tracked site assets into public/assets for HTTP serving.
 * Source of truth: resources/site-assets (committed).
 * Destination: public/assets (gitignored with the rest of public/).
 */
const sourceDir = resolve(process.cwd(), 'resources/site-assets');
const destDir = resolve(process.cwd(), 'public/assets');

if (!existsSync(sourceDir)) {
  console.error('sync-site-assets: resources/site-assets is missing');
  process.exit(1);
}

mkdirSync(resolve(process.cwd(), 'public'), { recursive: true });

// Replace destination so deleted source files do not linger in public/assets.
if (existsSync(destDir)) {
  rmSync(destDir, { recursive: true, force: true });
}

cpSync(sourceDir, destDir, { recursive: true });

function countFiles(dir) {
  let total = 0;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      total += countFiles(full);
    } else {
      total += 1;
    }
  }
  return total;
}

console.log(
  `sync-site-assets: ${countFiles(sourceDir)} files → public/assets`
);
