<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class PublishedStoryRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'link' => ['required', 'url', 'max:255'],
            'fellow_id' => ['required', 'numeric', 'exists:fellows,id'],
            'images' => ['nullable', 'array'],
            'images.*' => $this->whenUploaded('images', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'link.required' => 'Please enter a link.',
            'link.url' => 'Please enter a valid URL.',
            'fellow_id.required' => 'Please select a fellow.',
            'fellow_id.exists' => 'The selected fellow is invalid.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Each image must be a JPEG, PNG, JPG, or WebP file.',
            'images.*.max' => 'Each image must not be larger than 2 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'fellow_id' => 'fellow',
        ];
    }
}
