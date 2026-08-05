<?php

namespace App\Actions\Frontend;

use App\Models\Post;
use App\Support\ResolvesSeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchContent
{
    public function __construct(protected ResolvesSeoMeta $seo) {}

    public function handle(Request $request): Response
    {
        $term = trim((string) $request->get('query', ''));

        $posts = Post::search($term)
            ->query(function ($query) {
                $query->join('categories', 'posts.category_id', 'categories.id')
                    ->select([
                        'posts.id',
                        'posts.title',
                        'posts.author',
                        'posts.excerpt',
                        'posts.slug',
                        'categories.name as category',
                        'categories.slug as category_slug',
                    ])
                    ->orderBy('posts.id', 'DESC');
            })
            ->paginate();

        return Inertia::render('Frontend/SearchPage', [
            'posts' => $posts,
            'query' => $term,
            'seo' => $this->seo->for(
                title: $term !== '' ? "Search: {$term}" : 'Search',
                description: 'Search SAWTEE publications, posts, and resources.',
            ),
        ]);
    }
}
