import { describe, expect, it } from 'vitest';

import type { MenuItem, PageProps, Paginated, User } from './index';
import { emptySharedProps } from './index';

describe('frontend type contracts', () => {
  it('builds empty shared props for layouts', () => {
    const shared = emptySharedProps();

    expect(shared.primaryMenu).toEqual([]);
    expect(shared.footerMenu).toEqual([]);
    expect(shared.auth.user).toBeNull();
  });

  it('allows page props to extend shared props', () => {
    const page: PageProps<{ title: string }> = {
      ...emptySharedProps(),
      title: 'Home',
    };

    expect(page.title).toBe('Home');
  });

  it('models paginated collections and users', () => {
    const user: User = {
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
    };

    const menu: MenuItem = {
      id: 1,
      title: 'About',
      name: 'About',
      url: '/about',
      parent_id: null,
      order: 1,
      children: [],
    };

    const paginated: Paginated<MenuItem> = {
      data: [menu],
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 1,
      from: 1,
      to: 1,
      links: [],
      path: '/admin/menus',
    };

    expect(user.email).toContain('@');
    expect(paginated.data[0].children).toEqual([]);
  });
});
