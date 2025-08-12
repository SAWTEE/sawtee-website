<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PublishedStory;
use App\Models\Fellow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublishedStoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Backend/PublishedStories/Index", ["publishedStories" => PublishedStory::get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Backend/PublishedStories/Create", ["fellows" => Fellow::get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "link" => "required|string|max:255|url",
            "fellow_id" => "required|exists:fellows,id",
        ]);

        $published_story = PublishedStory::create($validated);

        if ($request->images) {
            foreach ($request->file('images') as $image) {
                $published_story->addMedia($image)->toMediaCollection('published-story-images');
            };
        }

        return to_route("admin.published-stories.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(PublishedStory $publishedStory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PublishedStory $publishedStory)
    {
        return Inertia::render("Backend/PublishedStories/Edit", ["fellows" => Fellow::get(), "publishedStory" => $publishedStory]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PublishedStory $publishedStory)
    {
        // dd($request);
        if ($request->file('images')) {
            $publishedStory->clearMediaCollection('published-story-images');
            foreach ($request->file('images') as $image) {
                $publishedStory->addMedia($image)->toMediaCollection('published-story-images');
            }
        }
        $publishedStory->update($request->all());
        return to_route("admin.published-stories.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PublishedStory $publishedStory)
    {
        $publishedStory->delete();
    }
}
