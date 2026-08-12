{{--
  Crawler-visible Open Graph / Twitter tags for client-only Inertia.
  Social scrapers (Facebook, LinkedIn, X) do not execute JS, so React <Head>
  alone never populates previews when SSR is disabled.
--}}
@php
    $seo = is_array($page['props']['seo'] ?? null) ? $page['props']['seo'] : [];
    $appName = config('app.name', 'SAWTEE');
    $ogTitle = trim((string) ($seo['title'] ?? $appName));
    if ($ogTitle === '') {
        $ogTitle = $appName;
    }
    $brandedTitle = str_starts_with(mb_strtoupper($ogTitle), 'SAWTEE')
        ? $ogTitle
        : 'SAWTEE | '.$ogTitle;
    $ogDescription = trim((string) ($seo['description'] ?? ''));
    if ($ogDescription === '') {
        $ogDescription = 'South Asia Watch on Trade, Economics and Environment (SAWTEE) — research, dialogue, and advocacy on trade and development.';
    }
    $ogImage = (string) ($seo['image'] ?? '');
    if ($ogImage === '') {
        $ogImage = url('/assets/logo-sawtee.webp');
    } elseif (! str_starts_with($ogImage, 'http://') && ! str_starts_with($ogImage, 'https://')) {
        $ogImage = url($ogImage);
    }
    $ogUrl = (string) ($seo['url'] ?? url()->current());
    if ($ogUrl === '') {
        $ogUrl = url()->current();
    } elseif (! str_starts_with($ogUrl, 'http://') && ! str_starts_with($ogUrl, 'https://')) {
        $ogUrl = url($ogUrl);
    }
    $ogType = (string) ($seo['type'] ?? 'website');
    $imageExtension = strtolower(pathinfo(parse_url($ogImage, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
    $ogImageType = match ($imageExtension) {
        'jpg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        default => null,
    };
@endphp
<title data-inertia>{{ $ogTitle }}</title>
<meta name="description" content="{{ $ogDescription }}">
<link rel="canonical" href="{{ $ogUrl }}">

<meta property="og:title" content="{{ $brandedTitle }}">
<meta property="og:type" content="{{ $ogType }}">
<meta property="og:description" content="{{ $ogDescription }}">
<meta property="og:image" content="{{ $ogImage }}">
<meta property="og:image:secure_url" content="{{ $ogImage }}">
<meta property="og:image:alt" content="{{ $brandedTitle }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
@if ($ogImageType)
    <meta property="og:image:type" content="{{ $ogImageType }}">
@endif
<meta property="og:url" content="{{ $ogUrl }}">
<meta property="og:site_name" content="SOUTH ASIA WATCH ON TRADE, ECONOMICS AND ENVIRONMENT">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $brandedTitle }}">
<meta name="twitter:description" content="{{ $ogDescription }}">
<meta name="twitter:image" content="{{ $ogImage }}">
<meta name="twitter:image:alt" content="{{ $brandedTitle }}">
<meta name="twitter:site" content="@sawteenp">
