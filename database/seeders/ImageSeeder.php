<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Image;

class ImageSeeder extends Seeder
{
    protected $model = Image::class;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Image::factory()->count(100)->create();
    }
}
