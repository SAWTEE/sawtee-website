<?php

namespace App\Support;

use App\Models\Post;

class ArchiveSidebarPosts
{
    /**
     * Sidebar lists for an archive. Each list is only loaded when that widget
     * is shown, and each row is limited to the fields the widget renders.
     *
     * Policy outreach (featured events) shows SAWTEE in Media and In Focus.
     * Those two archives swap in Featured Events and drop their own list.
     * Every other archive shows Featured Events and In Focus.
     * Newsletters show only Featured Events beside the Substack feed.
     *
     * @return array{
     *     events: list<array{id: int, title: string, slug: string, published_at: string|null, category: array{slug: string|null}}>|null,
     *     sawteeInMedia: list<array{id: int, title: string, slug: string, published_at: string|null, category: array{slug: string|null}}>|null,
     *     infocus: list<array{id: int, title: string, slug: string, published_at: string|null, category: array{slug: string|null}}>|null
     * }
     */
    public function for(string $slug): array
    {
        $lists = [
            'events' => null,
            'sawteeInMedia' => null,
            'infocus' => null,
        ];

        foreach ($this->categoriesFor($slug) as $key => $categorySlug) {
            $lists[$key] = $this->posts($categorySlug);
        }

        return $lists;
    }

    /**
     * @return array<string, string>
     */
    private function categoriesFor(string $slug): array
    {
        if (str_contains($slug, 'newsletters')) {
            return ['events' => 'featured-events'];
        }

        if (str_contains($slug, 'featured-events')) {
            return [
                'sawteeInMedia' => 'sawtee-in-media',
                'infocus' => 'in-focus',
            ];
        }

        if (str_contains($slug, 'sawtee-in-media')) {
            return [
                'events' => 'featured-events',
                'infocus' => 'in-focus',
            ];
        }

        if (str_contains($slug, 'in-focus') || str_contains($slug, 'infocus')) {
            return [
                'events' => 'featured-events',
                'sawteeInMedia' => 'sawtee-in-media',
            ];
        }

        return [
            'events' => 'featured-events',
            'infocus' => 'in-focus',
        ];
    }

    /**
     * @return list<array{id: int, title: string, slug: string, published_at: string|null, category: array{slug: string|null}}>
     */
    private function posts(string $slug): array
    {
        return Post::query()
            ->select(['id', 'title', 'slug', 'published_at', 'category_id'])
            ->with('category:id,slug')
            ->whereHas('category', fn ($query) => $query->where('slug', $slug))
            ->where('status', 'published')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Post $post): array => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'published_at' => $post->published_at?->toIso8601String(),
                'category' => [
                    'slug' => $post->category?->slug,
                ],
            ])
            ->all();
    }
}
