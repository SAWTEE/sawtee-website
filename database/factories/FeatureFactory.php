<?php

namespace Database\Factories;

use App\Models\Feature;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Feature>
 */
class FeatureFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'key' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'title' => $title,
            'description' => fake()->paragraph(),
            'image_src' => '/assets/SM-placeholder-1024x512.webp',
            'link' => '/media-fellows',
            'sort_order' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}
