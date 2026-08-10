import { describe, expect, it } from 'vitest';

import { buildShareUrl } from '@/lib/social';

describe('social helpers', () => {
  it('builds share urls for each network', () => {
    const options = {
      url: 'https://sawtee.org/category/newsletters/example',
      title: 'Example title',
      summary: 'Example summary',
    };

    expect(buildShareUrl('twitter', options)).toContain('x.com/intent/tweet');
    expect(buildShareUrl('twitter', options)).toContain(
      encodeURIComponent(options.url)
    );
    expect(buildShareUrl('facebook', options)).toContain(
      'facebook.com/sharer/sharer.php'
    );
    expect(buildShareUrl('linkedin', options)).toContain(
      'linkedin.com/sharing/share-offsite'
    );
  });
});
