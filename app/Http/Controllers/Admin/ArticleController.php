<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tag;
use App\Models\TradeInsightVolume;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $articles = Article::with(['tags'])->latest()->get();
        return Inertia::render("Backend/Articles/Index", [
            "articles" => $articles,
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $volumes = TradeInsightVolume::get();
        return Inertia::render("Backend/Articles/Create", ['tags' => Tag::all(), "volumes" => $volumes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "string",
            "trade_insight_volume_id" => 'required|numeric|exists:trade_insight_volumes,id',
            "subtitle" => "string|nullable",
            "excerpt" => "string|nullable",
            "meta_title" => "string|nullable",
            "meta_description" => "string|nullable",
            "author" => "string|nullable",
            "published_at" => "nullable|date",
            "content" => "string|nullable",
        ]);
        $validated['title'] = Str::of($validated['title'])
            ->squish();
        $validated['meta_title'] = $validated['title'];
        $article = Article::create($validated);

        if ($request->has('tags')) {
            $article->tags()->attach($request->tags);
        }
        if ($request->hasFile('image')) {
            $article->addMediaFromRequest('image')->toMediaCollection('article-featured-image');
        }

        $article->save();

        return redirect()->route("admin.articles.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        $volumes = TradeInsightVolume::get();

        return Inertia::render("Backend/Articles/Edit", [
            "article" => $article,
            'tags' => Tag::all(),
            "volumes" => $volumes
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            "title" => "string",
            "trade_insight_volume_id" => 'required|numeric|exists:trade_insight_volumes,id',
            "subtitle" => "string|nullable",
            "excerpt" => "string|nullable",
            "meta_title" => "string|nullable",
            "meta_description" => "string|nullable",
            "author" => "string|nullable",
            "published_at" => "nullable|date",
            "content" => "string|nullable",
        ]);
        $validated['title'] = Str::of($validated['title'])
            ->squish();
        $validated['meta_title'] = $validated['title'];

        if ($request->has('tags')) {
            $article->tags()->attach($request->tags);
        }
        if ($request->hasFile('image')) {
            $article->addMediaFromRequest('image')->toMediaCollection('article-featured-image');
        }

        $article->update($validated);
        $article->save();

        return to_route("admin.articles.index");

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        //
        $article->delete();
        // return redirect()->route('admin.articles.index');
    }
}
