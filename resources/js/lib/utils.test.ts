import { describe, expect, it } from 'vitest';
import { cn, slugify } from './utils';

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('ignores falsy values', () => {
    expect(cn('btn', false, undefined, 'active')).toBe('btn active');
  });
});

describe('slugify', () => {
  it('slugifies plain text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });
});
