<?php

namespace App\Actions\Frontend;

use App\Models\Post;
use App\Models\Theme;
use App\Support\ResolvesSeoMeta;
use Inertia\Inertia;
use Inertia\Response;

class BuildThemeArchive
{
    public function __construct(protected ResolvesSeoMeta $seo) {}

    public function handle(string $slug): Response
    {
        $theme = Theme::query()->where('title', str_replace('-', ' ', $slug))->firstOrFail();
        $posts = $theme->posts()->paginate(10);

        $title = $theme->title ?? $theme->name;

        return Inertia::render('Frontend/Archives/Archive', [
            'meta_title' => $title,
            'meta_description' => $theme->description ?? $theme->name,
            'layout_title' => $title,
            'posts' => $posts,
            'sawteeInMedia' => Post::query()
                ->whereHas('category', fn ($query) => $query->where('slug', 'sawtee-in-media'))
                ->where('status', 'published')
                ->latest()
                ->take(5)
                ->get(),
            'seo' => $this->seo->for(
                title: $title,
                description: $theme->description ?? $theme->name,
            ),
        ]);
    }
}
