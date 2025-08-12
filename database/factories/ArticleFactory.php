<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
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
            "subtitle" => fake()->sentence(4, true),
            "excerpt" => fake()->text(100, true),
            "author" => fake()->name(),
            "published_at" => fake()->dateTime(),
            "content"=> fake()->paragraph(8, true),
        ];
    }
}
