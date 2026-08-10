<?php

namespace App\Support;

use App\Models\Fellow;
use App\Models\Fellowship;
use App\Models\PublishedStory;
use Illuminate\Support\Str;

class MediaFellowshipAssembler
{
    /**
     * Shape fellowship cohorts for the MediaFellows Inertia page.
     *
     * @return list<array{year: string, description: string, fellows: list<array<string, mixed>>}>
     */
    public function assemble(): array
    {
        return Fellowship::query()
            ->with([
                'fellows' => fn ($query) => $query->orderBy('id'),
                'fellows.media',
                'fellows.published_stories.media',
            ])
            ->orderByDesc('year')
            ->get()
            ->map(fn (Fellowship $fellowship) => [
                'year' => (string) $fellowship->year,
                'description' => $fellowship->description,
                'fellows' => $fellowship->fellows
                    ->map(fn (Fellow $fellow) => $this->fellowToArray($fellow))
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function fellowToArray(Fellow $fellow): array
    {
        return [
            'id' => $fellow->id,
            'name' => $fellow->name,
            'avatar' => $fellow->getFirstMediaUrl('profile_picture') ?: '',
            'designation' => $fellow->designation,
            'bio' => $fellow->description,
            'experience' => $this->experienceParagraphs($fellow->experience),
            'published_stories' => $fellow->published_stories
                ->map(fn (PublishedStory $story) => $this->storyToArray($story))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{title: string, link: string, image_src: list<string>, media_src: ?string}
     */
    protected function storyToArray(PublishedStory $story): array
    {
        $images = $story->getMedia('published-story-images')
            ->map(fn ($media) => $media->getUrl())
            ->filter()
            ->values()
            ->all();

        return [
            'title' => $story->title,
            'link' => $story->link,
            'image_src' => $images,
            'media_src' => $story->media_src,
        ];
    }

    /**
     * @return list<string>
     */
    public function experienceParagraphs(?string $experience): array
    {
        if ($experience === null || trim($experience) === '') {
            return [];
        }

        if (str_contains($experience, '<')) {
            preg_match_all('/<p\b[^>]*>(.*?)<\/p>/is', $experience, $matches);

            if ($matches[1] !== []) {
                return collect($matches[1])
                    ->map(fn (string $html) => trim($html))
                    ->filter()
                    ->values()
                    ->all();
            }
        }

        return collect(preg_split("/\n{2,}/", $experience) ?: [])
            ->map(fn (string $chunk) => trim($chunk))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Keep intentional HTML in seeded experience (links etc.) while wrapping plain strings.
     *
     * @param  list<string>  $paragraphs
     */
    public function experienceToStoredHtml(array $paragraphs): string
    {
        return collect($paragraphs)
            ->map(function (string $paragraph) {
                $trimmed = trim($paragraph);

                if ($trimmed === '') {
                    return null;
                }

                if (Str::contains($trimmed, ['<a ', '<p>', '<strong>', '<em>'])) {
                    return str_starts_with($trimmed, '<p') ? $trimmed : '<p>'.$trimmed.'</p>';
                }

                return '<p>'.e($trimmed).'</p>';
            })
            ->filter()
            ->implode("\n");
    }
}
