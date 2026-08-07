<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Trade Insight volumes were renamed to Publication; leftover morph types
        // break Spatie media-library:clean and related maintenance tools.
        DB::table('media')
            ->where('model_type', 'App\Models\TradeInsightVolume')
            ->update(['model_type' => 'App\Models\Publication']);

        DB::table('files')
            ->where('fileable_type', 'App\Models\TradeInsightVolume')
            ->update(['fileable_type' => 'App\Models\Publication']);
    }

    public function down(): void
    {
        // Irreversible without knowing which Publication rows were formerly volumes.
    }
};
