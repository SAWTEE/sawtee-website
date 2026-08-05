<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\InstituteRequest;
use App\Models\Institute;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InstituteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/MembersInstitutes/Index', [
            'members' => Member::select(['id', 'country'])->orderBy('country')->get(),
            'institutes' => Institute::with('member:id,country')->orderBy('name')->get(),
        ]);
    }

    public function store(InstituteRequest $request): RedirectResponse
    {
        Institute::create($request->validated());

        return to_route('admin.institutes.index');
    }

    public function update(InstituteRequest $request, Institute $institute): RedirectResponse
    {
        $institute->update($request->validated());

        return to_route('admin.institutes.index');
    }

    public function destroy(Institute $institute): RedirectResponse
    {
        $institute->delete();

        return to_route('admin.institutes.index');
    }
}
