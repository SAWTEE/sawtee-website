import { describe, expect, it } from 'vitest';

import {
  sanitizeSearchCategory,
  sanitizeSearchQuery,
  sanitizeSearchTheme,
  sanitizeSearchYear,
  SEARCH_QUERY_MAX_LENGTH,
} from '@/lib/search-params';

describe('search-params', () => {
  it('strips tags and control characters from queries', () => {
    expect(sanitizeSearchQuery('<script>alert(1)</script>trade')).toBe(
      'alert(1) trade'
    );
    expect(sanitizeSearchQuery('trade\u0000policy')).toBe('tradepolicy');
  });

  it('truncates long queries', () => {
    const long = 'a'.repeat(SEARCH_QUERY_MAX_LENGTH + 50);
    expect(sanitizeSearchQuery(long)).toHaveLength(SEARCH_QUERY_MAX_LENGTH);
  });

  it('normalizes category slugs', () => {
    expect(sanitizeSearchCategory('Opinion In Lead!!!')).toBe('opinioninlead');
    expect(sanitizeSearchCategory('../etc/passwd')).toBe('etcpasswd');
    expect(sanitizeSearchCategory('commentary')).toBe('commentary');
  });

  it('validates year and theme integers', () => {
    expect(sanitizeSearchYear('2024')).toBe(2024);
    expect(sanitizeSearchYear('not-a-year')).toBeNull();
    expect(sanitizeSearchTheme('12')).toBe(12);
    expect(sanitizeSearchTheme('-1')).toBeNull();
  });
});
