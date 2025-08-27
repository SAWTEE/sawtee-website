<?php

use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomePageSectionController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PublicationController;
use App\Http\Controllers\Admin\ResearchController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\FellowshipController;
use App\Http\Controllers\Admin\FellowController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\InstituteController;
use App\Http\Controllers\Admin\PublishedStoryController;
use App\Http\Controllers\Admin\TradeInsightVolumeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;


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

require __DIR__ . '/auth.php';

Route::get('/admin', function () {
    return to_route('login');
});

Route::get('/admin/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');


Route::post('/admin/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/search', SearchController::class);

Route::get('/', [FrontendController::class, 'index'])->name('home');
Route::get('/trade-insight/{volume}/{article?}', [FrontendController::class, 'trade_insight_volume'])->name('trade-insight-volume.show');
Route::get('/{pages:slug?}', [FrontendController::class, 'page'])->name('page.show');
Route::get('/tags/{tags:slug}/{subcategory?}/{post?}', [FrontendController::class, 'tags']);
Route::get('/themes/{themes:slug}/{subcategory?}/{post?}', [FrontendController::class, 'themes']);
Route::redirect('/article/{post}', '/category/opinion-in-lead/{post}', 301)->name('article.redirect');
Route::get('/category/{categories:slug}/{subcategory?}/{post?}', [FrontendController::class, 'category'])->name('category.show');



Route::middleware(['auth', 'verified', 'abuseip'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::resource('/categories', CategoryController::class);
    Route::resource('/themes', ThemeController::class);
    Route::resource('/tags', TagController::class);
    Route::resource('/sections', SectionController::class);
    Route::resource('/publications', PublicationController::class);
    Route::resource('/research', ResearchController::class);
    Route::resource('/sliders', SliderController::class);
    Route::resource('/slides', SlideController::class);
    Route::resource('/pages', PageController::class);
    Route::resource('/home-page-sections', HomePageSectionController::class);
    Route::resource('/teams', TeamController::class);

    Route::get('/posts', [  PostController::class, 'index'])->name('posts.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::get('/posts/edit/{id}', [PostController::class, 'edit'])->name('posts.edit');
    Route::post('/posts/store', [PostController::class, 'store'])->name('posts.store');
    Route::patch('/posts/update/{id}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/delete/{id}', [PostController::class, 'destroy'])->name('posts.destroy');

    Route::post('/post/uploadmedia', [PostController::class, 'uploadmedia'])->name('post.upload');
    Route::get("/menus", [MenuController::class, 'index'])->name('menus.index');
    Route::get('/menus/manage-menus/{id?}', [MenuController::class, 'manage'])->name('manage.menus');
    Route::post('/menus/create', [MenuController::class, 'store'])->name('create.menu');
    Route::patch('/menus/update', [MenuController::class, 'update'])->name('update.menu');
    Route::delete('/menus/delete/{id}', [MenuController::class, 'delete'])->name('delete.menu');
    Route::post('/menus/add-menu-items-to-menu', [MenuController::class, 'addMenuItemToMenu'])->name('addMenuItems.menu');
    Route::patch('/menus/edit-menu-item/{id}', [MenuController::class, 'editMenuItem'])->name('editMenuItem.menu');
    Route::delete('/menus/delete-menu-item/{id}', [MenuController::class, 'deleteMenuItem'])->name('deleteMenuItem.menu');
    Route::post('/menus/add-custom-link', [MenuController::class, 'addCustomLink'])->name('addCustomLink.menu');
    Route::resource('/trade-insight-volumes', TradeInsightVolumeController::class);
    Route::resource('/articles', ArticleController::class);
    Route::resource('/fellowships', FellowshipController::class);
    Route::resource('/fellows', FellowController::class);
    Route::resource('/published-stories', PublishedStoryController::class);
    Route::resource('/members', MemberController::class);
    Route::resource('/institutes', InstituteController::class);
});
