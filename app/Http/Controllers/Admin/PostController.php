<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AttachesUploadedMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BatchDestroyPostsRequest;
use App\Http\Requests\Admin\BatchTrashedPostsRequest;
use App\Http\Requests\Admin\PostRequest;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Models\Category;
use App\Models\EditorUpload;
use App\Models\File;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Theme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;
use Mostafaznv\PdfOptimizer\Enums\PdfSettings;
use Mostafaznv\PdfOptimizer\Laravel\Facade\PdfOptimizer;

class PostController extends Controller
{
    use AttachesUploadedMedia;

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
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $validated['title'] = Str::of($validated['title'])->squish()->toString();
            $validated['meta_title'] = $validated['title'];

            $post = Post::create($validated);

            $post->tags()->sync($validated['tags'] ?? []);

            $this->attachImageFromRequest($post, $request, 'post-featured-image');

            if ($request->hasFile('file')) {
                $this->storeOptimizedPostFile($post, $request->file('file'));
            }

            if ($request->hasFile('files')) {
                $this->storeContentFiles($post, $request->file('files'));
            }

            return to_route('admin.posts.index');
        });
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
        return DB::transaction(function () use ($request, $post) {
            $validated = $request->validated();
            $validated['title'] = Str::of($validated['title'])->squish()->toString();
            $validated['meta_title'] = $validated['title'];

            if ($request->has('tags')) {
                $post->tags()->sync($validated['tags'] ?? []);
            }

            if ($request->hasFile('image')) {
                $this->attachImageFromRequest($post, $request, 'post-featured-image');
            } elseif ($request->mediaWasCleared()) {
                $post->clearMediaCollection('post-featured-image');
            }

            if ($request->hasFile('file')) {
                $post->clearMediaCollection('post-files');
                $this->storeOptimizedPostFile($post, $request->file('file'), PdfSettings::DEFAULT);
            } elseif ($request->mediaWasCleared('file')) {
                $post->clearMediaCollection('post-files');
            }

            if ($request->hasFile('files')) {
                $this->replaceContentFiles($post, $request->file('files'));
            } elseif ($request->mediaWasCleared('files')) {
                $post->postContentFiles->each->delete();
            } elseif (! empty($validated['remove_content_file_ids'] ?? [])) {
                $post->postContentFiles()
                    ->whereIn('id', $validated['remove_content_file_ids'])
                    ->get()
                    ->each->delete();
            }

            unset($validated['remove_content_file_ids']);

            $post->update($validated);

            return to_route('admin.posts.index');
        });
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return to_route('admin.posts.index');
    }

    public function batchDestroy(BatchDestroyPostsRequest $request): RedirectResponse
    {
        Post::destroy($request->validated('ids'));

        return to_route('admin.posts.index');
    }

    public function trash(): Response
    {
        $posts = Post::onlyTrashed()
            ->with(['category:id,name,slug', 'tags', 'theme:id,title'])
            ->latest('deleted_at')
            ->get();

        return Inertia::render('Backend/Post/Trash', [
            'posts' => $posts,
        ]);
    }

    public function restore(Post $post): RedirectResponse
    {
        abort_unless($post->trashed(), 404);

        $post->restore();

        return to_route('admin.posts.trash');
    }

    public function batchRestore(BatchTrashedPostsRequest $request): RedirectResponse
    {
        Post::onlyTrashed()
            ->whereIn('id', $request->validated('ids'))
            ->get()
            ->each(fn (Post $post) => $post->restore());

        return to_route('admin.posts.trash');
    }

    public function forceDestroy(Post $post): RedirectResponse
    {
        abort_unless($post->trashed(), 404);

        $post->forceDelete();

        return to_route('admin.posts.trash');
    }

    public function batchForceDestroy(BatchTrashedPostsRequest $request): RedirectResponse
    {
        Post::onlyTrashed()
            ->whereIn('id', $request->validated('ids'))
            ->get()
            ->each(fn (Post $post) => $post->forceDelete());

        return to_route('admin.posts.trash');
    }

    public function uploadmedia(UploadMediaRequest $request): JsonResponse
    {
        $upload = $request->file('file');
        $originalName = $upload->getClientOriginalName();

        try {
            $optimizedPath = $this->optimizeEditorImage($upload);

            $editorUpload = EditorUpload::query()->create([
                'user_id' => $request->user()?->id,
                'original_name' => $originalName,
            ]);

            $media = $editorUpload
                ->addMedia($optimizedPath)
                ->usingFileName(Str::uuid()->toString().'.webp')
                ->toMediaCollection('editor-images');

            @unlink($optimizedPath);

            $location = parse_url($media->getUrl(), PHP_URL_PATH) ?: $media->getUrl();

            return response()->json([
                'location' => $location,
                'text' => $originalName,
            ]);
        } catch (\Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'file' => 'The image could not be processed. Please upload a smaller JPEG/PNG/WebP (max 2MB).',
            ]);
        }
    }

    /**
     * Compress and convert an editor image to WebP before storing in media-library.
     * Old TinyMCE embeds under /storage/uploads remain untouched on disk.
     */
    private function optimizeEditorImage(UploadedFile $upload): string
    {
        $directory = storage_path('app/tmp');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $target = $directory.'/'.Str::uuid()->toString().'.webp';

        $manager = new ImageManager(Driver::class);
        $manager
            ->decodePath($upload->getRealPath())
            ->scaleDown(1600, 1600)
            ->encodeUsingFormat(Format::WEBP, quality: 80)
            ->save($target);

        return $target;
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
            try {
                $post->addMedia($outputFilePath)->toMediaCollection('post-files');
            } catch (\Throwable $e) {
                report($e);

                throw ValidationException::withMessages([
                    'file' => 'The file could not be processed. Please try again with a smaller PDF.',
                ]);
            }
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
        $post->postContentFiles->each->delete();

        $this->storeContentFiles($post, $uploads);
    }
}
