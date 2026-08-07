<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\OrphanedFilesCleaner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MaintenanceController extends Controller
{
    public function index(OrphanedFilesCleaner $cleaner): Response
    {
        $report = $cleaner->scan();

        return Inertia::render('Backend/Maintenance/Index', [
            'report' => $this->presentReport($report),
        ]);
    }

    public function clean(Request $request, OrphanedFilesCleaner $cleaner): RedirectResponse
    {
        $delete = $request->boolean('delete');
        $spatieNote = null;

        try {
            Artisan::call('media-library:clean', [
                '--force' => true,
                '--delete-orphaned' => true,
                '--dry-run' => ! $delete,
            ]);
        } catch (Throwable $e) {
            report($e);
            $spatieNote = ' Spatie media-library:clean skipped due to an error (check logs).';
        }

        $report = $cleaner->scan();

        if (! $delete) {
            return Inertia::flash('success', sprintf(
                'Dry-run complete: %d orphaned item(s) totaling %s. Nothing was deleted.%s',
                count($report['orphans']),
                $this->formatBytes($report['bytes']),
                $spatieNote ?? ''
            ))->back();
        }

        $result = $cleaner->delete($report['orphans']);

        return Inertia::flash('success', sprintf(
            'Cleanup complete: deleted %d item(s) (%s).%s',
            $result['deleted'],
            $this->formatBytes($result['bytes']),
            $spatieNote ?? ''
        ))->back();
    }

    /**
     * @param  array<string, mixed>  $report
     * @return array<string, mixed>
     */
    private function presentReport(array $report): array
    {
        return [
            'orphanCount' => count($report['orphans']),
            'kept' => $report['kept'],
            'bytes' => $report['bytes'],
            'referencedMediaIds' => $report['referenced_media_ids'],
            'referencedBasenames' => $report['referenced_basenames'],
            'orphans' => array_map(
                fn (array $orphan) => [
                    'label' => $orphan['label'],
                    'size' => $orphan['size'],
                ],
                array_slice($report['orphans'], 0, 100)
            ),
            'truncated' => count($report['orphans']) > 100,
        ];
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }

        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024, 1).' KB';
        }

        return round($bytes / (1024 * 1024), 1).' MB';
    }
}
