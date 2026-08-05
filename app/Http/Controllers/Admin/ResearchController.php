<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ResearchRequest;
use App\Models\File;
use App\Models\Research;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ResearchController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Research/Index', [
            'researchs' => Research::with(['media', 'file'])->orderByDesc('year')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Research/Create');
    }

    public function store(ResearchRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['title'], '-');
        $validated['meta_title'] ??= $validated['title'];

        $research = Research::create($validated);

        if ($request->hasFile('image')) {
            $research->addMediaFromRequest('image')->toMediaCollection('research_featured_image');
        }

        $this->replaceFile($research, $request->file('file'));

        return to_route('admin.research.index');
    }

    public function edit(Research $research): Response
    {
        return Inertia::render('Backend/Research/Edit', [
            'research' => $research->load('media', 'file'),
        ]);
    }

    public function update(ResearchRequest $request, Research $research): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['title'], '-');
        $validated['meta_title'] ??= $validated['title'];

        if ($request->hasFile('image')) {
            $research->clearMediaCollection('research_featured_image');
            $research->addMediaFromRequest('image')->toMediaCollection('research_featured_image');
        }

        $this->replaceFile($research, $request->file('file'));

        $research->update($validated);

        return to_route('admin.research.index');
    }

    public function destroy(Research $research): RedirectResponse
    {
        $research->delete();

        return to_route('admin.research.index');
    }

    private function replaceFile(Research $research, ?UploadedFile $upload): void
    {
        if (! $upload) {
            return;
        }

        $research->file()->delete();

        $name = $upload->getClientOriginalName();
        $upload->move(public_path('Research_Reports'), $name);

        $file = new File;
        $file->name = $name;
        $file->path = public_path('Research_Reports/'.$name);

        $research->file()->save($file);
    }
}
