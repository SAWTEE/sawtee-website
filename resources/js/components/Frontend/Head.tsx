import { Head } from '@inertiajs/react';

const WebsiteHead = ({ title, description, image, url, children }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="imagetoolbar" content="no" />
      <meta head-key="description" name="description" content={description} />
      <meta head-key="imagetoolbar" httpEquiv="imagetoolbar" content="no" />
      <meta
        head-key="og:title"
        property="og:title"
        content={`SAWTEE | ${title}`}
      />
      <meta head-key="og:type" property="og:type" content="article" />
      <meta
        head-key="og:description"
        property="og:description"
        content={description}
      />
      <meta
        head-key="og:image"
        property="og:image"
        content={image ?? '/assets/logo.png'}
      />
      <meta head-key="og:url" property="og:url" content={url ?? '/'} />
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
      <meta property="og:image" content="{{asset('images/logo.png')}}" />
      {children}
    </Head>
  );
};

export default WebsiteHead;
