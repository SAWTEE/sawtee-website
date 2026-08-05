<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Analytics;
use App\Support\MonthOverMonth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $posts = MonthOverMonth::forTable('posts');
        $publications = MonthOverMonth::forTable('publications');
        $researchs = MonthOverMonth::forTable('research');

        return Inertia::render('Backend/Dashboard', [
            'posts' => $posts['total'],
            'publications' => $publications['total'],
            'researchs' => $researchs['total'],
            'postsIncreasePercent' => $posts['percent'],
            'publicationsIncreasePercent' => $publications['percent'],
            'researchsIncreasePercent' => $researchs['percent'],
            'postsThisMonth' => $posts['this_month'],
            'postsLastMonth' => $posts['last_month'],
            'publicationsThisMonth' => $publications['this_month'],
            'publicationsLastMonth' => $publications['last_month'],
            'researchsThisMonth' => $researchs['this_month'],
            'researchsLastMonth' => $researchs['last_month'],
            'postsTrend' => $posts['trend'],
            'publicationsTrend' => $publications['trend'],
            'researchsTrend' => $researchs['trend'],
            'analytics' => Analytics::dashboardSummary(),
        ]);
    }
}
