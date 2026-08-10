/** Max length for public search query params (matches SearchRequest). */
export const SEARCH_QUERY_MAX_LENGTH = 200;

/**
 * Normalize user-supplied search text before sending it as a query param.
 * Strips control characters / tags and truncates; Inertia/React still escape on render.
 */
export function sanitizeSearchQuery(value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '';
  }

  let text = String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > SEARCH_QUERY_MAX_LENGTH) {
    text = text.slice(0, SEARCH_QUERY_MAX_LENGTH);
  }

  return text;
}

/** Only allow slug-safe category filter values from the URL or UI. */
export function sanitizeSearchCategory(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const slug = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);

  return slug || null;
}

export function sanitizeSearchYear(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const year = Number(value);
  const maxYear = new Date().getFullYear() + 1;

  if (!Number.isInteger(year) || year < 1900 || year > maxYear) {
    return null;
  }

  return year;
}

export function sanitizeSearchTheme(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}
