<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Slide;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sliders = Slider::latest()->get();
        $pages = Page::all();
        return Inertia::render('Backend/Slider/Index', ['sliders' => $sliders, "pages" => $pages]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Slider/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:sliders|max:255',
            'page_id' => 'nullable|numeric|exists:pages,id',
        ]);
        Slider::create($validated);
        return to_route('admin.sliders.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Slider $slider)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Slider $slider)
    {
        $pages = Page::all();
        $slides = Slide::where(
            'slider_id',
            $slider->id
        )->get();
        return Inertia::render('Backend/Slider/Edit', ['slider' => $slider, 'slides' => $slides, 'pages' => $pages]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Slider $slider, Slide $slide)
    {
        if ($request->hasFile('image')) {
            $slide->image->delete();
            try {
                $slide->addMediaFromRequest('image')->toMediaCollection('slides');
            } catch (FileDoesNotExist|FileIsTooBig $e) {

            }
        }
        $slider->update($request->all());
        return to_route('admin.sliders.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slider $slider)
    {
        $slider->delete();
        return to_route('admin.sliders.index', 302);
    }
}
