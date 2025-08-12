<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstituteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return  Inertia::render("Backend/MembersInstitutes/Index", ["members" => Member::get(), "institutes" => Institute::get() ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "string|required",
            "link" => "string|required",
            "logo_image_src" => "string|nullable",
            "member_id" => "numeric|required|exists:members,id"
        ]);

        Institute::create($validated);

        return to_route("admin.institutes.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Institute $institute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Institute $institute)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Institute $institute)
    {
        $validated = $request->validate([
            "name" => "string|required",
            "link" => "string|required",
            "logo_image_src" => "string|nullable",
            "member_id" => "numeric|required|exists:members,id"
        ]);

        $institute->update($validated);

        return to_route("admin.institutes.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institute $institute)
    {
        $institute->delete();
    }
}
