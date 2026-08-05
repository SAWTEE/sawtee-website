<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SliderRequest;
use App\Models\Page;
use App\Models\Slider;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SliderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Slider/Index', [
            'sliders' => Slider::with('page:id,name')->withCount('slides')->latest()->get(),
            'pages' => $this->pageOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Slider/Create');
    }

    public function store(SliderRequest $request): RedirectResponse
    {
        Slider::create($request->validated());

        return to_route('admin.sliders.index');
    }

    public function edit(Slider $slider): Response
    {
        $slider->load(['slides.media']);

        return Inertia::render('Backend/Slider/Edit', [
            'slider' => $slider,
            'slides' => $slider->slides,
            'pages' => $this->pageOptions(),
        ]);
    }

    public function update(SliderRequest $request, Slider $slider): RedirectResponse
    {
        $slider->update($request->validated());

        return to_route('admin.sliders.index');
    }

    public function destroy(Slider $slider): RedirectResponse
    {
        $slider->delete();

        return to_route('admin.sliders.index');
    }

    /**
     * @return Collection<int, Page>
     */
    private function pageOptions(): Collection
    {
        return Page::select(['id', 'name', 'slug'])->orderBy('name')->get();
    }
}
