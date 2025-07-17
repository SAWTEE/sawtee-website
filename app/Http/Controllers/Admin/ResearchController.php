<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Research;
use App\Models\File;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ResearchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $researchs = Research::with(['media'])->orderBy('year', 'desc')->get();
        return Inertia::render('Backend/Research/Index', ['researchs' => $researchs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Research/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
            'title' => 'string|unique:research|min:6|max:255',
            'slug' =>'nullable|string|unique:research',
            'subtitle' =>'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'year' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'link' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'meta_title' => "nullable|string|max:255",
            'meta_description' => "nullable|string"
        ]);
        $validated['slug'] = Str::slug($validated['title'], '-');
        $validated['meta_title'] = $validated['title'];
        $research = Research::create($validated);
        if ($request->hasFile('image')) {
            $research->addMediaFromRequest('image')->toMediaCollection('research_featured_image');
        }
        if ($request->hasFile('file')) {
            $name = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->move(public_path('Research_Reports'), $name);
            $file = new File();
            $file->path = $path;
            $file->name = $name;
            $research->file()->save($file);
        }
        return redirect()->route('admin.research.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Research $research)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Research $research)
    {
        $research->load('media', 'file');
        return Inertia::render('Backend/Research/Edit', ['research' => $research]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Research $research)
    {
        $validated = $request->validate([
            'title' => 'string|min:6|max:255',
            'slug' => 'nullable|string',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'year' => 'required|digits:4|integer|min:1900|max:' . (date('Y')),
            'link' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'meta_title' => "nullable|string|max:255",
            'meta_description' => "nullable|string"
        ]);

        if ($request->hasFile('image'))
            $research->addMediaFromRequest('image')->toMediaCollection('featured_image');
        if($request->hasFile('file')){
            $research->file()->delete();
            $name = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->move(public_path('Research_Reports '), $name);
            $file = new File();
            $file->path = $path;
            $file->name = $name;
            $research->file()->save($file);
        }
        $research->update($validated);

        return redirect()->route('admin.research.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Research $research)
    {
        $research->delete();
        return redirect()->route('admin.research.index');
    }
}
