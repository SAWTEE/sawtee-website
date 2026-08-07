<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\AttachesUploadedMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SlideRequest;
use App\Models\Slide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class SlideController extends Controller
{
    use AttachesUploadedMedia;

    public function store(SlideRequest $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $slide = Slide::create($request->validated());
            $this->attachImageFromRequest($slide, $request, 'slides');

            return to_route('admin.sliders.edit', $slide->slider_id, 303);
        });
    }

    public function update(SlideRequest $request, Slide $slide): RedirectResponse
    {
        return DB::transaction(function () use ($request, $slide) {
            $this->attachImageFromRequest($slide, $request, 'slides');

            $slide->update($request->validated());

            return to_route('admin.sliders.edit', $slide->slider_id, 303);
        });
    }

    public function destroy(Slide $slide): RedirectResponse
    {
        $sliderId = $slide->slider_id;
        $slide->delete();

        return to_route('admin.sliders.edit', $sliderId, 303);
    }
}
