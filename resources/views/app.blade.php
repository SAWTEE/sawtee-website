<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-inertia>{{ config('app.name', 'SAWTEE') }}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#006181">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="SAWTEE">

    @isset($lcpImage)
        <link rel="preload" as="image" href="{{ $lcpImage }}" fetchpriority="high"
            @if (!empty($lcpSrcSet))
                imagesrcset="{{ $lcpSrcSet }}"
                imagesizes="(max-width: 1024px) 100vw, 66vw"
            @endif
        >
    @endisset

    <script>
        (function () {
            try {
                const storageKey = 'vite-ui-theme';
                const theme = localStorage.getItem(storageKey) || 'system';
                const root = document.documentElement;

                root.classList.remove('light', 'dark');

                if (theme === 'system') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                } else {
                    root.classList.add(theme);
                }
            } catch (e) {
                // Fallback to light theme
                document.documentElement.classList.add('light');
            }
        })();
    </script>

    @routes(\App\Support\ZiggyConfig::groupFor(request()))
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased bg-zinc-50 dark:bg-background">
    <a href="#main"
        class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-0 focus:z-50 focus:rounded-b-lg focus:bg-theme-500 focus:px-3 focus:py-2 focus:text-base focus:font-medium focus:text-gray-100 focus:outline-none focus:ring-4 focus:ring-sky-500">Skip
        to main content</a>
    @inertia

</body>

</html>
