import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { SITE_HEADER_LOGO_SRC } from './site-logo';

const HEADER_LOGO = resolve(
  process.cwd(),
  'resources/site-assets/logo-sawtee-header.webp'
);

function webpHasAlpha(bytes: Buffer): boolean {
  if (
    bytes.toString('ascii', 0, 4) !== 'RIFF' ||
    bytes.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return false;
  }

  const fourcc = bytes.toString('ascii', 12, 16);

  if (fourcc === 'VP8X') {
    return (bytes[20] & 0x10) !== 0;
  }

  if (fourcc === 'VP8L') {
    const bitstream = bytes.readUInt32LE(21);

    return ((bitstream >>> 28) & 1) === 1;
  }

  return false;
}

describe('site header logo asset', () => {
  it('ships a transparent webp so dark mode does not show a white box', () => {
    const bytes = readFileSync(HEADER_LOGO);

    expect(SITE_HEADER_LOGO_SRC).toBe('/assets/logo-sawtee-header.webp');
    expect(webpHasAlpha(bytes)).toBe(true);
    expect(bytes.byteLength).toBeLessThan(12 * 1024);
  });
});
