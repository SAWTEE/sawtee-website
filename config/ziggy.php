<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ziggy route groups
    |--------------------------------------------------------------------------
    |
    | Public pages only receive front-facing named routes. Guest auth screens
    | get login/password helpers. Authenticated requests get the admin map.
    |
    */

    'groups' => [
        'public' => [
            'home',
            'search',
            'sitemap',
            'page.show',
            'category.show',
            'article.redirect',
            'pwa.offline',
        ],

        'auth' => [
            'login',
            'password.*',
            'verification.*',
        ],

        'admin' => [
            'admin.*',
            'home',
            'login',
            'password.*',
            'verification.*',
        ],
    ],

];
