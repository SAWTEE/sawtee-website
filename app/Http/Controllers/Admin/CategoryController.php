<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::whereIn('type', ['post', 'publication'])
            ->with(['parent:id,name,type', 'media'])
            ->latest()
            ->get();

        return Inertia::render('Backend/Category/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['meta_title'] ??= $validated['name'];

        $category = Category::create($validated);

        if ($request->hasFile('image')) {
            $category->addMediaFromRequest('image')->toMediaCollection('category_media');
        }

        return to_route('admin.categories.index');
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();
        $validated['meta_title'] ??= $validated['name'];

        if ($request->hasFile('image')) {
            $category->addMediaFromRequest('image')->toMediaCollection('category_media');
        } elseif ($request->mediaWasCleared()) {
            $category->clearMediaCollection('category_media');
        }

        $category->update($validated);

        return to_route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return to_route('admin.categories.index');
    }
}
