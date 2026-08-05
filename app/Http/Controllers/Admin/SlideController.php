<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SlideRequest;
use App\Models\Slide;
use Illuminate\Http\RedirectResponse;

class SlideController extends Controller
{
    public function store(SlideRequest $request): RedirectResponse
    {
        $slide = Slide::create($request->validated());
        $slide->addMediaFromRequest('image')->toMediaCollection('slides');

        return to_route('admin.sliders.edit', $slide->slider_id, 303);
    }

    public function update(SlideRequest $request, Slide $slide): RedirectResponse
    {
        if ($request->hasFile('image')) {
            $slide->addMediaFromRequest('image')->toMediaCollection('slides');
        }

        $slide->update($request->validated());

        return to_route('admin.sliders.edit', $slide->slider_id, 303);
    }

    public function destroy(Slide $slide): RedirectResponse
    {
        $sliderId = $slide->slider_id;
        $slide->delete();

        return to_route('admin.sliders.edit', $sliderId, 303);
    }
}
