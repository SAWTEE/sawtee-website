<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AttachesUploadedMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use AttachesUploadedMedia;

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
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $validated['meta_title'] ??= $validated['name'];

            $category = Category::create($validated);

            $this->attachImageFromRequest($category, $request, 'category_media');

            return to_route('admin.categories.index');
        });
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        return DB::transaction(function () use ($request, $category) {
            $validated = $request->validated();
            $validated['meta_title'] ??= $validated['name'];

            if ($request->hasFile('image')) {
                $this->attachImageFromRequest($category, $request, 'category_media');
            } elseif ($request->mediaWasCleared()) {
                $category->clearMediaCollection('category_media');
            }

            $category->update($validated);

            return to_route('admin.categories.index');
        });
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return to_route('admin.categories.index');
    }
}
