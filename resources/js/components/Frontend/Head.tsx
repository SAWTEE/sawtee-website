import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { SeoMeta } from '@/types';

type WebsiteHeadProps = Partial<SeoMeta> & {
  children?: ReactNode;
};

const WebsiteHead = ({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
  children,
}: WebsiteHeadProps) => {
  const resolvedTitle = title ?? 'SAWTEE';
  const resolvedDescription = description ?? '';
  const resolvedImage = image ?? '/assets/logo-sawtee.webp';
  const resolvedUrl = url ?? '/';

  return (
    <Head>
      <title>{resolvedTitle}</title>
      <meta httpEquiv="imagetoolbar" content="no" />
      <meta head-key="description" name="description" content={resolvedDescription} />
      <meta head-key="imagetoolbar" httpEquiv="imagetoolbar" content="no" />
      <meta
        head-key="og:title"
        property="og:title"
        content={`SAWTEE | ${resolvedTitle}`}
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
      <meta property="fb:app_id" content="SAWTEENP" />
      <meta name="twitter:site" content="@sawteebnp" />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
      {children}
    </Head>
  );
};

export default WebsiteHead;
