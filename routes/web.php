<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FellowController;
use App\Http\Controllers\Admin\FellowshipController;
use App\Http\Controllers\Admin\HomePageSectionController;
use App\Http\Controllers\Admin\InstituteController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PublicationController;
use App\Http\Controllers\Admin\PublishedStoryController;
use App\Http\Controllers\Admin\ResearchController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

require __DIR__.'/auth.php';

Route::get('/admin', function () {
    return to_route('login');
});

Route::get('/admin/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');

Route::post('/admin/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/search', SearchController::class)->name('search');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::get('/', [FrontendController::class, 'index'])->name('home');
Route::get('/tags/{tags:slug}/{subcategory?}/{post?}', [FrontendController::class, 'tags']);
Route::get('/themes/{themes:slug}/{subcategory?}/{post?}', [FrontendController::class, 'themes']);
Route::redirect('/article/{post}', '/category/opinion-in-lead/{post}', 301)->name('article.redirect');
Route::get('/category/{categories:slug}/{subcategory?}/{post?}/{article?}', [FrontendController::class, 'category'])->name('category.show');
Route::get('/{pages:slug?}', [FrontendController::class, 'page'])->name('page.show');

Route::middleware(['auth', 'verified', 'inertia.encrypt'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Resources managed entirely from their index screen through dialogs.
    Route::resource('/categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/themes', ThemeController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/tags', TagController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/fellowships', FellowshipController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/members', MemberController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/institutes', InstituteController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/slides', SlideController::class)->only(['store', 'update', 'destroy']);

    Route::resource('/sections', SectionController::class)->except('show');
    Route::resource('/publications', PublicationController::class)->except('show');
    Route::resource('/research', ResearchController::class)->except('show');
    Route::resource('/sliders', SliderController::class)->except('show');
    Route::resource('/pages', PageController::class)->except('show');
    Route::resource('/home-page-sections', HomePageSectionController::class)->except('show');
    Route::resource('/teams', TeamController::class)->except('show');
    Route::resource('/articles', ArticleController::class)->except('show');
    Route::resource('/fellows', FellowController::class)->except('show');
    Route::resource('/published-stories', PublishedStoryController::class)->except('show');

    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::get('/posts/edit/{post}', [PostController::class, 'edit'])->name('posts.edit');
    Route::post('/posts/store', [PostController::class, 'store'])->name('posts.store');
    Route::patch('/posts/update/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/delete/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    Route::post('/post/uploadmedia', [PostController::class, 'uploadmedia'])->name('post.upload');
    Route::get('/menus', [MenuController::class, 'index'])->name('menus.index');
    Route::get('/menus/manage-menus/{id?}', [MenuController::class, 'manage'])->name('manage.menus');
    Route::post('/menus/create', [MenuController::class, 'store'])->name('create.menu');
    Route::patch('/menus/update', [MenuController::class, 'update'])->name('update.menu');
    Route::delete('/menus/delete/{menu}', [MenuController::class, 'delete'])->name('delete.menu');
    Route::post('/menus/add-menu-items-to-menu', [MenuController::class, 'addMenuItemToMenu'])->name('addMenuItems.menu');
    Route::patch('/menus/edit-menu-item/{menuItem}', [MenuController::class, 'editMenuItem'])->name('editMenuItem.menu');
    Route::delete('/menus/delete-menu-item/{menuItem}', [MenuController::class, 'deleteMenuItem'])->name('deleteMenuItem.menu');
});
