<?php

namespace App\Support;

use App\Models\Article;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
use Illuminate\Support\Facades\Cache;

class SitemapCache
{
    public const KEY = 'sitemap.xml';

    public const TTL_SECONDS = 3600;

    public function forget(): void
    {
        Cache::forget(self::KEY);
    }

    public function xml(): string
    {
        return Cache::remember(self::KEY, self::TTL_SECONDS, fn () => $this->build());
    }

    protected function build(): string
    {
        $urls = collect();

        $urls->push([
            'loc' => url('/'),
            'lastmod' => now()->toAtomString(),
        ]);

        Page::query()
            ->orderBy('id')
            ->get(['slug', 'updated_at'])
            ->each(function (Page $page) use ($urls) {
                if (in_array($page->slug, ['home', ''], true)) {
                    return;
                }

                $urls->push([
                    'loc' => url('/'.$page->slug),
                    'lastmod' => optional($page->updated_at)->toAtomString(),
                ]);
            });

        Post::query()
            ->with(['category.parent'])
            ->where('status', 'published')
            ->orderBy('id')
            ->get()
            ->each(function (Post $post) use ($urls) {
                $category = $post->category;

                if (! $category) {
                    return;
                }

                $path = $category->parent
                    ? "/category/{$category->parent->slug}/{$category->slug}/{$post->slug}"
                    : "/category/{$category->slug}/{$post->slug}";

                $urls->push([
                    'loc' => url($path),
                    'lastmod' => optional($post->updated_at ?? $post->published_at)->toAtomString(),
                ]);
            });

        Publication::query()
            ->with('category')
            ->orderBy('id')
            ->get()
            ->each(function (Publication $publication) use ($urls) {
                $category = $publication->category;
                $slug = $publication->volume_slug ?: $publication->slug;

                if (! $category || ! $slug) {
                    return;
                }

                $urls->push([
                    'loc' => url("/category/{$category->slug}/{$slug}"),
                    'lastmod' => optional($publication->updated_at)->toAtomString(),
                ]);
            });

        Article::query()
            ->with('publication.category')
            ->orderBy('id')
            ->get()
            ->each(function (Article $article) use ($urls) {
                $publication = $article->publication;
                $category = $publication?->category;
                $volumeSlug = $publication?->volume_slug ?: $publication?->slug;

                if (! $category || ! $volumeSlug || ! $article->slug) {
                    return;
                }

                $urls->push([
                    'loc' => url("/category/{$category->slug}/{$volumeSlug}/{$article->slug}"),
                    'lastmod' => optional($article->updated_at ?? $article->published_at)->toAtomString(),
                ]);
            });

        $body = $urls->map(function (array $entry) {
            $lastmod = $entry['lastmod']
                ? '<lastmod>'.e($entry['lastmod']).'</lastmod>'
                : '';

            return '<url><loc>'.e($entry['loc']).'</loc>'.$lastmod.'</url>';
        })->implode('');

        return '<?xml version="1.0" encoding="UTF-8"?>'
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            .$body
            .'</urlset>';
    }
}
