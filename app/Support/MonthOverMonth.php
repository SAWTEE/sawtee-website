<?php

namespace App\Support;

use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class MonthOverMonth
{
    public static function percentChange(int $current, int $previous): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return (($current - $previous) / $previous) * 100;
    }

    /**
     * @return 'up'|'down'|'neutral'
     */
    public static function direction(float $percent): string
    {
        if ($percent > 0) {
            return 'up';
        }

        if ($percent < 0) {
            return 'down';
        }

        return 'neutral';
    }

    /**
     * @return array{total: int, this_month: int, last_month: int, percent: float, trend: string}
     */
    public static function forTable(string $table, ?CarbonInterface $now = null): array
    {
        $now = ($now ?? now())->copy();

        $thisMonthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->startOfMonth()->subMonthNoOverflow();
        $lastMonthEnd = $thisMonthStart->copy();

        $total = (int) DB::table($table)->count();

        $thisMonth = (int) DB::table($table)
            ->where('created_at', '>=', $thisMonthStart)
            ->where('created_at', '<', $now->copy()->startOfMonth()->addMonthNoOverflow())
            ->count();

        $lastMonth = (int) DB::table($table)
            ->where('created_at', '>=', $lastMonthStart)
            ->where('created_at', '<', $lastMonthEnd)
            ->count();

        $percent = self::percentChange($thisMonth, $lastMonth);

        return [
            'total' => $total,
            'this_month' => $thisMonth,
            'last_month' => $lastMonth,
            'percent' => $percent,
            'trend' => self::direction($percent),
        ];
    }
}
