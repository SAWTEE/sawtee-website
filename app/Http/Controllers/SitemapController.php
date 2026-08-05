<?php

namespace App\Http\Controllers;

use App\Support\SitemapCache;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(SitemapCache $sitemap): Response
    {
        return response($sitemap->xml(), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
