<?php

namespace Database\Factories;

use App\Models\Theme;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Theme>
 */
class ThemeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title" => fake()->unique()->sentence(6, true),
            "description" => fake()->paragraphs(2, true),
            "created_at" => fake()->dateTimeThisYear(),
            "updated_at" => fake()->dateTimeThisYear(),
        ];
    }
}
