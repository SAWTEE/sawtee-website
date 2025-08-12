<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teams = Team::with('media')->latest()->get();
        return Inertia::render('Backend/Team/Index', [
            'teams' => $teams,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Team/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'string|email|unique:teams|max:255',
            'designation' => 'required|string|max:255',
            'bio' => 'string|max:2000',
            'order' => 'required|integer',
            'image' => 'nullable|image|max:2048',
        ]);
        $team = Team::create($validated);

        if ($request->hasFile('image')) {
            $team->addMediaFromRequest('image')->toMediaCollection('avatar');
        }

        return redirect()->route('admin.teams.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Team $team)
    {
        // dd($team);
        return Inertia::render('Backend/Team/Edit', [
            'team' => $team->load('media')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        $team->update($request->all());
        if ($request->hasFile('image')) {
            $team->clearMediaCollection('avatar');
            $team->addMediaFromRequest('image')->toMediaCollection('avatar');
        }
        return redirect()->route('admin.teams.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $team->delete();
        return redirect()->route('admin.teams.index');
    }
}
