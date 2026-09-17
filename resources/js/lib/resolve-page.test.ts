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

  it.each([
    ['Backend/Dashboard', 'admin shell'],
    ['Backend/Auth/Login', 'auth screen'],
  ])('resolves %s (%s)', async name => {
    // Admin pages additionally await resources/css/admin.css; auth screens are
    // covered by index.css and must not wait on it.
    await expect(resolvePage(name)).resolves.toBeTypeOf('function');
  });
});
