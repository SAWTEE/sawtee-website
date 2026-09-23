<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FeatureRequest;
use App\Models\Feature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FeatureController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Feature/Index', [
            'features' => Feature::query()->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function store(FeatureRequest $request): RedirectResponse
    {
        Feature::create($this->payload($request->validated()));

        return to_route('admin.features.index');
    }

    public function update(FeatureRequest $request, Feature $feature): RedirectResponse
    {
        $feature->update($this->payload($request->validated(), $feature));

        return to_route('admin.features.index');
    }

    public function destroy(Feature $feature): RedirectResponse
    {
        $feature->delete();

        return to_route('admin.features.index');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function payload(array $validated, ?Feature $feature = null): array
    {
        $key = trim((string) ($validated['key'] ?? ''));

        if ($key === '') {
            $key = Str::slug((string) $validated['title']);
        }

        if ($key === '') {
            $key = 'feature-'.Str::lower(Str::random(8));
        }

        $validated['key'] = $this->uniqueKey($key, $feature);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        return $validated;
    }

    private function uniqueKey(string $key, ?Feature $ignore = null): string
    {
        $candidate = $key;
        $suffix = 2;

        while (Feature::query()
            ->where('key', $candidate)
            ->when($ignore, fn ($query) => $query->where('id', '!=', $ignore->id))
            ->exists()) {
            $candidate = $key.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }
}
