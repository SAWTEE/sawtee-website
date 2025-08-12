<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fellow;
use App\Models\Fellowship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FellowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Backend/Fellows/Index", ["fellows" => Fellow::get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Backend/Fellows/Create", ["fellowships" => Fellowship::get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "fellowship_id" => "required|numeric|exists:fellowships,id",
            "designation" => "required|string",
            "experience" => "required|string",
            "description" => "required|string",
        ]);

        $fellow = Fellow::create($validated);

        if ($request->hasFile('image')) {
            $fellow->addMediaFromRequest('image')->toMediaCollection('profile_picture');
        }

        return to_route("admin.fellows.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Fellow $fellow)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fellow $fellow)
    {
        return Inertia::render("Backend/Fellows/Edit", ["fellow" => $fellow, "fellowships" => Fellowship::get()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fellow $fellow)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "designation" => "required|string",
            "designation" => "required|string",
            "description" => "required|string",
        ]);

        if ($request->hasFile('image')) {
            $fellow->addMediaFromRequest('image')->toMediaCollection('profile_picture');
        }

        $fellow->update($validated);

        return to_route("admin.fellows.index");

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fellow $fellow)
    {
        $fellow->delete();
    }
}
