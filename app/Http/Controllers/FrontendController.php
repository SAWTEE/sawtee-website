<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\HomePageSection;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Research;
use App\Models\Section;
use App\Models\Slide;
use App\Models\Slider;
use App\Models\Tag;
use App\Models\Team;
use App\Models\Theme;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

// use Spatie\Newsletter\Facades\Newsletter;

/**
 * A function to retrieve posts based on category and slug.
 *
 * @param Category $category The category object.
 * @param string $slug The slug parameter.
 * @return \Illuminate\Pagination\LengthAwarePaginator|array The paginated list of posts or grouped posts.
 */
function getPosts($category, $slug)
{
    $subcategory_ids = $category->children->pluck('id')->toArray();
    $parent_and_subcategory_ids = array_merge(array($slug === 'programme' ? null : $category->id), $subcategory_ids);
    $posts = Post::query()
        ->with('category', 'category.parent', 'media')
        ->whereIn('category_id', $parent_and_subcategory_ids)
        ->orderByDesc('id')
        ->where('status', 'published')
        ->paginate(10);

    // If route is for research category
    if ($slug === 'research') {
        $collection = Research::with('media', 'file')->orderByDesc('id')->get();
        $posts = collect($collection)->groupBy('year')->all();
    }

    // If route is for teams category
    if ($slug === 'teams') {
        $posts = Team::with('media')->orderByDesc('order')->get();
    }

    return $posts;
}

class FrontendController extends Controller
{
    /**
     * Retrieves data for the home page and renders the 'Frontend/Pages/Home' view.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $home_page_sections = HomePageSection::all();
        $slidesResponsiveImages = array();
        $featured = Tag::where('name', 'featured')->firstOrFail();
        // $featured_publications = $featured->publications()->latest()->limit(5)->get();
        $featured_publications = Publication::whereHas('tags', function($query) {
            return $query->where('name', 'featured');
        })->with(['file', 'category'])->latest()->limit(5)->get();
        $publications = Publication::with(['file', 'category'])
        ->orderBy('id', "DESC")
        ->limit(6)
        ->get();
        // dd($featured_publications);

        $slider = Slider::where('page_id', Page::where('name', 'home')->first()->id)->latest()->first();
        $slides = $slider ? Slide::where('slider_id', $slider->id)->with('media')->orderBy('id', 'DESC')->take(5)->get() : Array();
        foreach ($slides as $slide) {
            $responsive = $slide->getFirstMedia('slides')?->getSrcSet('responsive');

            if ($responsive) {
                array_push($slidesResponsiveImages, $slide->getFirstMedia('slides')->getSrcSet('responsive'));
            }
        }
        $infocus = Category::where('slug', 'in-focus')->firstOrFail()->posts()->where('status', 'published')->whereHas('tags', function ($query) {
            $query->where('name', 'featured');
        })->latest()->take(5)->get();
        $sawteeInMedia = Category::where('slug', 'sawtee-in-media')->firstOrFail()->posts()->where('status', 'published')->latest()->take(6)->get();
        $events = Category::where('slug', 'featured-events')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $newsletters = Category::where('slug', 'newsletters')->firstOrFail()->posts()->where('status', 'published')->latest()->take(6)->get();
        $webinars = Category::where('slug', 'webinar-series')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();

        return Inertia::render('Frontend/Pages/Home', [
            'slides' => $slides,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'events' => $events,
            'featuredPublications' => $featured_publications,
            'publications' => $publications,
            'newsletters' => $newsletters,
            'webinars' => $webinars,
            'slidesResponsiveImages' => $slidesResponsiveImages,
            'homePageSections' => $home_page_sections
        ]);
    }

    /**
     * Retrieves a page by its slug and loads associated sections and themes if necessary.
     *
     * @param datatype $slug The slug of the page to retrieve
     * @throws ModelNotFoundException if the page is not found
     * @return \Inertia\Response
     */
    public function page($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        $sections = Section::where('page_id', $page->id)->get();
        $themes = null;

        if ($slug === 'our-work') {
            $themes = Theme::all();
        }

        if ($slug === 'home') {
            return to_route('home');
        }

        return Inertia::render('Frontend/Page', [
            'page' => $page,
            'sections' => $sections->load(['media']),
            'themes' => $themes,
            'featured_image' => $page->getFirstMediaUrl('page-media'),
            'srcSet' => $page->getFirstMedia('page-media')?->getSrcset('responsive'),
        ]);
    }


    public function tags($slug, $post = null)
    {
        $infocus = Category::where('slug', 'in-focus')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $sawteeInMedia = Category::where('slug', 'sawtee-in-media')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $events = Category::where('slug', 'featured-events')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $tag = Tag::where('name', str_replace('-', ' ', $slug))->firstOrFail();

        $posts = $tag->posts()->paginate(10);
        if (!$post) {
            $post = $tag->publications()->paginate(10);
        }
        return Inertia::render('Frontend/Archives/TagsArchive', [
            'tag' => $tag,
            'posts' => $posts,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'events' => $events->load(['category', 'media']),

        ]);
    }

    public function themes($slug, $post = null)
    {
        $infocus = Category::where('slug', 'in-focus')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $sawteeInMedia = Category::where('slug', 'sawtee-in-media')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $events = Category::where('slug', 'featured-events')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $theme = Theme::where('title', str_replace('-', ' ', $slug))->firstOrFail();

        $posts = $theme->posts()->paginate(10);

        return Inertia::render('Frontend/Archives/ThemesArchive', [
            'theme' => $theme,
            'posts' => $posts,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'events' => $events->load(['category', 'media']),

        ]);
    }




