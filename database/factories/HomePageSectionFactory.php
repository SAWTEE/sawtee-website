<?php

namespace Database\Factories;

use App\Models\HomePageSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HomePageSection>
 */
class HomePageSectionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'heading' => fake()->sentence(3),
            'intro' => fake()->sentence(),
            'description' => fake()->sentence(),
            'show' => true,
            'order' => fake()->numberBetween(1, 20),
        ];
    }
}
