import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { posix, resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * `resources/css/index.css` ships to every visitor; `resources/css/admin.css` is
 * fetched only for `Backend/*` pages. Both declare their own `@source` list
 * instead of scanning all of `resources/js`, which keeps admin-only utilities
 * (data tables, calendar, command palette, …) out of the public stylesheet.
 *
 * These tests fail when a page or component drifts across that boundary — the
 * failure mode is otherwise silent: classes simply stop being generated and the
 * page renders unstyled in production while looking fine in dev.
 */

const REPO_ROOT = resolve(__dirname, '../../..');
const JS_ROOT = resolve(REPO_ROOT, 'resources/js');

const escapeLiteral = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Convert a `@source` glob (`**`, `*`, `{a,b}`) to an anchored RegExp. */
function globToRegExp(glob: string): RegExp {
  let pattern = '';
  let index = 0;

  while (index < glob.length) {
    if (glob[index] === '{') {
      const end = glob.indexOf('}', index);
      const alternatives = glob.slice(index + 1, end).split(',');
      pattern += `(?:${alternatives.map(escapeLiteral).join('|')})`;
      index = end + 1;
      continue;
    }

    if (glob.startsWith('**/', index)) {
      pattern += '(?:[^/]+/)*';
      index += 3;
      continue;
    }

    if (glob.startsWith('**', index)) {
      pattern += '.*';
      index += 2;
      continue;
    }

    if (glob[index] === '*') {
      pattern += '[^/]*';
      index += 1;
      continue;
    }

    pattern += escapeLiteral(glob[index]);
    index += 1;
  }

  return new RegExp(`^${pattern}$`);
}

type SourceRules = {
  include: RegExp[];
  exclude: RegExp[];
};

/** Read the `@source` / `@source not` globs out of a stylesheet. */
function readSourceRules(cssPath: string): SourceRules {
  const css = readFileSync(resolve(REPO_ROOT, cssPath), 'utf8');
  const cssDir = posix.dirname(cssPath);
  const include: RegExp[] = [];
  const exclude: RegExp[] = [];

  for (const match of css.matchAll(/@source\s+(not\s+)?'([^']+)'/g)) {
    const [, negated, glob] = match;
    const normalized = posix.normalize(`${cssDir}/${glob}`);
    (negated ? exclude : include).push(globToRegExp(normalized));
  }

  return { include, exclude };
}

const isScanned = (rules: SourceRules, file: string): boolean =>
  rules.include.some(re => re.test(file)) &&
  !rules.exclude.some(re => re.test(file));

function listModules(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = resolve(dir, entry);
    if (statSync(path).isDirectory()) {
      listModules(path, found);
    } else if (/\.tsx?$/.test(path) && !/\.(test|spec)\.tsx?$/.test(path)) {
      found.push(path);
    }
  }
  return found;
}

function resolveImport(specifier: string, importer: string): string | null {
  let base: string;

  if (specifier.startsWith('@/')) {
    base = resolve(JS_ROOT, specifier.slice(2));
  } else if (specifier.startsWith('.')) {
    base = resolve(importer, '..', specifier);
  } else {
    return null;
  }

  for (const suffix of ['', '.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const candidate = `${base}${suffix}`;
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

const IMPORT_PATTERN = /(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g;

/** Every module transitively reachable from the given entry files. */
function importClosure(entries: string[]): Set<string> {
  const reached = new Set<string>();
  const queue = [...entries];

  while (queue.length > 0) {
    const file = queue.pop();
    if (!file || reached.has(file)) {
      continue;
    }
    reached.add(file);

    for (const match of readFileSync(file, 'utf8').matchAll(IMPORT_PATTERN)) {
      const dependency = resolveImport(match[1], file);
      if (dependency !== null && !reached.has(dependency)) {
        queue.push(dependency);
      }
    }
  }

  return reached;
}

const toRepoPath = (file: string): string =>
  file
    .slice(REPO_ROOT.length + 1)
    .split(sep)
    .join('/');

const allModules = listModules(JS_ROOT);

const publicClosure = importClosure(
  allModules.filter(
    file =>
      /\/Pages\/(Frontend|Errors)\//.test(file) ||
      /\/Pages\/Backend\/Auth\//.test(file) ||
      /\/layouts\/(MainLayout|PageLayout|PostLayout|GuestLayout)\.tsx$/.test(
        file
      )
  )
);

const adminClosure = importClosure(
  allModules.filter(
    file =>
      (/\/Pages\/Backend\//.test(file) &&
        !/\/Pages\/Backend\/Auth\//.test(file)) ||
      /\/layouts\/AuthenticatedLayout\.tsx$/.test(file)
  )
);

describe('css source boundary', () => {
  const frontend = readSourceRules('resources/css/index.css');
  const admin = readSourceRules('resources/css/admin.css');

  it('scans every module reachable from a public page', () => {
    const unscanned = [...publicClosure]
      .map(toRepoPath)
      .filter(file => !isScanned(frontend, file))
      .sort();

    expect(
      unscanned,
      'Add these to the @source list in resources/css/index.css, or their ' +
        'classes will be missing from the public stylesheet'
    ).toEqual([]);
  });

  it('scans every module reachable from an admin page', () => {
    // admin.css layers on top of index.css, so either stylesheet may cover a
    // module that the admin shell shares with the public chrome.
    const unscanned = [...adminClosure]
      .map(toRepoPath)
      .filter(file => !isScanned(admin, file) && !isScanned(frontend, file))
      .sort();

    expect(
      unscanned,
      'Add these to the @source list in resources/css/admin.css'
    ).toEqual([]);
  });

  it('keeps admin-only components out of the public stylesheet', () => {
    // Only components can contribute utilities. Over-scanning a `lib/` or
    // `hooks/` module costs no bytes, so those stay out of this assertion.
    const isComponent = (file: string): boolean =>
      /^resources\/js\/(components|Pages|layouts)\/.*\.tsx$/.test(file);

    const adminOnlyButScanned = [...adminClosure]
      .filter(file => !publicClosure.has(file))
      .map(toRepoPath)
      .filter(file => isComponent(file) && isScanned(frontend, file))
      .sort();

    expect(
      adminOnlyButScanned,
      'These are only reachable from admin pages, so scanning them in ' +
        'resources/css/index.css grows the stylesheet every visitor downloads'
    ).toEqual([]);
  });

  it('excludes colocated test files from both stylesheets', () => {
    const testFile = 'resources/js/Pages/Frontend/Category.test.tsx';

    expect(isScanned(frontend, testFile)).toBe(false);
    expect(isScanned(admin, testFile)).toBe(false);
  });
});
