<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TradeInsightVolume;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;


class TradeInsightVolumeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $volumes = TradeInsightVolume::all();
        return Inertia::render('Backend/TradeInsightVolume/Index', ["volumes" => $volumes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/TradeInsightVolume/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'volume' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'content' => 'nullable|string',
            'full_article_link' => 'nullable|string',
        ]);
        $validated['title'] = Str::of($validated['title'])
            ->squish();
        $validated['meta_title'] = $validated['title'];

        $volume = TradeInsightVolume::create($validated);
        $volume->save();
        return redirect()->route('admin.trade-insight-volumes.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(TradeInsightVolume $tradeInsightVolume)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TradeInsightVolume $tradeInsightVolume)
    {
        // dd($tradeInsightVolume);
        return Inertia::render('Backend/TradeInsightVolume/Edit', ["volume" => $tradeInsightVolume]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TradeInsightVolume $tradeInsightVolume)
    {
        $validated = $request->validate([
            'volume' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'content' => 'nullable|string',
            'full_article_link' => 'nullable|string',
        ]);
        $validated['title'] = Str::of($validated['title'])
            ->squish();
        $validated['meta_title'] = $validated['title'];

        $tradeInsightVolume->update($validated);

        return redirect()->route('admin.trade-insight-volumes.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TradeInsightVolume $tradeInsightVolume)
    {
        $tradeInsightVolume->delete();
    }
}
