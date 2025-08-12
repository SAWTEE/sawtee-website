<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fellowship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FellowshipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fellowships = Fellowship::get();
        return Inertia::render('Backend/Fellowships/Index', ["fellowships" => $fellowships]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "string|max:255",
            "description" => "string|max:2000",
            "year" => "required|digits:4|integer|min:2023"
        ]);

        Fellowship::create($validated);

        return to_route("admin.fellowships.index", ["fellowships" => Fellowship::all() ]);
    }

    /**
     * Display the specified resource.
     */
    // public function show(fellowship $fellowship)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(fellowship $fellowship)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, fellowship $fellowship)
    {
        $validated = $request->validate([
            "title" => "string|max:255",
            "description" => "string|max:2000",
            "year" => "required|digits:4|integer|min:2023"
        ]);

        $fellowship->update($validated);

        return to_route("admin.fellowships.index", ["fellowships" => Fellowship::all() ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(fellowship $fellowship)
    {
        $fellowship->delete();
        return to_route("admin.fellowships.index", ["fellowships" => Fellowship::all() ]);
    }
}
