<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::whereIn('type', ['post', 'publication'])->with(['parent', 'media'])->latest()->get();
        return Inertia::render('Backend/Category/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     return Inertia::render('Backend/Category/Create', ['categories' => Category::all()]);
    // }



    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (!$request->meta_title) {
            $validated['meta_title'] = $validated['name'];
        }

        $category = Category::create($validated);

        if ($request->image) {
            $category->addMediaFromRequest('image')->toMediaCollection('category_media');
        }

        return redirect()->route('admin.categories.index');
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(Category $category)
    // {
    //     $categories = Category::all();
    //     return Inertia::render('Backend/Category/Edit', [
    //         'category' => $category->load('media'),
    //         'categories' => $categories
    //     ]);
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|',
            'type' => 'required|string|max:255|',
            'parent_id' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:255',
        ]);

        if (!$request->meta_title) {
            $validated['meta_title'] = $validated['name'];
        }

        if (!$request->image) {
            $category->clearMediaCollection('category_media');
        }

        if ($request->image) {
            $category->addMediaFromRequest('image')->toMediaCollection('category_media');
        }

        $category->update($validated);
        return redirect()->route('admin.categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index');
    }
}
