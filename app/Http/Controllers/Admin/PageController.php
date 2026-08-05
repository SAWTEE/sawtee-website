<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Page/Index', [
            'pages' => Page::withCount('sections')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Page/Create');
    }

    public function store(PageRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['meta_title'] ??= $validated['name'];

        $page = Page::create($validated);

        if ($request->hasFile('image')) {
            $page->addMediaFromRequest('image')->toMediaCollection('page-media');
        }

        $this->storePageData($page, $request->file('file'));

        return to_route('admin.pages.index');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Backend/Page/Edit', [
            'page' => $page->load('media'),
        ]);
    }

    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $validated = $request->validated();
        $validated['meta_title'] ??= $validated['name'];

        if ($request->hasFile('image')) {
            $page->addMediaFromRequest('image')->toMediaCollection('page-media');
        } elseif ($request->mediaWasCleared()) {
            $page->getFirstMedia('page-media')?->delete();
        }

        $this->storePageData($page, $request->file('file'));

        $page->update($validated);

        return to_route('admin.pages.index');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return to_route('admin.pages.index');
    }

    /**
     * Templated pages read their layout from an uploaded JSON document.
     */
    private function storePageData(Page $page, ?UploadedFile $upload): void
    {
        if (! $upload) {
            return;
        }

        $filename = $upload->getClientOriginalName();
        $upload->move(public_path('tmp'), $filename);

        $page->pageData = File::json(public_path('tmp/'.$filename));
        $page->save();
    }
}
