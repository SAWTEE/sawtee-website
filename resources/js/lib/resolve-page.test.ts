import { describe, expect, it } from 'vitest';

import { resolvePage } from './resolve-page';

describe('resolvePage', () => {
  it('resolves real page modules and rejects missing names', async () => {
    const page = await resolvePage('Errors/Error');

    expect(page).toBeTypeOf('function');

    await expect(resolvePage('Errors/Error.test')).rejects.toThrow(
      'Page not found: Errors/Error.test'
    );
  });
});
