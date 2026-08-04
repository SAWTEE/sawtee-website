<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

class ResolvesSeoMeta
{
    /**
     * Build a shared SEO payload for Inertia pages.
     *
     * @return array{
     *     title: string,
     *     description: string,
     *     image: string|null,
     *     url: string,
     *     type: string,
     *     jsonLd: array<string, mixed>|null
     * }
     */
    public function for(
        ?Model $model = null,
        ?string $title = null,
        ?string $description = null,
        ?string $image = null,
        ?string $url = null,
        string $type = 'website',
        ?array $jsonLd = null,
    ): array {
        $resolvedTitle = $title
            ?? (is_object($model) && isset($model->resolved_meta_title) ? (string) $model->resolved_meta_title : null)
            ?? config('app.name', 'SAWTEE');

        $resolvedDescription = $description
            ?? (is_object($model) && isset($model->resolved_meta_description) ? (string) $model->resolved_meta_description : null)
            ?? '';

        return [
            'title' => $resolvedTitle,
            'description' => $resolvedDescription,
            'image' => $image ?? '/assets/logo-sawtee.webp',
            'url' => $url ?? url()->current(),
            'type' => $type,
            'jsonLd' => $jsonLd,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function articleJsonLd(
        string $headline,
        ?string $description,
        ?string $author,
        ?string $datePublished,
        ?string $image = null,
        ?string $url = null,
    ): array {
        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $headline,
            'description' => $description,
            'author' => $author ? [
                '@type' => 'Person',
                'name' => $author,
            ] : null,
            'datePublished' => $datePublished,
            'image' => $image,
            'url' => $url ?? url()->current(),
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'SAWTEE',
                'url' => config('app.url'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => url('/assets/logo-sawtee.webp'),
                ],
            ],
        ], fn ($value) => $value !== null && $value !== '');
    }
}
