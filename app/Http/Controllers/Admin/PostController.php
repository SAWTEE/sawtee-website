<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostRequest;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Models\Category;
use App\Models\File;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Theme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Mostafaznv\PdfOptimizer\Enums\PdfSettings;
use Mostafaznv\PdfOptimizer\Laravel\Facade\PdfOptimizer;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $category = Category::ofType('post')
            ->with('children:id,parent_id')
            ->when(
                $request->category_id,
                fn ($query) => $query->whereKey($request->category_id),
            )
            ->firstOrFail();

        // The "programme" bucket only exists to group its children.
        $categoryIds = $category->children->pluck('id')
            ->when(
                $category->slug !== 'programme',
                fn ($ids) => $ids->push($category->id),
            )
            ->all();

        $posts = Post::with(['category:id,name,slug', 'tags', 'theme:id,title'])
            ->whereIn('category_id', $categoryIds)
            ->latest('id')
            ->get();

        return Inertia::render('Backend/Post/Index', [
            'posts' => $posts,
            'categories' => Category::ofType('post')->roots()->select(['id', 'name', 'slug'])->get(),
            'categoryID' => $category->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Post/Create', [
            'categories' => Category::ofType('post')
                ->whereNot('slug', 'programme')
                ->select(['id', 'name', 'slug', 'parent_id'])
                ->get(),
            'themes' => Theme::select(['id', 'title'])->orderBy('title')->get(),
            'tags' => Tag::select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    public function store(PostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['title'] = Str::of($validated['title'])->squish()->toString();
        $validated['meta_title'] = $validated['title'];

        $post = Post::create($validated);

        $post->tags()->sync($validated['tags'] ?? []);

        if ($request->hasFile('image')) {
            $post->addMediaFromRequest('image')->toMediaCollection('post-featured-image');
        }

        if ($request->hasFile('file')) {
            $this->storeOptimizedPostFile($post, $request->file('file'));
        }

        if ($request->hasFile('files')) {
            $this->storeContentFiles($post, $request->file('files'));
        }

        return to_route('admin.posts.index');
    }

    public function edit(Post $post): Response
    {
        $post->load(['category:id,name,slug,parent_id', 'tags', 'postContentFiles', 'media']);

        return Inertia::render('Backend/Post/Edit', [
            'post' => $post,
            'categories' => Category::ofType('post')->select(['id', 'name', 'slug', 'parent_id'])->get(),
            'tags' => Tag::select(['id', 'name'])->orderBy('name')->get(),
            'themes' => Theme::select(['id', 'title'])->orderBy('title')->get(),
        ]);
    }

    public function update(PostRequest $request, Post $post): RedirectResponse
    {
        $validated = $request->validated();
        $validated['title'] = Str::of($validated['title'])->squish()->toString();
        $validated['meta_title'] = $validated['title'];

        if ($request->has('tags')) {
            $post->tags()->sync($validated['tags'] ?? []);
        }

        if ($request->hasFile('image')) {
            $post->addMediaFromRequest('image')->toMediaCollection('post-featured-image');
        } elseif ($request->mediaWasCleared()) {
            $post->clearMediaCollection('post-featured-image');
        }

        if ($request->hasFile('file')) {
            $this->storeOptimizedPostFile($post, $request->file('file'), PdfSettings::DEFAULT);
        }

        if ($request->hasFile('files')) {
            $this->replaceContentFiles($post, $request->file('files'));
        }

        $post->update($validated);

        return to_route('admin.posts.index');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return to_route('admin.posts.index');
    }

    public function uploadmedia(UploadMediaRequest $request): JsonResponse
    {
        $upload = $request->file('file');

        $fileName = $upload->getClientOriginalName();
        $path = $upload->storeAs('uploads', $fileName, 'public');

        return response()->json([
            'location' => "/storage/$path",
            'text' => $fileName,
        ]);
    }

    private function storeOptimizedPostFile(Post $post, UploadedFile $upload, PdfSettings $settings = PdfSettings::SCREEN): void
    {
        $outputFilePath = public_path('tmp/'.$upload->getClientOriginalName());

        $result = PdfOptimizer::open($upload)
            ->settings($settings)
            ->colorImageResolution(144)
            ->downSampleColorImages(true)
            ->optimize($outputFilePath);

        if ($result->status) {
            $post->addMedia($outputFilePath)->toMediaCollection('post-files');
        }
    }

    /**
     * @param  array<int, UploadedFile>  $uploads
     */
    private function storeContentFiles(Post $post, array $uploads): void
    {
        foreach ($uploads as $upload) {
            $filename = $upload->getClientOriginalName();
            $outputFile = public_path('Featured_Events/'.$filename);

            $result = PdfOptimizer::open($upload)
                ->settings(PdfSettings::SCREEN)
                ->colorImageResolution(144)
                ->downSampleColorImages(true)
                ->optimize($outputFile);

            if (! $result->status) {
                continue;
            }

            $document = new File;
            $document->name = $filename;
            $document->path = $outputFile;

            $post->postContentFiles()->save($document);
        }
    }

    /**
     * @param  array<int, UploadedFile>  $uploads
     */
    private function replaceContentFiles(Post $post, array $uploads): void
    {
        foreach ($post->postContentFiles()->get() as $existing) {
            if (Storage::disk('events')->exists($existing->path)) {
                unlink($existing->path);
            }

            $existing->delete();
        }

        $this->storeContentFiles($post, $uploads);
    }
}
