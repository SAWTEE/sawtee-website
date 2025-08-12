<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TradeInsightVolume;
use App\Models\Article;

class TradeInsightVolumeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TradeInsightVolume::factory()
        ->count(40)
        ->has(Article::factory()->count(100))
        ->create();
    }
}
