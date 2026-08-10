<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class SearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $maxYear = (int) date('Y') + 1;

        return [
            'query' => ['nullable', 'string', 'max:200'],
            'category' => ['nullable', 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:'.$maxYear],
            'theme' => ['nullable', 'integer', 'min:1'],
            'page' => ['nullable', 'integer', 'min:1', 'max:1000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'query' => $this->sanitizeQuery($this->input('query')),
            'category' => $this->sanitizeSlug($this->input('category')),
            'year' => $this->sanitizeBoundedInt($this->input('year'), 1900, (int) date('Y') + 1),
            'theme' => $this->sanitizeBoundedInt($this->input('theme'), 1, PHP_INT_MAX),
            'page' => $this->sanitizeBoundedInt($this->input('page'), 1, 1000),
        ]);
    }

    /**
     * @return array{query: string, category: string, year: int|null, theme: int|null, page: int|null}
     */
    public function filters(): array
    {
        $validated = $this->validated();

        return [
            'query' => (string) ($validated['query'] ?? ''),
            'category' => (string) ($validated['category'] ?? ''),
            'year' => isset($validated['year']) ? (int) $validated['year'] : null,
            'theme' => isset($validated['theme']) ? (int) $validated['theme'] : null,
            'page' => isset($validated['page']) ? (int) $validated['page'] : null,
        ];
    }

    private function sanitizeQuery(mixed $value): ?string
    {
        if (! is_string($value) && ! is_numeric($value)) {
            return null;
        }

        $value = (string) $value;
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = strip_tags($value);
        $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');

        if ($value === '') {
            return null;
        }

        return Str::limit($value, 200, '');
    }

    private function sanitizeSlug(mixed $value): ?string
    {
        if (! is_string($value) && ! is_numeric($value)) {
            return null;
        }

        $value = strtolower(trim((string) $value));
        $value = preg_replace('/[^a-z0-9\-]/', '', $value) ?? '';
        $value = trim($value, '-');

        if ($value === '') {
            return null;
        }

        return Str::limit($value, 100, '');
    }

    private function sanitizeBoundedInt(mixed $value, int $min, int $max): ?int
    {
        if (is_array($value) || $value === null || $value === '') {
            return null;
        }

        if (! is_numeric($value)) {
            return null;
        }

        $int = (int) $value;

        if ($int < $min || $int > $max) {
            return null;
        }

        return $int;
    }
}
