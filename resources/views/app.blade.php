<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title inertia>{{ config('app.name', 'SAWTEE') }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />

    <!-- Loads default(Inter) google fonts -->
    @googlefonts
    @googlefonts('figtree')
    @googlefonts('code')

    <link defer rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="antialiased bg-zinc-50 dark:bg-background">
    <a  href='#main' class="absolute px-3 py-2 transition-all -translate-y-full focus:translate-y-0 bg-theme-500 text-gray-100 text-base font-medium rounded-b-lg mx-4 focus:outline-none focus:ring-4 focus:ring-sky-500  hover:no-underline hover:bg-theme-700 hover:text-white z-[50]">skip to main content</a>
    @inertia
</body>

</html>
