<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $posts = app('db')->table('posts')->count();
        $postsLastMonth = app('db')->table('posts')
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->subMonth())
            ->count();
        $postsThisMonth = app('db')->table('posts')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
        $publications = app('db')->table('publications')->count();
        $researchs = app('db')->table('research')->count();
$publicationsLastMonth = app('db')->table('publications')
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->subMonth())
            ->count();
        $researchsLastMonth = app('db')->table('research')
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->subMonth())
            ->count();
            $publicationsThisMonth = app('db')->table('publications')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
        $researchsThisMonth = app('db')->table('research')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
            $postsIncreasePercent = 0;
            if ($postsLastMonth > 0) {
                $postsIncreasePercent = (($postsThisMonth - $postsLastMonth) / $postsLastMonth) * 100;
            }
            $publicationsIncreasePercent = 0;
            if ($publicationsLastMonth > 0) {
                $publicationsIncreasePercent = (($publicationsThisMonth - $publicationsLastMonth) / $publicationsLastMonth) * 100;
            }
            $researchsIncreasePercent = 0;
            if ($researchsLastMonth > 0) {
                $researchsIncreasePercent = (($researchsThisMonth - $researchsLastMonth) / $researchsLastMonth) * 100;
            }

        return Inertia::render('Backend/Dashboard', [
            'posts' => $posts,
            'publications' => $publications,
            'researchs' => $researchs,
            'postsIncreasePercent' => $postsIncreasePercent,
            'publicationsIncreasePercent' => $publicationsIncreasePercent,
            'researchsIncreasePercent' => $researchsIncreasePercent,
            'postsThisMonth' => $postsThisMonth,
            'postsLastMonth' => $postsLastMonth,
            'publicationsThisMonth' => $publicationsThisMonth,
            'publicationsLastMonth' => $publicationsLastMonth,
            'researchsThisMonth' => $researchsThisMonth,
            'researchsLastMonth' => $researchsLastMonth,
        ]);
    }
}
