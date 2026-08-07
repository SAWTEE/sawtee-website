<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AttachesUploadedMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleRequest;
use App\Models\Article;
use App\Models\Publication;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    use AttachesUploadedMedia;

    public function index(): Response
    {
        return Inertia::render('Backend/Articles/Index', [
            'articles' => Article::with(['tags', 'media'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Articles/Create', [
            'tags' => $this->tagOptions(),
            'volumes' => $this->tradeInsightVolumes(),
        ]);
    }

    public function store(ArticleRequest $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $validated['title'] = Str::of($validated['title'])->squish()->toString();
            $validated['meta_title'] = $validated['title'];

            $article = Article::create($validated);

            $article->tags()->sync($validated['tags'] ?? []);

            $this->attachImageFromRequest($article, $request, 'article-featured-image');

            return to_route('admin.articles.index');
        });
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Backend/Articles/Edit', [
            'article' => $article->load(['tags', 'media']),
            'tags' => $this->tagOptions(),
            'volumes' => $this->tradeInsightVolumes(),
        ]);
    }

    public function update(ArticleRequest $request, Article $article): RedirectResponse
    {
        return DB::transaction(function () use ($request, $article) {
            $validated = $request->validated();
            $validated['title'] = Str::of($validated['title'])->squish()->toString();
            $validated['meta_title'] = $validated['title'];

            if ($request->has('tags')) {
                $article->tags()->sync($validated['tags'] ?? []);
            }

            $this->attachImageFromRequest($article, $request, 'article-featured-image');

            $article->update($validated);

            return to_route('admin.articles.index');
        });
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        return to_route('admin.articles.index');
    }

    /**
     * @return Collection<int, Tag>
     */
    private function tagOptions(): Collection
    {
        return Tag::select(['id', 'name'])->orderBy('name')->get();
    }

    /**
     * Trade Insight issues are the only publications an article can belong to; the
     * select only needs the volume label.
     *
     * @return Collection<int, Publication>
     */
    private function tradeInsightVolumes(): Collection
    {
        return Publication::without(['media', 'file'])
            ->select(['id', 'volume'])
            ->whereHas('category', fn ($query) => $query->where('slug', 'trade-insight'))
            ->orderByDesc('id')
            ->get();
    }
}
