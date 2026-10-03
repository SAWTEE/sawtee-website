import { describe, expect, it } from 'vitest';

import { mediaImage } from './media-image';

describe('mediaImage', function () {
  it('falls back when the collection is empty', function () {
    expect(mediaImage([], 'post-featured-image', '/fallback.webp')).toEqual({
      src: '/fallback.webp',
    });
  });

  it('prefers preview_url on thumbs and keeps srcset plus placeholder', function () {
    expect(
      mediaImage(
        [
          {
            collection_name: 'post-featured-image',
            original_url: '/large.webp',
            preview_url: '/preview.webp',
            srcset: '/a.webp 400w, /b.webp 800w',
            placeholder: 'data:image/svg+xml;base64,abc',
          },
        ],
        'post-featured-image',
        '/fallback.webp',
        true
      )
    ).toEqual({
      src: '/preview.webp',
      srcSet: '/a.webp 400w, /b.webp 800w',
      placeholder: 'data:image/svg+xml;base64,abc',
    });
  });

  it('uses the first item when no collection is given', function () {
    expect(
      mediaImage(
        [{ original_url: '/cover.webp', srcset: '/cover.webp 200w' }],
        undefined,
        '/fallback.webp'
      )
    ).toEqual({
      src: '/cover.webp',
      srcSet: '/cover.webp 200w',
      placeholder: null,
    });
  });
});
