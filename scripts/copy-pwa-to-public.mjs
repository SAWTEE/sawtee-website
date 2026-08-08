import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const publicDir = resolve(process.cwd(), 'public');
const buildDir = resolve(publicDir, 'build');

if (!existsSync(buildDir)) {
  console.error('copy-pwa: public/build missing — run vite build first');
  process.exit(1);
}

let copied = 0;

for (const file of readdirSync(buildDir)) {
  if (
    file === 'sw.js' ||
    file === 'manifest.webmanifest' ||
    file.startsWith('workbox-')
  ) {
    copyFileSync(resolve(buildDir, file), resolve(publicDir, file));
    copied += 1;
    console.log(`copy-pwa: ${file} → public/${file}`);
  }
}

if (copied === 0) {
  console.error('copy-pwa: no sw.js / workbox / webmanifest found in public/build');
  process.exit(1);
}
