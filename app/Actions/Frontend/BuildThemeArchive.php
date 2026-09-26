<?php

namespace App\Actions\Frontend;

use App\Models\Theme;
use App\Support\ArchiveSidebarPosts;
use App\Support\ResolvesSeoMeta;
use Inertia\Inertia;
use Inertia\Response;

class BuildThemeArchive
{
    public function __construct(
        protected ResolvesSeoMeta $seo,
        protected ArchiveSidebarPosts $sidebarPosts,
    ) {}

    public function handle(string $slug): Response
    {
        $theme = Theme::query()->where('title', str_replace('-', ' ', $slug))->firstOrFail();
        $posts = $theme->posts()->paginate(10);

        $title = $theme->title ?? $theme->name;
        $sidebar = $this->sidebarPosts->for('archive');

        return Inertia::render('Frontend/Archives/Archive', [
            'meta_title' => $title,
            'meta_description' => $theme->description ?? $theme->name,
            'layout_title' => $title,
            'posts' => $posts,
            'sawteeInMedia' => $sidebar['sawteeInMedia'],
            'infocus' => $sidebar['infocus'],
            'events' => $sidebar['events'],
            'seo' => $this->seo->for(
                title: $title,
                description: $theme->description ?? $theme->name,
            ),
        ]);
    }
}
