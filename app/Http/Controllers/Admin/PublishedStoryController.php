<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AttachesUploadedMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PublishedStoryRequest;
use App\Models\Fellow;
use App\Models\PublishedStory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PublishedStoryController extends Controller
{
    use AttachesUploadedMedia;

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
        return DB::transaction(function () use ($request) {
            $publishedStory = PublishedStory::create($request->validated());

            $this->attachImages(
                $publishedStory,
                $request->file('images'),
                'published-story-images',
            );

            return to_route('admin.published-stories.index');
        });
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
        return DB::transaction(function () use ($request, $publishedStory) {
            if ($request->hasFile('images')) {
                $this->attachImages(
                    $publishedStory,
                    $request->file('images'),
                    'published-story-images',
                    replace: true,
                );
            } elseif ($request->mediaWasCleared('images')) {
                $publishedStory->clearMediaCollection('published-story-images');
            }

            $publishedStory->update($request->validated());

            return to_route('admin.published-stories.index');
        });
    }

    public function destroy(PublishedStory $publishedStory): RedirectResponse
    {
        $publishedStory->delete();

        return to_route('admin.published-stories.index');
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
