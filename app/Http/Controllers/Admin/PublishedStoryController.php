<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PublishedStoryRequest;
use App\Models\Fellow;
use App\Models\PublishedStory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class PublishedStoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/PublishedStories/Index', [
            'publishedStories' => PublishedStory::with(['fellow:id,name', 'media'])->latest('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/PublishedStories/Create', [
            'fellows' => $this->fellowOptions(),
        ]);
    }

    public function store(PublishedStoryRequest $request): RedirectResponse
    {
        $publishedStory = PublishedStory::create($request->validated());

        $this->syncImages($publishedStory, $request->file('images'));

        return to_route('admin.published-stories.index');
    }

    public function edit(PublishedStory $publishedStory): Response
    {
        return Inertia::render('Backend/PublishedStories/Edit', [
            'fellows' => $this->fellowOptions(),
            'publishedStory' => $publishedStory->load(['fellow:id,name', 'media']),
        ]);
    }

    public function update(PublishedStoryRequest $request, PublishedStory $publishedStory): RedirectResponse
    {
        $this->syncImages($publishedStory, $request->file('images'), replace: true);

        $publishedStory->update($request->validated());

        return to_route('admin.published-stories.index');
    }

    public function destroy(PublishedStory $publishedStory): RedirectResponse
    {
        $publishedStory->delete();

        return to_route('admin.published-stories.index');
    }

    /**
     * @param  array<int, UploadedFile>|null  $images
     */
    private function syncImages(PublishedStory $publishedStory, ?array $images, bool $replace = false): void
    {
        if (! $images) {
            return;
        }

        if ($replace) {
            $publishedStory->clearMediaCollection('published-story-images');
        }

        foreach ($images as $image) {
            $publishedStory->addMedia($image)->toMediaCollection('published-story-images');
        }
    }

    /**
     * @return Collection<int, Fellow>
     */
    private function fellowOptions(): Collection
    {
        return Fellow::without(['fellowship', 'media'])
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }
}
