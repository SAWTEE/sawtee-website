<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FellowRequest;
use App\Models\Fellow;
use App\Models\Fellowship;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FellowController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Fellows/Index', [
            'fellows' => Fellow::with(['fellowship', 'media'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Fellows/Create', [
            'fellowships' => $this->fellowshipOptions(),
        ]);
    }

    public function store(FellowRequest $request): RedirectResponse
    {
        $fellow = Fellow::create($request->validated());

        if ($request->hasFile('image')) {
            $fellow->addMediaFromRequest('image')->toMediaCollection('profile_picture');
        }

        return to_route('admin.fellows.index');
    }

    public function edit(Fellow $fellow): Response
    {
        return Inertia::render('Backend/Fellows/Edit', [
            'fellow' => $fellow->load(['fellowship', 'media']),
            'fellowships' => $this->fellowshipOptions(),
        ]);
    }

    public function update(FellowRequest $request, Fellow $fellow): RedirectResponse
    {
        if ($request->hasFile('image')) {
            $fellow->clearMediaCollection('profile_picture');
            $fellow->addMediaFromRequest('image')->toMediaCollection('profile_picture');
        }

        $fellow->update($request->validated());

        return to_route('admin.fellows.index');
    }

    public function destroy(Fellow $fellow): RedirectResponse
    {
        $fellow->delete();

        return to_route('admin.fellows.index');
    }

    /**
     * @return Collection<int, Fellowship>
     */
    private function fellowshipOptions(): Collection
    {
        return Fellowship::select(['id', 'title', 'year'])->orderByDesc('year')->get();
    }
}
