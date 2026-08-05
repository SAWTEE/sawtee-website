<?php

namespace App\Support;

use App\Models\PageView;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Analytics
{
    public static function enabled(): bool
    {
        return (bool) config('analytics.enabled', true);
    }

    public static function hash(string $value): string
    {
        return hash('sha256', config('analytics.hash_salt', '').'|'.$value);
    }

    public static function shouldIgnorePath(string $path): bool
    {
        $normalized = ltrim($path, '/');

        foreach (config('analytics.ignore_prefixes', []) as $prefix) {
            $prefix = trim((string) $prefix, '/');

            if ($prefix === '') {
                continue;
            }

            if ($normalized === $prefix || str_starts_with($normalized, $prefix.'/')) {
                return true;
            }
        }

        return false;
    }

    public static function record(Request $request): void
    {
        if (! self::enabled()) {
            return;
        }

        if (! $request->isMethod('GET')) {
            return;
        }

        $rawPath = trim($request->path(), '/');
        $path = $rawPath === '' ? '/' : '/'.$rawPath;

        if (self::shouldIgnorePath($path)) {
            return;
        }

        $dedupeMinutes = max(0, (int) config('analytics.dedupe_minutes', 30));
        $sessionKey = 'analytics.viewed.'.$path;

        if ($dedupeMinutes > 0 && $request->hasSession()) {
            $lastSeen = $request->session()->get($sessionKey);
            if (is_int($lastSeen) && $lastSeen > now()->subMinutes($dedupeMinutes)->getTimestamp()) {
                return;
            }
        }

        PageView::query()->create([
            'path' => $path,
            'ip_hash' => self::hash((string) $request->ip()),
            'user_agent_hash' => self::hash((string) $request->userAgent()),
            'created_at' => now(),
        ]);

        if ($dedupeMinutes > 0 && $request->hasSession()) {
            $request->session()->put($sessionKey, now()->getTimestamp());
        }
    }

    /**
     * @return array{
     *     views_today: int,
     *     views_this_week: int,
     *     views_this_month: int,
     *     top_pages: list<array{path: string, views: int}>
     * }
     */
    public static function dashboardSummary(?CarbonInterface $now = null): array
    {
        $now = ($now ?? now())->copy();

        $todayStart = $now->copy()->startOfDay();
        $weekStart = $now->copy()->startOfWeek();
        $monthStart = $now->copy()->startOfMonth();

        $viewsToday = (int) PageView::query()
            ->where('created_at', '>=', $todayStart)
            ->count();

        $viewsThisWeek = (int) PageView::query()
            ->where('created_at', '>=', $weekStart)
            ->count();

        $viewsThisMonth = (int) PageView::query()
            ->where('created_at', '>=', $monthStart)
            ->count();

        $topPages = PageView::query()
            ->select('path', DB::raw('COUNT(*) as views'))
            ->where('created_at', '>=', $monthStart)
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'path' => (string) $row->path,
                'views' => (int) $row->views,
            ])
            ->values()
            ->all();

        return [
            'views_today' => $viewsToday,
            'views_this_week' => $viewsThisWeek,
            'views_this_month' => $viewsThisMonth,
            'top_pages' => $topPages,
        ];
    }
}
