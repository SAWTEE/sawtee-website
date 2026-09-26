<?php

namespace App\Actions\Frontend;

use App\Models\Tag;
use App\Support\ArchiveSidebarPosts;
use App\Support\ResolvesSeoMeta;
use Inertia\Inertia;
use Inertia\Response;

class BuildTagArchive
{
    public function __construct(
        protected ResolvesSeoMeta $seo,
        protected ArchiveSidebarPosts $sidebarPosts,
    ) {}

    public function handle(string $slug): Response
    {
        $tag = Tag::query()->where('name', str_replace('-', ' ', $slug))->firstOrFail();
        $posts = $tag->posts()->paginate(10);
        $sidebar = $this->sidebarPosts->for('archive');

        return Inertia::render('Frontend/Archives/Archive', [
            'meta_title' => $tag->title ?? $tag->name,
            'meta_description' => $tag->description ?? $tag->name,
            'layout_title' => $tag->name,
            'posts' => $posts,
            'sawteeInMedia' => $sidebar['sawteeInMedia'],
            'infocus' => $sidebar['infocus'],
            'events' => $sidebar['events'],
            'seo' => $this->seo->for(
                title: $tag->title ?? $tag->name,
                description: $tag->description ?? $tag->name,
            ),
        ]);
    }
}
