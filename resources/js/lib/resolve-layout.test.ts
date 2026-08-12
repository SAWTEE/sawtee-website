import { describe, expect, it } from 'vitest';

import { resolveDefaultLayout } from './resolve-layout';

describe('resolveDefaultLayout', () => {
  it('returns eager layout components for frontend and backend pages', () => {
    const frontend = resolveDefaultLayout('Frontend/Pages/Home');
    const backend = resolveDefaultLayout('Backend/Dashboard');
    const auth = resolveDefaultLayout('Backend/Auth/Login');
    const errors = resolveDefaultLayout('Errors/Error');

    expect(frontend).toBeTypeOf('function');
    expect(backend).toBeTypeOf('function');
    expect(auth).toBeTypeOf('function');
    expect(errors).toBeNull();

    // Eager imports are real components, not React.lazy proxies.
    expect(frontend).not.toHaveProperty('_payload');
    expect(backend).not.toHaveProperty('_payload');
  });
});
