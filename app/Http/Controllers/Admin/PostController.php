<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Models\Category;
use App\Models\File;
use App\Models\Theme;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Mostafaznv\PdfOptimizer\Laravel\Facade\PdfOptimizer;
use Mostafaznv\PdfOptimizer\Enums\PdfSettings;
use Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = null;
        $category = $request->category_id ? Category::where('type', 'post')->find($request->category_id) : Category::where('type', 'post')->first();
        $subcategory_ids = $category->children->pluck('id')->toArray();
        $parent_and_subcategory_ids = array_merge(array($category->slug === 'programme' ? null : $category->id), $subcategory_ids);

        $posts = Post::with(['category', 'tags', 'theme'])
            ->whereIn('category_id', $parent_and_subcategory_ids)
            ->idDescending()
            ->get();

        $categories = Category::where('type', 'post')->where('parent_id', null)->get();
        return Inertia::render('Backend/Post/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'categoryID' => $category->id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Post/Create', [
            'categories' => Category::where('type', 'post')->get(),
            'themes' => Theme::all(),
            'tags' => Tag::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $validated = $request->validated();
        $validated['title'] = Str::of($validated['title'])
            ->squish();
        $validated['meta_title'] = $validated['title'];
        // $validated['excerpt'] = Str::of(Str::words($validated['content'], 30, '...'))
        //     ->stripTags()
        //     ->squish();

        $post = Post::create($validated);

        if ($request->has('tags')) {
            $post->tags()->attach($request->tags);
        }
        if ($request->hasFile('image')) {
            $post->addMediaFromRequest('image')->toMediaCollection('post-featured-image');
        }

        if ($request->hasFile('file')) {
            $filename = $request->file('file')->getClientOriginalName();
            $outputFilePath = public_path('tmp/' . $filename);

            $result = PdfOptimizer::open($request->file('file'))
                ->settings(PdfSettings::SCREEN)
                ->colorImageResolution(144)
                ->downSampleColorImages(true)
                ->optimize($outputFilePath);

            if ($result->status) {
                $post->addMedia($outputFilePath)->toMediaCollection('post-files');
            }
        }

        if ($request->file('files')) {
            foreach ($request->file('files') as $file) {
                $filename = $file->getClientOriginalName();
                $outputFile = public_path('Featured_Events/' . $filename);

                $optimizedDocument = new File();
                $optimizedDocument->name = $filename;
                $optimizedDocument->path = $outputFile;

                // optimize uploaded pdf files to reduce size
                $result = PdfOptimizer::open($file)
                    ->settings(PdfSettings::SCREEN)
                    ->colorImageResolution(144)
                    ->downSampleColorImages(true)
                    ->optimize($outputFile);

                if ($result->status) {
                    $post->postContentFiles()->save($optimizedDocument);
                }
            }
        }

        return redirect()->route('admin.posts.index');
    }

    /**
     * Display the specified resource.
     */
    // public function show($category, $slug)
    // {
    //     $post = Post::with("category")->where("slug", $slug)->first();
    //     return Inertia::render("Frontend/Post", ["post" => $post]);
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $post = Post::with(['category', 'tags', 'postContentFiles'])
            ->where('id', $id)
            ->first();
        // dd($post);

        $categories = Category::where('type', 'post')->get();
        $tags = Tag::all();
        $themes = Theme::all();
        $featured_image = $post->getFirstMediaUrl('post_featured_image');
        $file = $post->getMedia('post-files');
        return Inertia::render('Backend/Post/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
            'themes' => $themes,
            'featured_image' => $featured_image,
            'file' => $file,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        // dd($post);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:1000',
            'category_id' => 'required|numeric|exists:categories,id',
            'theme_id' => 'nullable|numeric|exists:themes,id',
            'author' => 'nullable|string|max:255',
            'status' => 'required|string|max:255',
            'link' => 'nullable|string|max:255',
            'genre' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:255'
        ]);
        $validated['title'] = Str::of($validated['title'])
            ->squish();
        $validated['meta_title'] = $validated['title'];
        // $validated['excerpt'] = Str::of(Str::words($validated['content'], 30, '...'))
        //     ->stripTags()
        //     ->squish();

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }
        if (!$request->image) {
            $post->clearMediaCollection('post-featured-image');
        }
        if ($request->hasFile('image')) {
            $post->addMediaFromRequest('image')->toMediaCollection('post-featured-image');
        }
        if ($request->hasFile('file')) {
            $filename = $request->file('file')->getClientOriginalName();
            $outputFilePath = public_path('tmp/' . $filename);
            $result = PdfOptimizer::open($request->file('file'))
                ->settings(PdfSettings::DEFAULT)
                ->colorImageResolution(144)
                ->downSampleColorImages(true)
                ->optimize($outputFilePath);

            if ($result->status) {
                $post->addMedia($outputFilePath)->toMediaCollection('post-files');
            }
        }

        if ($request->file('files')) {
            $post_content_files = $post->load('postContentFiles')->postContentFiles->toArray();
            // unlink old files from storage and delete from database before saving new files.
            foreach ($post_content_files as $key => $value) {
                if (Storage::disk('events')->exists($value['path'])) {
                    unlink($value['path']);
                    File::where('id', $value['id'])->delete();
                }
            }

            foreach ($request->file('files') as $file) {
                $filename = $file->getClientOriginalName();
                $outputFile = public_path('Featured_Events/' . $filename);

                $optimizedDocument = new File();
                $optimizedDocument->name = $filename;
                $optimizedDocument->path = $outputFile;

                // optimize uploaded pdf files to reduce size
                $result = PdfOptimizer::open($file)
                    ->settings(PdfSettings::SCREEN)
                    ->colorImageResolution(144)
                    ->downSampleColorImages(true)
                    ->optimize($outputFile);

                if ($result->status) {
                    $post->postContentFiles()->save($optimizedDocument);
                }
            }
        }

        $post->update($validated);
        return to_route('admin.posts.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return to_route('admin.posts.index');
    }

    public function uploadmedia(Request $request)
    {
        if ($request->hasFile('file')) {
            $fileName = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->storeAs('uploads', $fileName, 'public');
            return response()->json([
                'location' => "/storage/$path",
                'text' => $fileName,
            ]);
        }
    }
}
