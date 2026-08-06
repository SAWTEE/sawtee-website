<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Slide;
use App\Models\Slider;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

/**
 * @return int Number of queries the request needed.
 */
function queriesFor(string $url): int
{
    DB::flushQueryLog();
    DB::enableQueryLog();

    test()->get($url)->assertOk();

    $count = count(DB::getQueryLog());
    DB::disableQueryLog();

    return $count;
}

test('publications index query count does not grow with rows', function () {
    $root = Category::query()->create(['name' => 'publications', 'type' => 'publication']);
    $child = Category::query()->create(['name' => 'Briefings', 'type' => 'publication', 'parent_id' => $root->id]);
    $grandChild = Category::query()->create(['name' => 'Series', 'type' => 'publication', 'parent_id' => $child->id]);

    $tag = Tag::factory()->create();

    Publication::query()
        ->create(['title' => 'First', 'category_id' => $child->id])
        ->tags()->attach($tag);

    $baseline = queriesFor(route('admin.publications.index'));

    foreach (range(1, 5) as $i) {
        Publication::query()
            ->create([
                'title' => "Publication {$i}",
                'category_id' => $i % 2 === 0 ? $child->id : $grandChild->id,
            ])
            ->tags()->attach($tag);
    }

    expect(queriesFor(route('admin.publications.index')))->toBe($baseline);
});

test('publications index lists the whole category subtree', function () {
    $root = Category::query()->create(['name' => 'publications', 'type' => 'publication']);
    $child = Category::query()->create(['name' => 'Briefings', 'type' => 'publication', 'parent_id' => $root->id]);
    $grandChild = Category::query()->create(['name' => 'Series', 'type' => 'publication', 'parent_id' => $child->id]);
    $greatGrandChild = Category::query()->create(['name' => 'Deep Series', 'type' => 'publication', 'parent_id' => $grandChild->id]);

    Publication::query()->create(['title' => 'Child publication', 'category_id' => $child->id]);
    Publication::query()->create(['title' => 'Grandchild publication', 'category_id' => $grandChild->id]);
    Publication::query()->create(['title' => 'Great-grandchild publication', 'category_id' => $greatGrandChild->id]);

    $this->get(route('admin.publications.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Backend/Publication/Index')
            ->has('publications', 3)
            ->has('categories', 4)
            ->where('categoryID', $child->id)
        );
});

test('posts index query count does not grow with rows', function () {
    $category = Category::query()->create(['name' => 'Opinion', 'type' => 'post']);
    Post::factory()->create(['category_id' => $category->id, 'theme_id' => null]);

    $baseline = queriesFor(route('admin.posts.index'));

    Post::factory()->count(5)->create(['category_id' => $category->id, 'theme_id' => null]);

    expect(queriesFor(route('admin.posts.index')))->toBe($baseline);
});

test('slider edit eager loads slides with their media', function () {
    $slider = Slider::query()->create(['name' => 'Home hero']);
    Slide::query()->create(['title' => 'Slide one', 'slider_id' => $slider->id]);
    Slide::query()->create(['title' => 'Slide two', 'slider_id' => $slider->id]);

    $this->get(route('admin.sliders.edit', $slider))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Backend/Slider/Edit')
            ->has('slides', 2)
            ->has('slides.0.media')
            ->has('slider.slides', 2)
        );
});
