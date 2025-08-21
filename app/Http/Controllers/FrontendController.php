<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\HomePageSection;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
use App\Models\TradeInsightVolume;
use App\Models\Article;
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
        $featured_publications = Publication::whereHas('tags', function ($query) {
            return $query->where('name', 'featured');
        })->with(['file', 'category'])->latest()->limit(4)->get();
        $featured_blog_posts = Post::whereHas('category', function ($query) {
            $query->where('slug', 'opinion-in-lead');
        })->whereHas('tags', function ($query) {
            $query->where('name', 'featured');
        })
            ->latest()
            ->limit(2)
            ->get();


        $publications = Publication::with(['file', 'category'])
            ->orderBy('id', "DESC")
            ->limit(6)
            ->get();

        $slider = Slider::where('page_id', Page::where('name', 'home')->first()->id)->latest()->first();
        $slides = $slider ? Slide::where('slider_id', $slider->id)->with('media')->orderBy('id', 'DESC')->take(5)->get() : array();
        foreach ($slides as $slide) {
            $responsive = $slide->getFirstMedia('slides')?->getSrcSet('responsive');

            if ($responsive) {
                array_push($slidesResponsiveImages, $slide->getFirstMedia('slides')->getSrcSet('responsive'));
            }
        };
        $infocus = Post::whereHas('category', function ($query) {
            $query->where('slug', 'in-focus');
        })->whereHas('tags', function ($query) {
            $query->where('name', 'featured');
        })
            ->latest()
            ->limit(5)
            ->get();
        $sawteeInMedia = Post::whereHas('category', function ($query) {
            $query->where('slug', 'sawtee-in-media');
        })->where('status', 'published')->latest()->take(6)->get();
        $events = Post::whereHas('category', function ($query) {
            $query->where('slug', 'featured-events');
        })->where('status', 'published')->latest()->take(5)->get();

        $newsletters = Post::whereHas('category', function ($query) {
            $query->where('slug', 'newsletters');
        })->where('status', 'published')->latest()->take(6)->get();

        // Fetch the webinar series posts
        $webinars = Post::whereHas('category', function ($query) {
            $query->where('slug', 'webinar-series');
        })->where('status', 'published')->latest()->take(5)->get();

        return Inertia::render('Frontend/Pages/Home', [
            'slides' => $slides,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'events' => $events,
            'featuredPublications' => $featured_publications,
            'featuredBlogPosts'=> $featured_blog_posts,
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
            return $this->index();
        }
        // dd($page);

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
        $sawteeInMedia = Post::whereHas('category', function ($query) {
            $query->where('slug', 'sawtee-in-media');
        })->where('status', 'published')->latest()->take(5)->get();
        $tag = Tag::where('name', str_replace('-', ' ', $slug))->firstOrFail();

        $posts = $tag->posts()->paginate(10);
        if (!$post) {
            $post = $tag->publications()->paginate(10);
        }
        return Inertia::render('Frontend/Archives/Archive', [
            'meta_title' => $tag->title ?? $tag->name,
            'meta_description' => $tag->description ?? $tag->name,
            'layout_title' => $tag->name,
            'posts' => $posts,
            'sawteeInMedia' => $sawteeInMedia,
        ]);
    }

    public function themes($slug, $post = null)
    {
        $sawteeInMedia = Post::whereHas('category', function ($query) {
            $query->where('slug', 'sawtee-in-media');
        })->where('status', 'published')->latest()->take(5)->get();
        $theme = Theme::where('title', str_replace('-', ' ', $slug))->firstOrFail();

        $posts = $theme->posts()->paginate(10);
// dd($theme);
        return Inertia::render('Frontend/Archives/Archive', [
            'meta_title' => $theme->title ?? $theme->name,
            'meta_description' => $theme->description ?? $theme->name,
            'layout_title' => $theme->title ?? $theme->name,
            'posts' => $posts,
            'sawteeInMedia' => $sawteeInMedia,
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
        // dd($slug, $subcategory, $post);
        $segments = request()->segments();
        $category = Category::with('parent')->where('slug', $slug)->firstOrFail();

        // Common data for all views
        $infocus = Post::whereHas('category', function ($query) {
            $query->where('slug', 'in-focus');
        })->where('status', 'published')->latest()->take(5)->get();

        $sawteeInMedia = Post::whereHas('category', function ($query) {
            $query->where('slug', 'sawtee-in-media');
        })->where('status', 'published')->latest()->take(5)->get();

        $featured_image = $category->getFirstMediaUrl('category_media');
        $category_responsive_images = $category->getFirstMedia('category_media')?->getSrcset('responsive');

        // Handle different slug types
        switch ($slug) {
            case 'research':
                return $this->handleResearchCategory($category, $featured_image, $category_responsive_images);

            case 'teams':
                return $this->handleTeamsCategory($category, $subcategory, $featured_image, $category_responsive_images);

            case 'publications':
                return $this->handlePublicationsCategory(
                    $category,
                    $subcategory,
                    $segments,
                    $infocus,
                    $sawteeInMedia,
                    $featured_image,
                    $category_responsive_images
                );

            case 'programme':
                return $this->handleProgrammeCategory(
                    $category,
                    $slug,
                    $subcategory,
                    $post,
                    $segments,
                    $infocus,
                    $sawteeInMedia,
                    $featured_image,
                    $category_responsive_images
                );

            default:
                return $this->handleDefaultCategory(
                    $category,
                    $post = $subcategory,
                    $segments,
                    $infocus,
                    $sawteeInMedia,
                    $featured_image,
                    $category_responsive_images
                );
        }
    }

    private function handleResearchCategory($category, $featured_image, $category_responsive_images)
    {
        $collection = Research::with('media', 'file')->orderByDesc('id')->get();
        $posts = collect($collection)->groupBy('year')->all();

        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'posts' => $posts,
            'featured_image' => $featured_image,
            'srcSet' => $category_responsive_images
        ]);
    }

    private function handleTeamsCategory($category, $subcategory, $featured_image, $category_responsive_images)
    {
        if (!$subcategory) {
            $teams = Team::with('media')->orderBy('order', 'ASC')->simplePaginate(10);
            return Inertia::render('Frontend/Archives/TeamsArchive', [
                'category' => $category,
                'teams' => $teams,
                'featured_image' => $featured_image,
                'srcSet' => $category_responsive_images
            ]);
        }

        // Handle teams with subcategory if needed
        $posts = Team::with('media')->orderByDesc('order')->get();
        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'posts' => $posts,
            'featured_image' => $featured_image,
            'srcSet' => $category_responsive_images
        ]);
    }

    private function handlePublicationsCategory($category, $subcategory, $segments, $infocus, $sawteeInMedia, $featured_image, $category_responsive_images)
    {
        if ($subcategory) {
            $category = Category::with('parent')->where('slug', end($segments))->firstOrFail();
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
            return Inertia::render('Frontend/Archives/PublicationCategory', [
                'category' => $category,
                'publications' => $publications,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'featured_image' => $featured_image,
                'srcSet' => $category_responsive_images
            ]);
        } else {
            // Main publications page
            $publications = $category->getAllPublicationsPost($category);
            return Inertia::render('Frontend/Archives/PublicationsArchive', [
                'category' => $category,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'publications' => $publications,
                'srcSet' => $category_responsive_images
            ]);
        }
    }

    private function handleProgrammeCategory($category, $slug, $subcategory, $post, $segments, $infocus, $sawteeInMedia, $featured_image, $category_responsive_images)
    {
        if ($subcategory) {
            $category = Category::with('parent')->where('slug', $subcategory)->firstOrFail();
            // dd($category, $slug, $subcategory, $post);
            if ($post) {
                return $this->renderPost($category, $segments, $infocus, $sawteeInMedia);
            } else {
                $posts = Post::with('category', 'category.parent', 'media')
                    ->where("category_id", $category->id)
                    ->where("status", "published")
                    ->orderByDesc('id')
                    ->paginate(10);


                return Inertia::render('Frontend/Category', [
                    'category' => $category,
                    'posts' => $posts,
                    'infocus' => $infocus,
                    'sawteeInMedia' => $sawteeInMedia,
                    'featured_image' => $featured_image,
                    'srcSet' => $category_responsive_images
                ]);
            }
        } else {
            // Main category page
            if ($post) {
                return $this->renderPost($category, $segments, $infocus, $sawteeInMedia);
            } else {
                $subcategory_ids = $category->children->pluck('id')->toArray();
                $parent_and_subcategory_ids = array_merge(
                    array($slug === 'programme' ? null : $category->id),
                    $subcategory_ids
                );

                $posts = Post::query()
                    ->whereIn('category_id', $parent_and_subcategory_ids)
                    ->orderByDesc('id')
                    ->with('category', 'category.parent', 'media')
                    ->where('status', 'published')
                    ->paginate(10);

                return Inertia::render('Frontend/Category', [
                    'category' => $category,
                    'posts' => $posts,
                    'infocus' => $infocus,
                    'sawteeInMedia' => $sawteeInMedia,
                    'featured_image' => $featured_image,
                    'srcSet' => $category_responsive_images
                ]);
            }
        }
    }

    private function handleDefaultCategory($category, $post, $segments, $infocus, $sawteeInMedia, $featured_image, $category_responsive_images)
    {
        // dd($category, $post);
        if ($post) {
            return $this->renderPost($category, $segments);
        } else {
            // Handle subcategory without post
            $posts = Post::with('category', 'category.parent', 'media')
                ->where("category_id", $category->id)
                ->where("status", "published")
                ->orderByDesc('id')
                ->paginate(10);

            return Inertia::render('Frontend/Category', [
                'category' => $category,
                'posts' => $posts,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'featured_image' => $featured_image,
                'srcSet' => $category_responsive_images
            ]);
        }
    }

    private function renderPost($category, $segments)
    {
        $post_slug = end($segments);

        if (!$category) {
            $category = Category::where('slug', $segments[1])->firstOrFail();
        }

        $post = Post::where("category_id", $category->id)
            ->where("status", "published")
            ->where('slug', $post_slug)
            ->firstOrFail();

        $related_posts = Post::where("category_id", $category->id)
            ->where("status", "published")
            ->where('slug', '!=', $post_slug)
            ->latest()
            ->take(5)
            ->get();

        $media = $post->getFirstMediaUrl('post-featured-image');
        $srcSet = $post->getFirstMedia('post-featured-image')?->getSrcSet('responsive');
        $file = $post->getFirstMediaurl('post-files');

        return Inertia::render('Frontend/Post', [
            'post' => $post->load('category', 'category.parent', 'tags'),
            'category' => $category,
            'featured_image' => $media,
            "srcSet" => $srcSet,
            'file' => $file,
            'relatedPosts' => $related_posts
        ]);
    }

    public function trade_insight_volume($volumeSlug = null, $articleSlug = null)
    {
        $trade_insight_volume = TradeInsightVolume::with('articles')->where('slug', $volumeSlug)->firstOrFail();
        if (!$articleSlug) {
            // Common data for all views
            $infocus = Post::whereHas('category', function ($query) {
                $query->where('slug', 'in-focus');
            })->where('status', 'published')->latest()->take(5)->get();

            $sawteeInMedia = Post::whereHas('category', function ($query) {
                $query->where('slug', 'sawtee-in-media');
            })->where('status', 'published')->latest()->take(5)->get();

            return Inertia::render('Frontend/Archives/TradeInsights', [
                'tradeInsightVolume' => $trade_insight_volume,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
            ]);
        } else {
            $article = Article::where('slug', $articleSlug)->firstOrFail();

            $media = $article->getFirstMediaUrl('article-featured-image');
            $srcSet = $article->getFirstMedia('article-featured-image')?->getSrcSet('responsive');
            $related_articles = Article::where("trade_insight_volume_id", $trade_insight_volume->id)
                ->where('slug', '!=', $articleSlug)
                ->latest()
                ->take(5)
                ->get();
            return Inertia::render('Frontend/Article', [
                'article' => $article,
                'volume' => $trade_insight_volume,
                'featured_image' => $media,
                "srcSet" => $srcSet,
                'relatedArticles' => $related_articles
            ]);
        }
    }

    public function search(Request $request)
    {
        if ($request->query()) {
            $query = $request->query();
            $publications = Publication::search($request->search)->paginate();
            $research = Research::search($request->search)->paginate();

            $posts = Post::search($query['query'])->paginate(10);
            return Inertia::render('Frontend/SearchPage', ['posts' => $posts, 'publications' => $publications, 'research' => $research, 'query' => $query['query']]);
        }
        return Inertia::render('Frontend/SearchPage', ['posts' => null]);
    }
}
