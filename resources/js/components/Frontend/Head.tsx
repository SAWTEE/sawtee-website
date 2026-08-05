import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { SeoMeta } from '@/types';

type WebsiteHeadProps = Partial<SeoMeta> & {
  children?: ReactNode;
};

const DEFAULT_DESCRIPTION =
  'South Asia Watch on Trade, Economics and Environment (SAWTEE) — research, dialogue, and advocacy on trade and development.';

const DEFAULT_IMAGE = '/assets/logo-sawtee.webp';

function toAbsoluteUrl(path: string | null | undefined): string {
  if (!path) {
    return toAbsoluteUrl(DEFAULT_IMAGE);
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(path, window.location.origin).href;
  }

  return path;
}

function withBrandTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'SAWTEE';
  }
  if (/^SAWTEE\b/i.test(trimmed)) {
    return trimmed;
  }
  return `SAWTEE | ${trimmed}`;
}

const WebsiteHead = ({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
  children,
}: WebsiteHeadProps) => {
  const resolvedTitle = title?.trim() || 'SAWTEE';
  const resolvedDescription =
    description?.trim() || DEFAULT_DESCRIPTION;
  const resolvedImage = toAbsoluteUrl(image ?? DEFAULT_IMAGE);
  const resolvedUrl = toAbsoluteUrl(url ?? '/');
  const brandedTitle = withBrandTitle(resolvedTitle);

  return (
    <Head>
      <title>{resolvedTitle}</title>
      <meta head-key="description" name="description" content={resolvedDescription} />
      <meta
        head-key="og:title"
        property="og:title"
        content={brandedTitle}
      />
      <meta head-key="og:type" property="og:type" content={type} />
      <meta
        head-key="og:description"
        property="og:description"
        content={resolvedDescription}
      />
      <meta head-key="og:image" property="og:image" content={resolvedImage} />
      <meta head-key="og:url" property="og:url" content={resolvedUrl} />
      <meta
        head-key="og:site_name"
        property="og:site_name"
        content="SOUTH ASIA WATCH ON TRADE, ECONOMICS AND ENVIRONMENT"
      />
      <meta
        head-key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        head-key="twitter:title"
        name="twitter:title"
        content={brandedTitle}
      />
      <meta
        head-key="twitter:description"
        name="twitter:description"
        content={resolvedDescription}
      />
      <meta
        head-key="twitter:image"
        name="twitter:image"
        content={resolvedImage}
      />
      <meta name="twitter:site" content="@sawteebnp" />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
      {children}
    </Head>
  );
};

export default WebsiteHead;
