<?php

use App\Models\Category;
use App\Models\HomePageSection;
use App\Models\Menu;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Team;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function postCategory(string $name = 'Opinion'): Category
{
    return Category::query()->create([
        'name' => $name,
        'type' => 'post',
    ]);
}

test('tag store rejects a duplicate name', function () {
    Tag::factory()->create(['name' => 'trade']);

    $this->post(route('admin.tags.store'), ['name' => 'trade'])
        ->assertSessionHasErrors('name');

    expect(Tag::query()->count())->toBe(1);
});

test('tag update accepts the name the tag already owns', function () {
    $tag = Tag::factory()->create(['name' => 'trade']);

    $this->patch(route('admin.tags.update', $tag), ['name' => 'trade'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.tags.index'));
});

test('theme update rejects a title owned by another theme', function () {
    Theme::factory()->create(['title' => 'Taken title']);
    $theme = Theme::factory()->create(['title' => 'Own title']);

    $this->patch(route('admin.themes.update', $theme), [
        'title' => 'Taken title',
        'description' => 'Anything',
    ])->assertSessionHasErrors('title');

    expect($theme->fresh()->title)->toBe('Own title');
});

test('theme update requires a description because the column is not nullable', function () {
    $theme = Theme::factory()->create();

    $this->patch(route('admin.themes.update', $theme), [
        'title' => 'Still fine',
        'description' => '',
    ])->assertSessionHasErrors('description');
});

test('category update keeps its own name but rejects a sibling name', function () {
    $category = postCategory('Opinion');
    postCategory('Analysis');

    $this->patch(route('admin.categories.update', $category), [
        'name' => 'Opinion',
        'type' => 'post',
    ])->assertSessionHasNoErrors();

    $this->patch(route('admin.categories.update', $category), [
        'name' => 'Analysis',
        'type' => 'post',
    ])->assertSessionHasErrors('name');
});

test('category rejects a type outside the column enum', function () {
    $this->post(route('admin.categories.store'), [
        'name' => 'Bogus',
        'type' => 'not-a-type',
    ])->assertSessionHasErrors('type');
});

test('post store rejects a duplicate title', function () {
    $category = postCategory();
    Post::factory()->create(['category_id' => $category->id, 'theme_id' => null, 'title' => 'Existing post']);

    $this->post(route('admin.posts.store'), [
        'title' => 'Existing post',
        'category_id' => $category->id,
        'status' => 'published',
    ])->assertSessionHasErrors('title');
});

test('post update is bound to the model and keeps its own title', function () {
    $category = postCategory();
    $post = Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'title' => 'My post',
    ]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => '  My   post  ',
        'category_id' => $category->id,
        'status' => 'draft',
    ])->assertSessionHasNoErrors()->assertRedirect(route('admin.posts.index'));

    $post->refresh();

    expect($post->title)->toBe('My post')
        ->and($post->meta_title)->toBe('My post')
        ->and($post->status)->toBe('draft');
});

test('post update rejects a status outside the column enum', function () {
    $category = postCategory();
    $post = Post::factory()->create(['category_id' => $category->id, 'theme_id' => null]);

    $this->patch(route('admin.posts.update', $post), [
        'title' => $post->title,
        'category_id' => $category->id,
        'status' => 'archived',
    ])->assertSessionHasErrors('status');
});

test('home page section update is validated', function () {
    $section = HomePageSection::query()->create(['name' => 'Carousel', 'show' => true]);
    $other = HomePageSection::query()->create(['name' => 'Infocus', 'show' => true]);

    $this->patch(route('admin.home-page-sections.update', $section), [
        'name' => 'Infocus',
        'show' => true,
    ])->assertSessionHasErrors('name');

    $this->patch(route('admin.home-page-sections.update', $section), [
        'name' => 'Carousel',
        'show' => false,
        'order' => 3,
    ])->assertSessionHasNoErrors();

    $section->refresh();

    expect($section->show)->toBeFalse()
        ->and($section->order)->toBe(3)
        ->and($other->fresh()->name)->toBe('Infocus');
});

test('team update ignores its own email and rejects one already taken', function () {
    $team = Team::query()->create([
        'name' => 'Ada',
        'email' => 'ada@example.com',
        'designation' => 'Fellow',
        'order' => 1,
    ]);

    Team::query()->create([
        'name' => 'Grace',
        'email' => 'grace@example.com',
        'designation' => 'Fellow',
        'order' => 2,
    ]);

    $this->patch(route('admin.teams.update', $team), [
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'designation' => 'Fellow',
        'order' => 1,
    ])->assertSessionHasNoErrors();

    expect($team->fresh()->name)->toBe('Ada Lovelace');

    $this->patch(route('admin.teams.update', $team), [
        'name' => 'Ada Lovelace',
        'email' => 'grace@example.com',
        'designation' => 'Fellow',
        'order' => 1,
    ])->assertSessionHasErrors('email');
});

test('editor media upload validates the file and returns its public location', function () {
    Storage::fake('public');

    $this->post(route('admin.post.upload'), [])
        ->assertSessionHasErrors('file');

    $this->post(route('admin.post.upload'), [
        'file' => UploadedFile::fake()->image('diagram.png'),
    ])->assertOk()->assertJson([
        'location' => '/storage/uploads/diagram.png',
        'text' => 'diagram.png',
    ]);

    Storage::disk('public')->assertExists('uploads/diagram.png');
});

test('menu update resolves the menu from the serialised payload and ignores its own title', function () {
    $menu = Menu::query()->create(['title' => 'Header', 'location' => 'header']);

    $this->patch(route('admin.update.menu', ['menu' => ['id' => $menu->id]]), [
        'title' => 'Header',
        'location' => 'primary',
    ])->assertSessionHasNoErrors();

    expect($menu->fresh()->location)->toBe('primary');
});
