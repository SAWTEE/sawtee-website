<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasSeoMeta
{
    /**
     * Prefer explicit meta_title; fall back to the model's primary title field.
     */
    protected function resolvedMetaTitle(): Attribute
    {
        return Attribute::get(function (): string {
            $explicit = $this->attributes['meta_title'] ?? null;

            if (filled($explicit)) {
                return (string) $explicit;
            }

            foreach (['title', 'name'] as $field) {
                if (filled($this->attributes[$field] ?? null)) {
                    return (string) $this->attributes[$field];
                }
            }

            return config('app.name', 'SAWTEE');
        });
    }

    /**
     * Prefer explicit meta_description; fall back to excerpt or stripped body.
     */
    protected function resolvedMetaDescription(): Attribute
    {
        return Attribute::get(function (): string {
            $explicit = $this->attributes['meta_description'] ?? null;

            if (filled($explicit)) {
                return (string) $explicit;
            }

            foreach (['excerpt', 'description', 'subtitle', 'content'] as $field) {
                $value = $this->attributes[$field] ?? null;

                if (! filled($value)) {
                    continue;
                }

                $plain = trim(preg_replace('/\s+/', ' ', strip_tags((string) $value)) ?? '');

                if ($plain === '') {
                    continue;
                }

                return mb_strlen($plain) > 160
                    ? mb_substr($plain, 0, 157).'...'
                    : $plain;
            }

            return '';
        });
    }
}
