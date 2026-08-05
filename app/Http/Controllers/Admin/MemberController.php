<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MemberRequest;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Members/Index', [
            'members' => Member::withCount('institutes')->orderBy('country')->get(),
        ]);
    }

    public function store(MemberRequest $request): RedirectResponse
    {
        Member::create($request->validated());

        return to_route('admin.members.index');
    }

    public function update(MemberRequest $request, Member $member): RedirectResponse
    {
        $member->update($request->validated());

        return to_route('admin.members.index');
    }

    public function destroy(Member $member): RedirectResponse
    {
        $member->delete();

        return to_route('admin.members.index');
    }
}
