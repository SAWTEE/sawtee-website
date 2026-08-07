<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class ArticleRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'publication_id' => ['required', 'numeric', 'exists:publications,id'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'author' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
            'tags' => ['nullable', 'array'],
            'tags.*' => ['numeric', 'exists:tags,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'publication_id.required' => 'Please select a publication.',
            'publication_id.exists' => 'The selected publication is invalid.',
            'image.image' => 'The featured image must be an image file.',
            'image.mimes' => 'Featured image must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Featured image must not be larger than 2 MB.',
            'tags.*.exists' => 'One or more selected tags are invalid.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'publication_id' => 'publication',
            'published_at' => 'publish date',
            'meta_title' => 'meta title',
            'meta_description' => 'meta description',
        ];
    }
}
