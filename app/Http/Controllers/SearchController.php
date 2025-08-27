<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $query = $request->query();

        $posts = Post::search(trim($request->get('query')) ?? '')
            ->query(function ($query) {
                $query->join('categories', 'posts.category_id', 'categories.id')
                    ->select([
                        'posts.id',
                        'posts.title',
                        'posts.author',
                        'posts.excerpt',
                        'posts.slug',
                        'categories.name as category',
                        'categories.slug as category_slug'
                    ])
                    ->orderBy('posts.id', 'DESC');
            })
            ->paginate();
            // dd($data);
        return Inertia::render('Frontend/SearchPage', ['posts' => $posts, 'query' => $query['query']]);
        // return response()->json(data: $posts, status: 200);
    }
}
