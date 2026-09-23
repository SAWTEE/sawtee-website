<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingRequest;
use App\Models\SiteSetting;
use App\Support\SiteCopy;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Backend/SiteSetting/Edit', [
            'settings' => SiteCopy::all(),
        ]);
    }

    public function update(SiteSettingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        foreach (array_keys(SiteCopy::defaults()) as $key) {
            if (! array_key_exists($key, $validated)) {
                continue;
            }

            SiteSetting::putValue($key, $validated[$key]);
        }

        return to_route('admin.settings.edit')
            ->with('success', 'Site settings updated successfully!');
    }
}
