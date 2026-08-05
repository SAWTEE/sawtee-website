<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FellowshipRequest;
use App\Models\Fellowship;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FellowshipController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Fellowships/Index', [
            'fellowships' => Fellowship::withCount('fellows')->orderByDesc('year')->get(),
        ]);
    }

    public function store(FellowshipRequest $request): RedirectResponse
    {
        Fellowship::create($request->validated());

        return to_route('admin.fellowships.index');
    }

    public function update(FellowshipRequest $request, Fellowship $fellowship): RedirectResponse
    {
        $fellowship->update($request->validated());

        return to_route('admin.fellowships.index');
    }

    public function destroy(Fellowship $fellowship): RedirectResponse
    {
        $fellowship->delete();

        return to_route('admin.fellowships.index');
    }
}
