<?php

namespace App\Actions\Frontend;

use App\Models\Article;
use App\Models\Category;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Research;
use App\Models\Team;
use App\Support\MediaConversionUrl;
use App\Support\ResolvesSeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuildCategoryArchive
{
    public function __construct(protected ResolvesSeoMeta $seo) {}

    public function handle(
        Request $request,
        string $slug,
        ?string $subcategory = null,
        ?string $post = null,
        ?string $article = null,
    ): Response {
        $segments = $request->segments();

        $infocus = $slug === 'in-focus' ? null : $this->postsByCategorySlug('in-focus', 5);
        $sawteeInMedia = $slug === 'sawtee-in-media' ? null : $this->postsByCategorySlug('sawtee-in-media', 5);
        $events = $slug === 'featured-events' ? null : $this->postsByCategorySlug('featured-events', 5);

        $category = Category::with(
            $slug === 'publications' ? ['parent', 'children'] : ['parent']
        )->where('slug', $slug)->firstOrFail();
        $featuredImage = $category->getFirstMediaUrl('category_media');
        $categoryResponsiveImages = MediaConversionUrl::optional(
            $category->getFirstMedia('category_media'),
            'large'
        );

        return match ($slug) {
            'research' => $this->handleResearchCategory($category, $featuredImage, $categoryResponsiveImages),
            'teams' => $this->handleTeamsCategory($category, $subcategory, $featuredImage, $categoryResponsiveImages),
            'publications' => $this->handlePublicationsCategory(
                $category,
                $subcategory,
                $segments,
                $post,
                $article,
                $infocus,
                $sawteeInMedia,
                $featuredImage,
                $categoryResponsiveImages
            ),
            'programme' => $this->handleProgrammeCategory(
                $category,
                $slug,
                $subcategory,
                $post,
                $segments,
                $infocus,
                $sawteeInMedia,
                $featuredImage,
                $categoryResponsiveImages
            ),
            default => $this->handleDefaultCategory(
                $category,
                $subcategory,
                $segments,
                $infocus,
                $sawteeInMedia,
                $events,
                $featuredImage,
                $categoryResponsiveImages
            ),
        };
    }

    protected function postsByCategorySlug(string $slug, int $limit)
    {
        return Post::with(['category', 'media'])
            ->whereHas('category', fn ($query) => $query->where('slug', $slug))
            ->where('status', 'published')
            ->latest()
            ->take($limit)
            ->get();
    }

    protected function handleResearchCategory($category, $featuredImage, $categoryResponsiveImages): Response
    {
        $collection = Research::with('media', 'file')->orderByDesc('id')->get();
        $posts = collect($collection)->groupBy('year')->all();

        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'posts' => $posts,
            'featured_image' => $featuredImage,
            'srcSet' => $categoryResponsiveImages,
            'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
        ]);
    }

    protected function handleTeamsCategory($category, $subcategory, $featuredImage, $categoryResponsiveImages): Response
    {
        if (! $subcategory) {
            $teams = Team::with('media')->orderBy('order', 'ASC')->simplePaginate(10);

            return Inertia::render('Frontend/Archives/TeamsArchive', [
                'category' => $category,
                'teams' => $teams,
                'featured_image' => $featuredImage,
                'srcSet' => $categoryResponsiveImages,
                'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
            ]);
        }

        $posts = Team::with('media')->orderByDesc('order')->get();

        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'posts' => $posts,
            'featured_image' => $featuredImage,
            'srcSet' => $categoryResponsiveImages,
            'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
        ]);
    }

    protected function handlePublicationsCategory(
        $category,
        $subcategory,
        $segments,
        $post,
        $article,
        $infocus,
        $sawteeInMedia,
        $featuredImage,
        $categoryResponsiveImages,
    ): Response {
        if ($post) {
            $tradeInsightVolume = Publication::with('articles', 'media')->whereHas('category', function ($query) {
                $query->where('slug', 'trade-insight');
            })->where('volume_slug', $post)->firstOrFail();

            $isArticleSlug = Article::where('slug', $article)->exists();

            if ($isArticleSlug) {
                $articleModel = Article::with(['tags', 'media'])->where('slug', $article)->firstOrFail();
                $media = $articleModel->getFirstMediaUrl('article-featured-image');
                $srcSet = MediaConversionUrl::optional(
                    $articleModel->getFirstMedia('article-featured-image'),
                    'large'
                );
                $relatedArticles = Article::select(['id', 'title', 'slug', 'published_at'])
                    ->where('publication_id', $tradeInsightVolume->id)
                    ->whereKeyNot($articleModel->id)
                    ->latest()
                    ->take(5)
                    ->get();

                return Inertia::render('Frontend/Article', [
                    'article' => $articleModel,
                    'volume' => $tradeInsightVolume,
                    'featured_image' => $media,
                    'srcSet' => $srcSet,
                    'relatedArticles' => $relatedArticles,
                    'seo' => $this->seo->for(
                        model: $articleModel,
                        image: $media ?: null,
                        type: 'article',
                        jsonLd: $this->seo->articleJsonLd(
                            headline: $articleModel->resolved_meta_title,
                            description: $articleModel->resolved_meta_description,
                            author: $articleModel->author,
                            datePublished: optional($articleModel->published_at)->toAtomString(),
                            image: $media ?: null,
                        ),
                    ),
                ]);
            }

            $media = $tradeInsightVolume->getFirstMediaUrl('publication_featured_image');

            return Inertia::render('Frontend/SingleTradeInsight', [
                'tradeInsightVolume' => $tradeInsightVolume,
                'media' => $media,
                'seo' => $this->seo->for(model: $tradeInsightVolume, image: $media ?: null),
            ]);
        }

        if ($subcategory) {
            $category = Category::with(['parent', 'children'])
                ->where('slug', end($segments))
                ->firstOrFail();

            if (count($category->children) > 0) {
                $publications = $category->getAllPublicationsPost($category);

                return Inertia::render('Frontend/Archives/PublicationsArchive', [
                    'category' => $category,
                    'infocus' => $infocus,
                    'sawteeInMedia' => $sawteeInMedia,
                    'publications' => $publications,
                    'srcSet' => $categoryResponsiveImages,
                    'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
                ]);
            }

            $publications = Publication::where('category_id', $category->id)->orderByDesc('id')->paginate(12);

            return Inertia::render('Frontend/Archives/PublicationCategory', [
                'category' => $category,
                'publications' => $publications,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'featured_image' => $featuredImage,
                'srcSet' => $categoryResponsiveImages,
                'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
            ]);
        }

        $publications = $category->getAllPublicationsPost($category);

        return Inertia::render('Frontend/Archives/PublicationsArchive', [
            'category' => $category,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'publications' => $publications,
            'srcSet' => $categoryResponsiveImages,
            'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
        ]);
    }

    protected function handleProgrammeCategory(
        $category,
        $slug,
        $subcategory,
        $post,
        $segments,
        $infocus,
        $sawteeInMedia,
        $featuredImage,
        $categoryResponsiveImages,
    ): Response {
        if ($subcategory) {
            $category = Category::with('parent')->where('slug', $subcategory)->firstOrFail();

            if ($post) {
                return $this->renderPost($category, $segments);
            }

            $posts = Post::with('category', 'category.parent', 'media')
                ->where('category_id', $category->id)
                ->where('status', 'published')
                ->orderByDesc('id')
                ->paginate(10);

            return Inertia::render('Frontend/Category', [
                'category' => $category,
                'posts' => $posts,
                'infocus' => $infocus,
                'sawteeInMedia' => $sawteeInMedia,
                'featured_image' => $featuredImage,
                'srcSet' => $categoryResponsiveImages,
                'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
            ]);
        }

        $subcategoryIds = $category->children->pluck('id')->toArray();
        $parentAndSubcategoryIds = array_filter(
            array_merge([$slug === 'programme' ? null : $category->id], $subcategoryIds),
            fn ($id) => ! is_null($id)
        );

        $posts = Post::query()
            ->whereIn('category_id', $parentAndSubcategoryIds)
            ->orderByDesc('id')
            ->with('category', 'category.parent', 'media')
            ->where('status', 'published')
            ->paginate(10);

        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'posts' => $posts,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'featured_image' => $featuredImage,
            'srcSet' => $categoryResponsiveImages,
            'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
        ]);
    }

    protected function handleDefaultCategory(
        $category,
        $post,
        $segments,
        $infocus,
        $sawteeInMedia,
        $events,
        $featuredImage,
        $categoryResponsiveImages,
    ): Response {
        if ($post) {
            return $this->renderPost($category, $segments);
        }

        $posts = Post::with('category', 'category.parent', 'media')
            ->where('category_id', $category->id)
            ->where('status', 'published')
            ->orderByDesc('id')
            ->paginate(10);

        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'posts' => $posts,
            'infocus' => $infocus,
            'sawteeInMedia' => $sawteeInMedia,
            'events' => $events,
            'featured_image' => $featuredImage,
            'srcSet' => $categoryResponsiveImages,
            'seo' => $this->seo->for(model: $category, image: $featuredImage ?: null),
        ]);
    }

    protected function renderPost($category, $segments): Response
    {
        $postSlug = end($segments);

        if (! $category) {
            $category = Category::where('slug', $segments[1])->firstOrFail();
        }

        $post = Post::with('category', 'category.parent')
            ->where('status', 'published')
            ->where('slug', $postSlug)
            ->firstOrFail();

        $relatedPosts = Post::with('category', 'category.parent')
            ->whereHas('category', fn ($query) => $query->where('category_id', $category->id))
            ->where('status', 'published')
            ->where('slug', '!=', $postSlug)
            ->latest()
            ->take(5)
            ->get();

        $file = $post->getFirstMediaUrl('post-files');
        $media = $post->getFirstMediaUrl('post-featured-image');
        $srcSet = MediaConversionUrl::optional($post->getFirstMedia('post-featured-image'), 'large');

        return Inertia::render('Frontend/Post', [
            'post' => $post,
            'category' => $category,
            'featured_image' => $media,
            'srcSet' => $srcSet,
            'file' => $file,
            'relatedPosts' => $relatedPosts,
            'seo' => $this->seo->for(
                model: $post,
                image: $media ?: null,
                type: 'article',
                jsonLd: $this->seo->articleJsonLd(
                    headline: $post->resolved_meta_title,
                    description: $post->resolved_meta_description,
                    author: $post->author,
                    datePublished: optional($post->published_at)->toAtomString(),
                    image: $media ?: null,
                ),
            ),
        ]);
    }
}
