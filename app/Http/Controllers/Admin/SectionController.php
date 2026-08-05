<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SectionRequest;
use App\Models\Page;
use App\Models\Section;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function index(): Response
    {
        $sections = Section::with(['page:id,name', 'parent:id,title'])
            ->latest('id')
            ->get();

        return Inertia::render('Backend/Section/Index', [
            'sections' => $sections,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Section/Create', [
            'sections' => $this->sectionOptions(),
            'pages' => $this->pageOptions(),
        ]);
    }

    public function store(SectionRequest $request): RedirectResponse
    {
        $section = Section::create($request->validated());

        if ($request->hasFile('image')) {
            $section->addMediaFromRequest('image')->toMediaCollection('section-media');
        }

        return to_route('admin.sections.index');
    }

    public function edit(Section $section): Response
    {
        return Inertia::render('Backend/Section/Edit', [
            'section' => $section->load('media'),
            'sections' => $this->sectionOptions(),
            'pages' => $this->pageOptions(),
        ]);
    }

    public function update(SectionRequest $request, Section $section): RedirectResponse
    {
        if ($request->hasFile('image')) {
            $section->clearMediaCollection('section-media');
            $section->addMediaFromRequest('image')->toMediaCollection('section-media');
        } elseif ($request->mediaWasCleared()) {
            $section->clearMediaCollection('section-media');
        }

        $section->update($request->validated());

        return to_route('admin.sections.index');
    }

    public function destroy(Section $section): RedirectResponse
    {
        $section->delete();

        return to_route('admin.sections.index');
    }

    /**
     * @return Collection<int, Section>
     */
    private function sectionOptions(): Collection
    {
        return Section::select(['id', 'title', 'page_id'])->orderBy('title')->get();
    }

    /**
     * @return Collection<int, Page>
     */
    private function pageOptions(): Collection
    {
        return Page::select(['id', 'name', 'slug'])->orderBy('name')->get();
    }
}
