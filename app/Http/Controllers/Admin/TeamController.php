<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeamRequest;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Team/Index', [
            'teams' => Team::with('media')->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Team/Create');
    }

    public function store(TeamRequest $request): RedirectResponse
    {
        $team = Team::create($request->validated());

        if ($request->hasFile('image')) {
            $team->addMediaFromRequest('image')->toMediaCollection('avatar');
        }

        return to_route('admin.teams.index');
    }

    public function edit(Team $team): Response
    {
        return Inertia::render('Backend/Team/Edit', [
            'team' => $team->load('media'),
        ]);
    }

    public function update(TeamRequest $request, Team $team): RedirectResponse
    {
        if ($request->hasFile('image')) {
            $team->clearMediaCollection('avatar');
            $team->addMediaFromRequest('image')->toMediaCollection('avatar');
        }

        $team->update($request->validated());

        return to_route('admin.teams.index');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $team->delete();

        return to_route('admin.teams.index');
    }
}
