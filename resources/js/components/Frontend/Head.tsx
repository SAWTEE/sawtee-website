import { Head, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import type { SeoMeta } from '@/types';

type WebsiteHeadProps = Partial<SeoMeta> & {
  children?: ReactNode;
};

const DEFAULT_DESCRIPTION =
  'South Asia Watch on Trade, Economics and Environment (SAWTEE) — research, dialogue, and advocacy on trade and development.';

const DEFAULT_IMAGE = '/assets/logo-sawtee.webp';

function toAbsoluteUrl(
  path: string | null | undefined,
  appUrl: string
): string {
  if (!path) {
    return toAbsoluteUrl(DEFAULT_IMAGE, appUrl);
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base =
    appUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    '';

  if (!base) {
    return path;
  }

  try {
    return new URL(path, base.endsWith('/') ? base : `${base}/`).href;
  } catch {
    return path;
  }
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
  const { app_url: appUrl = '' } = usePage().props as { app_url?: string };

  const resolvedTitle = title?.trim() || 'SAWTEE';
  const resolvedDescription = description?.trim() || DEFAULT_DESCRIPTION;
  const resolvedImage = toAbsoluteUrl(image ?? DEFAULT_IMAGE, appUrl);
  const resolvedUrl = toAbsoluteUrl(url ?? '/', appUrl);
  const brandedTitle = withBrandTitle(resolvedTitle);

  return (
    <Head>
      <title>{resolvedTitle}</title>
      <meta
        head-key="description"
        name="description"
        content={resolvedDescription}
      />
      <link head-key="canonical" rel="canonical" href={resolvedUrl} />

      <meta head-key="og:title" property="og:title" content={brandedTitle} />
      <meta head-key="og:type" property="og:type" content={type} />
      <meta
        head-key="og:description"
        property="og:description"
        content={resolvedDescription}
      />
      <meta head-key="og:image" property="og:image" content={resolvedImage} />
      <meta
        head-key="og:image:secure_url"
        property="og:image:secure_url"
        content={resolvedImage}
      />
      <meta
        head-key="og:image:alt"
        property="og:image:alt"
        content={brandedTitle}
      />
      <meta
        head-key="og:image:width"
        property="og:image:width"
        content="1200"
      />
      <meta
        head-key="og:image:height"
        property="og:image:height"
        content="630"
      />
      <meta head-key="og:url" property="og:url" content={resolvedUrl} />
      <meta
        head-key="og:site_name"
        property="og:site_name"
        content="SOUTH ASIA WATCH ON TRADE, ECONOMICS AND ENVIRONMENT"
      />
      <meta head-key="og:locale" property="og:locale" content="en_US" />

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
      <meta
        head-key="twitter:image:alt"
        name="twitter:image:alt"
        content={brandedTitle}
      />
      <meta head-key="twitter:site" name="twitter:site" content="@sawteenp" />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
      {children}
    </Head>
  );
};

export default WebsiteHead;
