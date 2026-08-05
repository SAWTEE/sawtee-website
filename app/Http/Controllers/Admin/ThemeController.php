<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ThemeRequest;
use App\Models\Theme;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ThemeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Theme/Index', [
            'themes' => Theme::withCount('posts')->latest()->get(),
        ]);
    }

    public function store(ThemeRequest $request): RedirectResponse
    {
        Theme::create($request->validated());

        return to_route('admin.themes.index');
    }

    public function update(ThemeRequest $request, Theme $theme): RedirectResponse
    {
        $theme->update($request->validated());

        return to_route('admin.themes.index');
    }

    public function destroy(Theme $theme): RedirectResponse
    {
        $theme->delete();

        return to_route('admin.themes.index');
    }
}
