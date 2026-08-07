<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6, true);
        $slug = Str::of($title)->slug('-');

        return [
            'category_id' => fake()->numberBetween(1, 9),
            'theme_id' => fake()->randomElement([null, fake()->numberBetween(1, 7)]),
            'title' => $title,
            'slug' => $slug,
            'content' => fake()->paragraphs(4, true),
            'excerpt' => fake()->text(200),
            'author' => fake()->name(),
            'status' => 'published',
            'link' => fake()->url(),
            'published_at' => fake()->date('Y-m-d', 'now'),
            'updated_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'published',
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'draft',
        ]);
    }

    public function unpublished(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'unpublished',
        ]);
    }
}
