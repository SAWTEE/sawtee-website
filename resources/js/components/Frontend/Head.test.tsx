import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import WebsiteHead from './Head';

let latestHeadChildren: ReactNode = null;

vi.mock('@inertiajs/react', () => ({
  Head: ({ children }: { children?: ReactNode }) => {
    latestHeadChildren = children;
    return <div data-testid="inertia-head" />;
  },
}));

function collectText(node: ReactNode, into: string[] = []): string[] {
  if (node == null || typeof node === 'boolean') {
    return into;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    into.push(String(node));
    return into;
  }
  if (Array.isArray(node)) {
    node.forEach(child => collectText(child, into));
    return into;
  }
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode; content?: string; property?: string; name?: string }>;
    if (element.props.content) {
      into.push(String(element.props.content));
    }
    if (element.props.property) {
      into.push(String(element.props.property));
    }
    if (element.props.name) {
      into.push(String(element.props.name));
    }
    collectText(element.props.children, into);
  }
  return into;
}

describe('WebsiteHead', () => {
  it('accepts typed SEO props including title and description', () => {
    render(
      <WebsiteHead
        title="Trade Insight"
        description="A short summary"
        image="/assets/logo-sawtee.webp"
        url="https://example.test/post"
        type="article"
      />
    );

    const text = collectText(latestHeadChildren).join(' ');
    expect(text).toContain('Trade Insight');
    expect(text).toContain('A short summary');
    expect(text).toContain('og:title');
    expect(text).toContain('/assets/logo-sawtee.webp');
  });

  it('embeds JSON-LD when provided', () => {
    render(
      <WebsiteHead
        title="Article"
        description="Body"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Article',
        }}
      />
    );

    const text = collectText(latestHeadChildren).join(' ');
    expect(text).toContain('"@type":"Article"');
  });
});
