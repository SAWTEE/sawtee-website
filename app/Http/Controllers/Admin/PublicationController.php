<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use App\Models\Category;
use App\Models\File;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PublicationController extends Controller
{
  /**
   * Display a listing of the resource.
   */
    public function index(Request $request)
  {
        $publications = null;
        $category = Category::where('name', 'publications')->where('parent_id', null)->first();
        $categoriesIDs = $category->getCategoriesIds($category);
        $categories = array();
        foreach($categoriesIDs as $id) {
            $categories[] = Category::find($id);
        }
        $subcategory = $request->category_id ? Category::where('type', 'publication')->find($request->category_id) : $category->children()->first();
        $childrenIDs = $subcategory->children->pluck('id')->toArray();
        $parent_and_subcategory_ids = array_merge(array($subcategory->id), $childrenIDs);

        $publications = Publication::with(['category', 'tags'])
        ->whereIn('category_id', $parent_and_subcategory_ids)
            ->orderByDesc('id')
            ->get();

        // dd($categories);
        return Inertia::render('Backend/Publication/Index', [
            'publications' => $publications,
            'categories' => $categories,
            'categoryID' => $subcategory->id,
        ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    $categories = Category::where('type', 'publication')->get()->all();
    return Inertia::render('Backend/Publication/Create', ['categories' => $categories, 'tags' => Tag::all()]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'category_id' => 'required|numeric|exists:categories,id',
      'title' => 'required|string|max:255',
      'slug' => 'nullable|string|unique:pubications|max:255',
      'subtitle' => 'nullable|string|max:255',
      'description' => 'nullable|string|max:2000',
      'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
      'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
    ]);
    $slug = $validated['title'] . ' ' . $validated['subtitle'];

    $validated['slug'] = Str::slug($slug, '-');
    $publication = Publication::create($validated);

        if (!$request->image) {
            $publication->clearMediaCollection('publication_featured_image');
        }

    if ($request->hasFile('image')) {
      $publication->addMediaFromRequest('image')->toMediaCollection('publication_featured_image');
    }
    if ($request->has('tags')) {
        $publication->tags()->attach($request->tags);
    }

    if ($request->file('file')) {
      $name = $request->file('file')->getClientOriginalName();
      $path = $request->file('file')->move(public_path('publications'), $name);
      $file = new File();
      $file->path = $path;
      $file->name = $name;
      $publication->file()->save($file);
    }
    return redirect()->route('admin.publications.index');
  }

  /**
   * Display the specified resource.
   */
  public function show(Publication $publication)
  {
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Publication $publication)
  {
    $categories = Category::where('type', 'publication')->get();
    return Inertia::render('Backend/Publication/Edit', ['publication' => $publication->load('media', 'file', 'tags'), 'categories' => $categories, 'tags' => Tag::all()]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Publication $publication)
  {
    $validated = $request->validate([
      'category_id' => 'required|numeric|exists:categories,id',
      'title' => 'required|string|max:255',
      'slug' => 'nullable|string|unique:pubications|max:255',
      'subtitle' => 'nullable|string|max:255',
      'description' => 'nullable|string|max:2000',
    ]);
    $slug = $validated['title'] . ' ' . $validated['subtitle'];
    $validated['slug'] = Str::slug($slug, '-');

    if ($request->has('tags')) {
            $publication->tags()->sync($request->tags);
    }
        if (!$request->image) {
            $publication->clearMediaCollection('publication_featured_image');
        }

    if ($request->hasFile('image')) {
      $publication->addMediaFromRequest('image')->toMediaCollection('publication_featured_image');
    }
    if ($request->file('file')) {
      $publication->file()->delete();
      $name = $request->file('file')->getClientOriginalName();
      $path = $request->file('file')->move(public_path('publications'), $name);
      $file = new File();
      $file->path = $path;
      $file->name = $name;
      $publication->file()->save($file);
    }
    $publication->update($request->all());

    return redirect()->route('admin.publications.index');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Publication $publication)
  {
    $publication->delete();
    return redirect()->route('admin.publications.index');
  }
}
