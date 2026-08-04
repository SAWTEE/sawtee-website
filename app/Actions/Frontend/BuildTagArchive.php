<?php

namespace App\Actions\Frontend;

use App\Models\Post;
use App\Models\Tag;
use App\Support\ResolvesSeoMeta;
use Inertia\Inertia;
use Inertia\Response;

class BuildTagArchive
{
    public function __construct(protected ResolvesSeoMeta $seo) {}

    public function handle(string $slug): Response
    {
        $tag = Tag::query()->where('name', str_replace('-', ' ', $slug))->firstOrFail();
        $posts = $tag->posts()->paginate(10);
        $sawteeInMedia = $this->sawteeInMedia();

        return Inertia::render('Frontend/Archives/Archive', [
            'meta_title' => $tag->title ?? $tag->name,
            'meta_description' => $tag->description ?? $tag->name,
            'layout_title' => $tag->name,
            'posts' => $posts,
            'sawteeInMedia' => $sawteeInMedia,
            'seo' => $this->seo->for(
                title: $tag->title ?? $tag->name,
                description: $tag->description ?? $tag->name,
            ),
        ]);
    }

    protected function sawteeInMedia()
    {
        return Post::query()
            ->whereHas('category', fn ($query) => $query->where('slug', 'sawtee-in-media'))
            ->where('status', 'published')
            ->latest()
            ->take(5)
            ->get();
    }
}
