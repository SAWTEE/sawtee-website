<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TradeInsightVolumeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "volume" => fake()->unique()->sentence(6, true),
            "title" => fake()->unique()->sentence(10, true),
            "subtitle" => fake()->sentence(6, true),
            "description" => fake()->text(200, true),
            "content" => fake()->paragraph(6, true),
            "full_article_link" => fake()->url(),

        ];
    }
}