    /**
     * Retrieves the category, subcategory, and post information based on the provided slugs.
     *
     * @param string $slug The slug of the category.
     * @param string|null $subcategory The slug of the subcategory (optional).
     * @param string|null $post The slug of the post (optional).
     * @return \Inertia\Response The rendered Inertia response.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the category is not found.
     */
    public function category($slug, $subcategory = null, $post = null)
    {
        $segments = request()->segments();
        $infocus = Category::where('slug', 'in-focus')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $sawteeInMedia = Category::where('slug', 'sawtee-in-media')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $events = Category::where('slug', 'featured-events')->firstOrFail()->posts()->where('status', 'published')->latest()->take(5)->get();
        $category = Category::where('slug', $slug)->firstOrFail();
        $featured_image = $category->getFirstMediaUrl('category_media');
        $category_responsive_images = $category->getFirstMedia('category_media')?->getSrcset('responsive');
        $posts = getPosts($category, $slug);

        // If route is for publications category
        if ($slug === 'publications' && !$subcategory) {
            $publications = $category->getAllPublicationsPost($category);
            // dd($publications);
            return Inertia::render('Frontend/Archives/PublicationsArchive', [
                'category' => $category,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'publications' => $publications,
                'srcSet' => $category_responsive_images
            ]);
        }

        if ($slug === 'teams' && !$subcategory) {
            $teams = Team::with('media')->orderBy('order', 'ASC')->simplePaginate(10);
            return Inertia::render('Frontend/Archives/TeamsArchive', [
                'category' => $category,
                'teams' => $teams,
                'featured_image' => $featured_image,
                'srcSet' => $category_responsive_images
            ]);
        }




        // if route is for category/subcategory/post eg: sawtee.org/programmes/ongoing-programmes/post-slug
        if ($subcategory && $post) {
            $post_slug = $segments[3];
            $category = Category::where('slug', $subcategory)->firstOrFail();
            $post =
            Post::where("category_id", $category->id)->where("status", "published")->where('slug', $post_slug)->firstOrFail();
            $related_posts = Post::where("category_id", $category->id)->where("status", "published")->where('slug', '!=', $post_slug)->latest(5)->get();
            $media = $post->getFirstMediaUrl('post-featured-image');
            $srcSet = $post->getFirstMedia('post-featured-image')?->getSrcSet('responsive');
            $file = $post->getFirstMediaurl('post-files');
            return Inertia::render('Frontend/Post', ['post' => $post->load('category', 'category.parent', 'tags'), 'featured_image' => $media, "srcSet" => $srcSet, 'file' => $file, 'relatedPosts' => $related_posts]);
        }

        // if route is for category/category-post_slug/subcategory eg: sawtee.org/category/programmes/ongoing-programmes/
        if ($subcategory) {
            $category = Category::with('parent')->where('slug', $subcategory)->first();
            if ($slug === 'publications') {
                if (count($category->children) > 0) {
                    $publications = $category->getAllPublicationsPost($category);
                    return Inertia::render('Frontend/Archives/PublicationsArchive', [
                        'category' => $category,
                        'infocus' => $infocus,
                        'sawteeInMedia' => $sawteeInMedia,
                        'publications' => $publications,
                        'srcSet' => $category_responsive_images
                    ]);
                } else {
                    $publications = Publication::where('category_id', $category->id)->orderByDesc('id')->paginate(12);

                }

            dd('Here');

                return Inertia::render('Frontend/Archives/PublicationCategory', [
                    'category' => $category,
                    'publications' => $publications,
                    'infocus' => $infocus,
                    'sawteeInMedia' => $sawteeInMedia,
                    'featured_image' => $featured_image,
                    'srcSet' => $category_responsive_images
                ]);

            }

            if (!$category) {
                $category = Category::with('parent')->where('slug', $segments[1])->firstOrFail();
                $post = Post::where("category_id", $category->id)->where("status", "published")->where('slug', $segments[2])->firstOrFail();
                $related_posts = Post::where("category_id", $category->id)->where("status", "published")->where('slug', '!=', $slug)->latest()->take(5)->get();
                $media = $post->getFirstMediaUrl('post-featured-image');
                $srcSet = $post->getFirstMedia('post-featured-image')?->getSrcSet('responsive');
                $file = $post->getFirstMediaurl('post-files');
                return Inertia::render('Frontend/Post', ['post' => $post->load('category', 'category.parent', 'tags'), 'featured_image' => $media, "srcSet" => $srcSet, 'file' => $file, 'relatedPosts' => $related_posts]);
            }
            dd('Here');

            return Inertia::render('Frontend/Category', [
                'category' => $category->load(['parent', 'children']),
                'posts' => $posts,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'featured_image' => $featured_image,
                'srcSet' => $category_responsive_images
            ]);
        }

        return Inertia::render('Frontend/Category', [
            'category' => $category->load(['parent', 'children']),
            'posts' => $posts,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'events' => $events->load(['category', 'media']),
            'featured_image' => $featured_image,
            'srcSet' => $category_responsive_images
        ]);
    }

    public function search(Request $request)
    {
        if ($request->query()) {
            $query = $request->query();
            // dd($query);
            // $publications = Publication::search($request->search)->get();
            // $research = Research::search($request->search)->get();

            $posts = Post::search($query['query'])->paginate(10);

            // dd($posts);
            // $result = array_merge($posts, $publications, $research);
            // return response()->json($posts);
            return Inertia::render('Frontend/SearchPage', ['posts' => $posts, 'query' => $query['query']]);
        }
        return Inertia::render('Frontend/SearchPage', ['posts' => null]);

    }
}
