<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomePageSectionRequest;
use App\Models\HomePageSection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomePageSectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/HomePageSection/Index', [
            'sections' => HomePageSection::orderBy('order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/HomePageSection/Create');
    }

    public function store(HomePageSectionRequest $request): RedirectResponse
    {
        HomePageSection::create($request->validated());

        return to_route('admin.home-page-sections.index')
            ->with('success', 'Section created successfully!');
    }

    public function edit(HomePageSection $homePageSection): Response
    {
        return Inertia::render('Backend/HomePageSection/Edit', [
            'section' => $homePageSection,
        ]);
    }

    public function update(HomePageSectionRequest $request, HomePageSection $homePageSection): RedirectResponse
    {
        $homePageSection->update($request->validated());

        return to_route('admin.home-page-sections.index')
            ->with('success', 'Section updated successfully!');
    }

    public function destroy(HomePageSection $homePageSection): RedirectResponse
    {
        $homePageSection->delete();

        return to_route('admin.home-page-sections.index');
    }
}
