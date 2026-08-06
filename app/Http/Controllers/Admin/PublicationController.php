<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PublicationRequest;
use App\Models\Category;
use App\Models\File;
use App\Models\Publication;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicationController extends Controller
{
    public function index(Request $request): Response
    {
        $root = Category::with('children')
            ->where('name', 'publications')
            ->whereNull('parent_id')
            ->firstOrFail();

        $subcategory = $request->category_id
            ? Category::ofType('publication')->with('children')->findOrFail($request->category_id)
            : $root->children->first();

        $categoryIds = $subcategory
            ? ($subcategory->getCategoriesIds($subcategory) ?? [])
            : [];

        // The listing table shows no cover or attachment, so the model's default
        // media/file eager loads are skipped here.
        $publications = Publication::without(['media', 'file'])
            ->with(['category:id,name,slug', 'tags'])
            ->whereIn('category_id', $categoryIds)
            ->latest('id')
            ->get();

        return Inertia::render('Backend/Publication/Index', [
            'publications' => $publications,
            'categories' => $this->flattenTree($root),
            'categoryID' => $subcategory?->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Publication/Create', [
            'categories' => $this->categoryOptions(),
            'tags' => $this->tagOptions(),
        ]);
    }

    public function store(PublicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $publication = new Publication($validated);
        $publication->slug = $this->buildSlug($validated);
        $publication->save();

        if ($request->hasFile('image')) {
            $publication->addMediaFromRequest('image')->toMediaCollection('publication_featured_image');
        }

        $publication->tags()->sync($validated['tags'] ?? []);

        $this->replaceFile($publication, $request->file('file'));

        return to_route('admin.publications.index');
    }

    public function edit(Publication $publication): Response
    {
        return Inertia::render('Backend/Publication/Edit', [
            'publication' => $publication->load(['media', 'file', 'tags']),
            'categories' => $this->categoryOptions(),
            'tags' => $this->tagOptions(),
        ]);
    }

    public function update(PublicationRequest $request, Publication $publication): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->has('tags')) {
            $publication->tags()->sync($validated['tags'] ?? []);
        }

        if ($request->hasFile('image')) {
            $publication->addMediaFromRequest('image')->toMediaCollection('publication_featured_image');
        } elseif ($request->mediaWasCleared()) {
            $publication->clearMediaCollection('publication_featured_image');
        }

        $this->replaceFile($publication, $request->file('file'));

        $publication->fill($validated);
        $publication->slug = $this->buildSlug($validated);
        $publication->save();

        return to_route('admin.publications.index');
    }

    public function destroy(Publication $publication): RedirectResponse
    {
        $publication->delete();

        return to_route('admin.publications.index');
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function buildSlug(array $validated): string
    {
        return Str::slug(trim($validated['title'].' '.($validated['subtitle'] ?? '')));
    }

    private function replaceFile(Publication $publication, ?UploadedFile $upload): void
    {
        if (! $upload) {
            return;
        }

        $publication->file()->delete();

        $name = $upload->getClientOriginalName();
        $upload->move(public_path('publications'), $name);

        $file = new File;
        $file->name = $name;
        $file->path = public_path('publications/'.$name);

        $publication->file()->save($file);
    }

    /**
     * The category filter lists the "publications" root followed by its whole subtree,
     * which is already loaded, so no extra query per node is needed.
     *
     * @return array<int, Category>
     */
    private function flattenTree(Category $category): array
    {
        $flattened = [$category];

        foreach ($category->children as $child) {
            $flattened = [...$flattened, ...$this->flattenTree($child)];
        }

        return $flattened;
    }

    /**
     * @return Collection<int, Category>
     */
    private function categoryOptions(): Collection
    {
        return Category::ofType('publication')
            ->select(['id', 'name', 'slug', 'parent_id'])
            ->orderBy('name')
            ->get();
    }

    /**
     * @return Collection<int, Tag>
     */
    private function tagOptions(): Collection
    {
        return Tag::select(['id', 'name'])->orderBy('name')->get();
    }
}
