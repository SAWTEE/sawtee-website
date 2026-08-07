<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\LinkChecker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LinkCheckerController extends Controller
{
    public function index(LinkChecker $checker): Response
    {
        return Inertia::render('Backend/LinkChecker/Index', [
            'report' => $this->presentReport($checker->lastReport()),
        ]);
    }

    public function scan(Request $request, LinkChecker $checker): RedirectResponse
    {
        $validated = $request->validate([
            'max_pages' => ['nullable', 'integer', 'min:1', 'max:500'],
            'max_links' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'check_external' => ['nullable', 'boolean'],
        ]);

        // Crawls can take a while on larger sites.
        set_time_limit(300);

        $report = $checker->crawl(
            maxPages: (int) ($validated['max_pages'] ?? 200),
            maxLinks: (int) ($validated['max_links'] ?? 2000),
            checkExternal: (bool) ($validated['check_external'] ?? false),
        );

        $broken = count($report['broken']);

        return Inertia::flash('success', sprintf(
            'Scan complete: %d page(s) crawled, %d link(s) checked, %d broken.%s',
            $report['pages_crawled'],
            $report['links_checked'],
            $broken,
            $report['truncated'] ? ' Results were truncated by limits.' : ''
        ))->back();
    }

    /**
     * @param  array<string, mixed>|null  $report
     * @return array<string, mixed>|null
     */
    private function presentReport(?array $report): ?array
    {
        if ($report === null) {
            return null;
        }

        $broken = $report['broken'] ?? [];

        return [
            'startedAt' => $report['started_at'] ?? null,
            'finishedAt' => $report['finished_at'] ?? null,
            'baseUrl' => $report['base_url'] ?? null,
            'pagesCrawled' => $report['pages_crawled'] ?? 0,
            'linksChecked' => $report['links_checked'] ?? 0,
            'ok' => $report['ok'] ?? 0,
            'brokenCount' => count($broken),
            'skippedExternal' => $report['skipped_external'] ?? 0,
            'truncated' => (bool) ($report['truncated'] ?? false),
            'errors' => array_values($report['errors'] ?? []),
            'broken' => array_map(
                fn (array $row) => [
                    'url' => $row['url'],
                    'status' => (string) $row['status'],
                    'source' => $row['source'],
                    'type' => $row['type'],
                ],
                array_slice($broken, 0, 200)
            ),
            'brokenTruncated' => count($broken) > 200,
        ];
    }
}
